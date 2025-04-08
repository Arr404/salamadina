// Next Imports
import Link from 'next/link'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Styled Component Imports
import AddGallery from '@views/admin/gallery/AddGallery'


const FormWizard = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>Custom Horizontal Stepper</Typography>
      </Grid>
      <Grid item xs={12}>
        <AddGallery />
      </Grid>

    </Grid>
  )
}

export default FormWizard
