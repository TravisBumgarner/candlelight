import {
  Alert,
  Button,
  Container,
  Snackbar,
  TextField,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import { COLORS, SPACING } from 'theme'
import { submitContactForm } from '../firebase'

const ContactForm: React.FC = () => {
  const [success, setSuccess] = React.useState(false)
  const [failure, setFailure] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: 'ideas-down-quickly'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    setIsSubmitting(true)
    e.preventDefault()
    const response = (await submitContactForm(formData)) as any
    if (response.data) {
      setSuccess(true)
      setFormData(prev => ({
        ...prev,
...{
          name: '',
          email: '',
          message: ''
        }
      }))
    } else {
      setFailure(true)
    }
    setIsSubmitting(false)
  }

  const handleClose = () => {
    setSuccess(false)
  }

  return (
    <Container css={{ padding: SPACING.MEDIUM, width: '462px', maxWidth: '100%', backgroundColor: COLORS.NEUTRAL[800], marginTop: SPACING.MEDIUM }}>
      <Typography variant="h2" align="center" gutterBottom>
        Contact
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email (Optional)"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
        <Button disabled={isSubmitting} type="submit" variant="text" color="primary" fullWidth>
          Submit
        </Button>
      </form>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} color="info" sx={{ width: '100%' }}>
          Your message has been sent!
        </Alert>
      </Snackbar>

      <Snackbar
        open={failure}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} color="error" sx={{ width: '100%' }}>
          Your message failed to send. Please try again later.
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default ContactForm
