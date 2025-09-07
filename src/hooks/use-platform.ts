import { useMemo } from 'react'

type Platform = 'mac' | 'windows' | 'linux' | 'unknown'

interface NavigatorUAData {
  platform?: string
  getHighEntropyValues?: (hints: string[]) => Promise<NavigatorUAData>
}

declare global {
  interface Navigator {
    userAgentData?: NavigatorUAData
  }
}

const detectPlatform = (): Platform => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'unknown'
  }

  if ('userAgentData' in navigator && navigator.userAgentData?.platform) {
    const platform = navigator.userAgentData.platform.toLowerCase()

    if (platform.includes('mac')) return 'mac'
    if (platform.includes('win')) return 'windows'
    if (platform.includes('linux')) return 'linux'
  }

  const userAgent = navigator.userAgent.toLowerCase()

  if (userAgent.includes('mac os') || userAgent.includes('darwin')) {
    return 'mac'
  }

  if (
    userAgent.includes('windows') ||
    userAgent.includes('win32') ||
    userAgent.includes('win64')
  ) {
    return 'windows'
  }

  if (userAgent.includes('linux') || userAgent.includes('x11')) {
    return 'linux'
  }

  if (
    userAgent.includes('iphone') ||
    userAgent.includes('ipad') ||
    userAgent.includes('ipod')
  ) {
    return 'mac'
  }

  if (userAgent.includes('android')) {
    return 'linux'
  }

  return 'unknown'
}

export const usePlatform = () => {
  const platform = detectPlatform()

  const platformInfo = useMemo(() => {
    const getModifierKey = () => {
      return platform === 'mac' ? '⌘' : 'Ctrl'
    }

    const getShortcut = (key: string) => {
      return `${getModifierKey()}+${key}`
    }

    return {
      platform,
      isMac: platform === 'mac',
      isWindows: platform === 'windows',
      isLinux: platform === 'linux',
      getModifierKey,
      getShortcut
    }
  }, [platform])

  return platformInfo
}
