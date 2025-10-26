import Link from 'next/link'

import {
  BookOpenTextIcon,
  ClockFadingIcon,
  FileTextIcon,
  FileVideoIcon,
  SparklesIcon
} from 'lucide-react'

import { format } from 'date-fns'
import Markdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

import { formatDuration } from '@/lib/utils'

import { GeneratedAvatar } from '@/components/generated-avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { MeetingGetOne } from '../../types'

import 'katex/dist/katex.min.css'

interface CompletedStateProps {
  data: MeetingGetOne
}

const CompletedState = ({ data }: CompletedStateProps) => {
  return (
    <div className='flex flex-col gap-y-4'>
      <Tabs defaultValue='summary'>
        <div className='rounded-lg border bg-white px-3'>
          <ScrollArea>
            <TabsList className='bg-background flex h-13 flex-row justify-start gap-x-2 rounded-none p-0'>
              <TabsTrigger
                value='summary'
                className='text-muted-foreground bg-background data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground hover:text-accent-foreground h-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none'
              >
                <BookOpenTextIcon />
                Summary
              </TabsTrigger>

              <TabsTrigger
                value='transcript'
                className='text-muted-foreground bg-background data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground hover:text-accent-foreground h-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none'
              >
                <FileTextIcon />
                Transcript
              </TabsTrigger>

              <TabsTrigger
                value='recording'
                className='text-muted-foreground bg-background data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground hover:text-accent-foreground h-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none'
              >
                <FileVideoIcon />
                Recording
              </TabsTrigger>

              <TabsTrigger
                value='chat'
                className='text-muted-foreground bg-background data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground hover:text-accent-foreground h-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none'
              >
                <SparklesIcon />
                Ask AI
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </div>

        <TabsContent value='recording'>
          <div className='rounded-lg border bg-white px-4 py-5'>
            <video
              src={data.recordingUrl!}
              controls
              className='aspect-video w-full rounded-lg'
            />
          </div>
        </TabsContent>

        <TabsContent value='summary'>
          <div className='rounded-lg border bg-white'>
            <div className='col-span-5 flex flex-col gap-y-5 px-4 py-5'>
              <h2 className='text-2xl font-semibold capitalize'>{data.name}</h2>
              <div className='flex items-center gap-x-2'>
                <Link
                  href={`agents/${data.agentId}`}
                  className='flex items-center gap-x-2 text-sm font-semibold capitalize underline underline-offset-4'
                >
                  <GeneratedAvatar
                    variant='botttsNeutral'
                    seed={data.agent.name}
                    className='size-6'
                  />
                  {data.agent.name}
                </Link>

                <p className='text-muted-foreground text-sm'>
                  {data.startedAt ? format(data.startedAt, 'PPP') : 'Unknown'}
                </p>
              </div>
              <div className='flex gap-x-4'>
                <div className='flex items-center gap-x-2'>
                  <SparklesIcon className='size-4 text-yellow-600' />
                  <p className='font-semibold text-amber-600'>
                    General summary
                  </p>
                </div>
                <Badge
                  variant='outline'
                  className='flex items-center gap-x-2 font-semibold [&>svg]:size-4'
                >
                  <ClockFadingIcon className='text-blue-700' />
                  {data.duration
                    ? formatDuration(data.duration)
                    : 'No duration'}
                </Badge>
              </div>
              <div className='[&_.katex]:text-blue-700 [&_.katex-display]:my-4 [&_.katex-display]:overflow-x-auto'>
                <Markdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[
                    [
                      rehypeKatex,
                      { output: 'html', throwOnError: false, strict: 'ignore' }
                    ]
                  ]}
                  components={{
                    h1: props => (
                      <h1 className='mb-6 text-2xl font-semibold' {...props} />
                    ),
                    h2: props => (
                      <h2 className='mb-4 text-xl font-semibold' {...props} />
                    ),
                    h3: props => (
                      <h3 className='mb-2 text-lg font-semibold' {...props} />
                    ),
                    h4: props => (
                      <h4 className='mb-2 text-base font-semibold' {...props} />
                    ),
                    p: props => (
                      <p className='mb-4 leading-relaxed' {...props} />
                    ),
                    ul: props => (
                      <ul className='mb-4 list-inside list-disc' {...props} />
                    ),
                    ol: props => (
                      <ol
                        className='mb-4 list-inside list-decimal'
                        {...props}
                      />
                    ),
                    li: props => <li className='mb-2' {...props} />,
                    a: props => (
                      <a className='text-blue-600 underline' {...props} />
                    ),
                    strong: props => (
                      <strong className='font-semibold' {...props} />
                    ),
                    pre: props => (
                      <pre
                        className='bg-muted mb-4 overflow-x-auto rounded-lg p-4'
                        {...props}
                      />
                    ),
                    code: props => (
                      <code
                        className='bg-muted rounded px-1 font-mono text-sm'
                        {...props}
                      />
                    ),
                    blockquote: props => (
                      <blockquote
                        className='border-l-2 pl-4 italic'
                        {...props}
                      />
                    )
                  }}
                >
                  {data.summary}
                </Markdown>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { CompletedState }
