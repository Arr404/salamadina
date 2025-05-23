// Next Imports
import Link from 'next/link'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import AddFaq from '@views/admin/faq/AddFaq'
import UmrahPackagesManagement from '@views/package/umrah/TravelPackageManagement'
import DynamicFiltersManagement from '@views/package/umrah/dynamicFiltersManagement'

// Styled Component Imports



const FormWizard = () => {
  const packageTypes: { [key: string]: string[] } = {
    "HalalTour Corporate": ["Bronze","Silver","Premium"],
    "HalalTour Explore":["Bronze","Silver","Premium"],
    "HalalTour Edutrip":[]
  };
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} className={'bg-white'}>
        <UmrahPackagesManagement type={'halaltourpPackages'} title={"Halal Tour Management"} packageTypes={packageTypes}/>
      </Grid>
      <Grid item xs={12} className={'bg-white mt-10'}>
        <DynamicFiltersManagement />
      </Grid>

    </Grid>
  )
}

export default FormWizard
