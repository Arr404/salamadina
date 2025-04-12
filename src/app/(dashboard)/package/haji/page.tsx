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
    "Haji Kuota": ["Gold","Silver"],
    "Haji Furoda": ["Gold","Silver"],
  };
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} className={'bg-white'}>
        <UmrahPackagesManagement type={'hajiPackages'} title={"Haji Management"} packageTypes={packageTypes}/>
      </Grid>
      <Grid item xs={12} className={'bg-white mt-10'}>
        <DynamicFiltersManagement />
      </Grid>
    </Grid>
  )
}

export default FormWizard
