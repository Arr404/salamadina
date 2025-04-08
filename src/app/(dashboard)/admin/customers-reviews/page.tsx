// Next Imports
import Link from 'next/link'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import AddReview from '@/views/admin/customer-review/AddReview'

// Styled Component Imports



const FormWizard = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>Custom Horizontal Stepper</Typography>
      </Grid>
      <Grid item xs={12}>
        <AddReview />
      </Grid>

    </Grid>
  )
}

export default FormWizard
