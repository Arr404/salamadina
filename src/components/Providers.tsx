// Type Imports
import { light } from '@mui/material/styles/createPalette'
import ThemeProvider from '@components/theme'
import type { ChildrenType,Direction } from '@core/types'

// Context Imports
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'

// Util Imports
import { getSettingsFromCookie } from '@core/utils/serverHelpers'
import ReduxProvider from '@/redux-store/ReduxProvider'




type Props = ChildrenType & {
  direction: Direction
}

const Providers = (props: Props) => {
  // Props
  const { children } = props

  const settingsCookie = getSettingsFromCookie()

  return (
    <VerticalNavProvider>
      <SettingsProvider settingsCookie={settingsCookie}>
        <ThemeProvider direction={"ltr"} systemMode={"light"}>
          <ReduxProvider>{children}</ReduxProvider>
        </ThemeProvider>
      </SettingsProvider>
    </VerticalNavProvider>
  )
}

export default Providers
