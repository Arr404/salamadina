// Next Imports
import Link from 'next/link'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Styled Component Imports
import UmrahPackagesManagement from '@views/package/umrah/TravelPackageManagement'
import DynamicFiltersManagement from '@views/package/umrah/dynamicFiltersManagement'


const FormWizard = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>Umrah Package</Typography>
      </Grid>
      <Grid item xs={12} className={'bg-white'}>
        <UmrahPackagesManagement />
      </Grid>
      <Grid item xs={12} className={'bg-white mt-10'}>
        <DynamicFiltersManagement />
      </Grid>
    </Grid>
  )
}

export default FormWizard
