import {
  createTheme,
  css,
  type LinkProps,
  type PaletteOptions
} from '@mui/material'
import { forwardRef } from 'react'
import {
  Link as RouterLink,
  type LinkProps as RouterLinkProps
} from 'react-router-dom'

import Background from './static/background.png'

const paletteBase: Partial<PaletteOptions> = {
  primary: {
    main: '#00C1FF'
  },
  secondary: {
    main: '#8F0DF2'
  },
  text: {
    primary: '#C7CFD1',
    secondary: '#C7CFD1'
  },
  action: {
    disabled: '#8F9EA3'
  },
  background: {
    paper: '#3A4D53',
    default: '#2C3B40'
  },
  warning: {
    main: '#FFB800'
  },
  error: {
    main: '#FF0099'
  }
}

const LinkBehavior = forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props
  return <RouterLink ref={ref} to={href} {...other} />
})
LinkBehavior.displayName = 'LinkBehavior'

export const theme = createTheme({
  palette: paletteBase,
  typography: {
    h2: {
      fontSize: '1.8rem',
      fontWeight: 700
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700
    },
    h4: {
      fontSize: '1.25rem'
    }
  },
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior
      } as LinkProps
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `url(${Background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }
      }
    }
  }
})

export const COLORS = {
  NEUTRAL: {
    100: '#E3E7E8',
    200: '#C7CFD1',
    300: '#ABB7BA',
    400: '#8F9EA3',
    500: '#73868C',
    600: '#5C6B70',
    700: '#475E66',
    800: '#3A4D53',
    900: '#2C3B40',
    1000: '#1F2A2D'
  },
  PRIMARY: {
    100: '#CCF3FF',
    200: '#66DAFF',
    300: '#00C1FF',
    400: '#007499',
    500: '#002733'
  },
  SECONDARY: {
    100: '#E9CFFC',
    200: '#BC6EF7',
    300: '#8F0DF2',
    400: '#720AC2',
    500: '#560891'
  },
  SUCCESS: {
    100: '#CCFFDD',
    200: '#66FF99',
    300: '#00FF55',
    400: '#00CC44',
    500: '#009933'
  },
  WARNING: {
    100: '#FFF1CC',
    200: '#FFD466',
    300: '#FFB800',
    400: '#996E00',
    500: '#332500'
  },
  ERROR: {
    100: '#FFCCEB',
    200: '#FF66C2',
    300: '#FF0099',
    400: '#CC007A',
    500: '#99005C'
  },
  MISC: {
    TRANSPARENT: 'TRANSPARENT',
    BLACK: '#000',
    WHITE: '#FFF'
  },
  LABELS: {
    1: '#FF1A1A',
    2: '#FF5F1A',
    3: '#FFB905',
    4: '#EEFF26',
    5: '#73FF31',
    6: '#26FFD8',
    7: '#33DAFF',
    8: '#2DA7FF',
    9: '#2562FF',
    10: '#6B25FF',
    11: '#C425FF',
    12: '#FF25CF',
    13: '#FF2567',
    14: '#FFFFFF',
    15: '#e0e0e0',
    16: '#b3b3b3',
    17: '#6d6d6d',
    18: '#424242',
    19: '#272727',
    20: '#ffb3b3',
    21: '#ffcab3',
    22: '#ffecb3',
    23: '#FFFFB3',
    24: '#d1ffb3',
    25: '#B3FFB3',
    26: '#b3ffe8',
    27: '#b3f0ff',
    28: '#d6b3ff',
    29: '#FFB3FF'
  }
} as const

export const BORDER_RADIUS = {
  NONE: 0,
  SMALL: 4,
  MEDIUM: 8,
  LARGE: 12
} as const

export const SPACING = {
  XXSMALL: 4,
  XSMALL: 8,
  SMALL: 12,
  MEDIUM: 16,
  LARGE: 24,
  XLARGE: 32,
  XXLARGE: 48
} as const

export const BORDER_WIDTH = {
  NONE: 0,
  XSMALL: 1,
  SMALL: 2,
  MEDIUM: 4,
  LARGE: 8
} as const

export const pageWrapperCSS = css`
  box-sizing: border-box;
  overflow-y: auto;
  max-width: 800px !important;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
`
