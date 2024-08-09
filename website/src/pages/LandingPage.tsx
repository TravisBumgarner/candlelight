import { Box, Container, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import { COLORS, pageWrapperCSS, SPACING } from 'theme'
import { Contact, Footer } from '../components'
import Header from '../static/header.png'

const Section = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '462px',
  maxWidth: '100%',
  backgroundColor: COLORS.NEUTRAL[700],
  justifyContent: 'center',
  padding: SPACING.MEDIUM
}))

const LandingPage = () => {
  return (
    <Container css={pageWrapperCSS}>
      <img css={{ maxWidth: '100%', marginBottom: SPACING.LARGE }} src={Header} />

    <Section css={{ }}>
    <Typography textAlign='center' variant='h2'> Build with us:<br />
      <Link target="_blank" css={linkCSS} to="https://twitch.tv/sillysideprojects">Twitch</Link><br />
      <Link target="_blank" css={linkCSS} to="https://www.youtube.com/@SillySideProjects">Youtube</Link><br />
      <Link target="_blank" css={linkCSS} to="https://discord.gg/ymChU9W73c">Discord</Link>

      </Typography>
    </Section>

    <Contact />

    <Footer />
    </Container >
  )
}

const linkCSS = { color: COLORS.PRIMARY[300] }

export default LandingPage
