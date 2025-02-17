import GitHubIcon from '@mui/icons-material/GitHub' // Import GitHub icon
import PrivacyTip from '@mui/icons-material/PrivacyTip'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { SPACING } from 'theme'

const Footer = () => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        borderRadius: '10px',
        maxWidth: '100%',
        width: '462px',
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        padding: '20px 0',
        marginTop: `${SPACING.MEDIUM}px`
      }}
    >
      <Grid container justifyContent="center" spacing={4}>
        <Grid item>
          <Link href="https://travisbumgarner.dev" target="_blank" color="inherit" underline="hover">
            <PrivacyTip sx={{ verticalAlign: 'middle', mr: 1 }} />
            <Typography variant="body1" component="span">
              More from the Creator
            </Typography>
          </Link>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Footer
