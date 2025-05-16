// Next Imports
import Link from 'next/link'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Styled Component Imports
import TestimonialManagement from '@/views/admin/customer-review/AddReview'



const FormWizard = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>Customer Review Management</Typography>
      </Grid>
      <Grid item xs={12}>
        <TestimonialManagement />
      </Grid>

    </Grid>
  )
}

export default FormWizard
