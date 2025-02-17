import { Box, Container, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import { COLORS, pageWrapperCSS, SPACING } from 'theme'
import { Contact, Footer } from '../components'
import Header from '../static/header.png'
import { borderRadius } from 'polished'

const Section = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '462px',
  maxWidth: '100%',
  backgroundColor: COLORS.NEUTRAL[800],
  justifyContent: 'center',
  padding: SPACING.MEDIUM,
  borderRadius: '10px'
}))

const LandingPage = () => {
  return (
    <Container css={pageWrapperCSS}>
      <img css={{ maxWidth: '100%', borderRadius: '10px', marginBottom: SPACING.LARGE }} src={Header} />

    <Section css={{ }}>
    <Typography textAlign='center' variant='h2'>Learn More<br />
      <Link target="_blank" css={linkCSS} to="https://discord.com/invite/J8jwMxEEff">Join the Community</Link><br />
      <Link target="_blank" css={linkCSS} to="https://store.steampowered.com/app/3157820/Candlelight/">Steam Store</Link><br />

      </Typography>
    </Section>

    <Contact />

    <Footer />
    </Container >
  )
}

const linkCSS = { color: COLORS.PRIMARY[300] }

export default LandingPage
