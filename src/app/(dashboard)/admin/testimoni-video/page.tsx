// Next Imports
import Link from 'next/link'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Styled Component Imports
import AddTestimoni from '@views/admin/testimoni-video/AddTestimoni'


const FormWizard = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>Custom Horizontal Stepper</Typography>
      </Grid>
      <Grid item xs={12}>
        <AddTestimoni />
      </Grid>

    </Grid>
  )
}

export default FormWizard
