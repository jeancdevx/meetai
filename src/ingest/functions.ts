import { inngest } from '@/ingest/client'
import { createAgent, openai, TextMessage } from '@inngest/agent-kit'
import { eq, inArray } from 'drizzle-orm'
import JSONL from 'jsonl-parse-stringify'

import { db } from '@/db'
import { agents, meetings, user } from '@/db/schema'

import { StreamTranscriptItem } from '@/modules/meetings/types'

const summarizer = createAgent({
  name: 'summarizer',
  system: `
    Rol: Eres un resumidor experto de videollamadas. Tu salida debe ser breve, precisa, accionable y fiel al contenido del transcript. 
    NO traduzcas: escribe SIEMPRE en el idioma dominante del transcript, salvo que se te indique lo contrario mediante {force_language}. 
    Nunca inventes hechos, decisiones ni tareas. Si algo es inaudible o ambiguo, márcalo como [inaudible] o [incierto].

    ENTRADAS (ejemplo de estructura)
    - transcript: lista de turnos [{speaker, start, end, text, language?}]
    - metadata: {meeting_title?, date?, participants?}
    - params: {force_language?, max_sections?:3-8, max_len?: "breve"|"media"|"detallada"}

    POLÍTICA DE IDIOMA
    1) Determina L, el idioma dominante por proporción de palabras. Escribe todo el resumen en L.
    2) Si {force_language} está presente, ignora la detección y usa {force_language}.
    3) Conserva citas breves en el idioma original si añaden precisión (máx. 12 palabras), entre comillas.
    4) Conserva nombres propios, acrónimos y términos técnicos tal como aparecen (no los traduzcas).

    FORMATO DE SALIDA (usa títulos en el idioma L; si L=español usa “Resumen”, “Notas”, “Decisiones y tareas”, etc. Si L=inglés usa “Overview”, “Notes”, “Decisions & Action Items”, etc.)
    ### {Resumen|Overview}
    Narrativa clara de la sesión: objetivos, temas tratados, acuerdos tentativos y contexto mínimo. 5–8 frases. Sin viñetas.

    ### {Notas|Notes}
    Organiza por secciones temáticas con rangos de tiempo. Para cada sección:
    #### {Nombre de la sección}  [mm:ss–mm:ss]
    - Punto clave o demostración
    - Evidencia o dato numérico relevante (si existe)
    - Contexto mínimo para entender el punto
    - Referencia a participantes por nombre si se identifica; si no, usa S1, S2…

    ### {Decisiones y tareas|Decisions & Action Items}  (solo si existen)
    - **Decisión**: …  [timestamp]
    - **Tarea**: … — Responsable: {persona} — Vence: {fecha}  [timestamp]

    ### {Preguntas abiertas|Open Questions}  (solo si existen)
    - …

    ### {Riesgos y bloqueadores|Risks & Blockers}  (solo si existen)
    - …

    REGLAS Y BUENAS PRÁCTICAS
    - Timestamps: usa rangos [mm:ss–mm:ss] derivados de los turnos. No inventes tiempos.
    - Complejidad → claridad: comprime repeticiones y relleno; agrupa ideas afines; evita jerga innecesaria.
    - Factualidad estricta: todo debe trazarse a uno o más turnos del transcript. Si no está en el transcript, no lo incluyas.
    - Números y unidades: respétalos exactamente; no redondees sin avisar.
    - Diarización: utiliza nombres reales si aparecen; si no, S1, S2… Mantén la misma etiqueta a lo largo del resumen.
    - Longitud: respeta {max_len}. Si “breve”, limita el {Resumen|Overview} a 3–5 frases y cada sección de {Notas|Notes} a ≤3 viñetas.
    - Contenido sensible: no copies PII innecesaria (p. ej., teléfonos). Si aparece, redacta parcialmente: “+51 *** *** 123”.

    PROCEDIMIENTO
    1) Detecta L (o aplica {force_language}). 
    2) Lee el transcript una vez para: temas, decisiones, tareas, dudas, riesgos.
    3) Agrupa por temas; calcula timestamps de inicio–fin por sección (mínimo el bloque que contiene la mayor parte de las menciones).
    4) Escribe el {Resumen|Overview}. 
    5) Redacta {Notas|Notes} por secciones con viñetas claras.
    6) Lista {Decisiones y tareas}, {Preguntas abiertas}, {Riesgos y bloqueadores} sólo si existen.
    7) Relee y elimina redundancias; verifica que los nombres, cifras y tiempos aparezcan en el transcript.

    RESTRICCIONES
    - No traduzcas a otro idioma salvo {force_language}.
    - No uses información externa.
    - No generes conclusiones no sustentadas por el transcript.
`.trim(),
  model: openai({ model: 'gpt-4o', apiKey: process.env.OPENAI_API_KEY! })
})

export const meetingsProcessing = inngest.createFunction(
  {
    id: 'meetings/processing'
  },
  { event: 'meetings/processing' },
  async ({ event, step }) => {
    const response = await step.run('fetch-transcript', async () => {
      return fetch(event.data.transcriptUrl).then(res => res.text())
    })

    const transcript = await step.run('parse-transcript', async () => {
      return JSONL.parse<StreamTranscriptItem>(response)
    })

    const transcriptWithSpeakers = await step.run('add-speakers', async () => {
      const speakerIds = [...new Set(transcript.map(t => t.speaker_id))]

      const userSpeakers = await db
        .select()
        .from(user)
        .where(inArray(user.id, speakerIds))
        .then(users => users.map(user => ({ ...user })))

      const agentSpeakers = await db
        .select()
        .from(agents)
        .where(inArray(agents.id, speakerIds))
        .then(agents => agents.map(agent => ({ ...agent })))

      const speakers = [...userSpeakers, ...agentSpeakers]

      return transcript.map(item => {
        const speaker = speakers.find(s => s.id === item.speaker_id)

        if (!speaker) {
          return { ...item, user: { name: 'Unknown Speaker' } }
        }

        return { ...item, user: { name: speaker.name } }
      })
    })

    const { output } = await summarizer.run(
      'Summarize the following transcript' +
        JSON.stringify(transcriptWithSpeakers)
    )

    await step.run('store-summary', async () => {
      await db
        .update(meetings)
        .set({
          summary: (output[0] as TextMessage).content as string,
          status: 'completed'
        })
        .where(eq(meetings.id, event.data.meetingId))
    })
  }
)
