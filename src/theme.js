import { cyan, deepOrange, orange, teal } from '@mui/material/colors'
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

const theme = extendTheme({
  trello: {
    appBarHeight: '58px',
    boardBarHeight: '60px'
  },
  colorSchemeSelector: 'class',
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: teal[500]
        },
        secondary: {
          main: deepOrange[500]
        }
      }
    },
    dark: {
      palette: {
        primary: {
          main: cyan[500]
        },
        secondary: {
          main: orange[500]
        }
      }
    }
  }
})

export default theme
