// Next Imports
import Link from 'next/link'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Styled Component Imports
import EditLegalPageSection from '@views/admin/Legalitas/AddLegalitas'


const FormWizard = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>Legalitas Page</Typography>
      </Grid>
      <Grid item xs={12}>
        <EditLegalPageSection />
      </Grid>

    </Grid>
  )
}

export default FormWizard
