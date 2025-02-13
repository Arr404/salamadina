// Third-party Imports
import Cookies from 'js-cookie'

// Type Imports
import type { Settings } from '@core/contexts/settingsContext'
import type { SystemMode } from '@core/types'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Helper to parse cookies
const parseCookies = (cookieString: string): Record<string, string> => {
  return cookieString
    .split('; ')
    .reduce((acc, cookie) => {
      const [key, value] = cookie.split('=')

      acc[key] = decodeURIComponent(value)

  return acc
    }, {} as Record<string, string>)
}

export const getSettingsFromCookie = (): Settings => {
  const cookieName = themeConfig.settingsCookieName
  const cookies = parseCookies(document.cookie)

  return JSON.parse(cookies[cookieName] || '{}')
}

export const getMode = () => {
  const settingsCookie = getSettingsFromCookie()

  // Get mode from cookie or fallback to theme config
  const _mode = settingsCookie.mode || themeConfig.mode

  return _mode
}

export const getSystemMode = (): SystemMode => {
  const mode = getMode()

  const colorPrefCookie = (Cookies.get('colorPref') || 'light') as SystemMode

  return (mode === 'system' ? colorPrefCookie : mode) || 'light'
}

export const getServerMode = () => {
  const mode = getMode()
  const systemMode = getSystemMode()

  return mode === 'system' ? systemMode : mode
}

export const getSkin = () => {
  const settingsCookie = getSettingsFromCookie()

  return settingsCookie.skin || 'default'
}
