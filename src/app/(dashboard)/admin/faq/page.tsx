// Next Imports
import Link from 'next/link'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import AddFaq from '@views/admin/faq/AddFaq'

// Styled Component Imports



const FormWizard = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>FAQ Management</Typography>
      </Grid>
      <Grid item xs={12}>
        <AddFaq />
      </Grid>

    </Grid>
  )
}

export default FormWizard
