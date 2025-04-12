// Next Imports
import Link from 'next/link'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Styled Component Imports
import UmrahPackagesManagement from '@views/package/umrah/TravelPackageManagement'
import DynamicFiltersManagement from '@views/package/umrah/dynamicFiltersManagement'


const FormWizard = () => {
  // Package types configuration
  const packageTypes: { [key: string]: string[] } = {
    "Umrah Reguler": ["Umrah Ceria", "Umrah Cermat", "Umrah Istimewa"],
    "Umrah Edu Trip": ["Manajemen", "Daurah Pelajar"],
    "Umrah Corporate": ["Bronze", "Silver", "Premium"],
    "Umrah Plus Mancanegara": ["Turki", "Mesir"],
    "Umrah Prestige": ["Gold", "Platinum"],
    "Umrah Mandiri": [],
    "Umrah Custom/Community": []
  };
  return (
    <Grid container spacing={6}>

      <Grid item xs={12} className={'bg-white'}>
        <UmrahPackagesManagement type={'umrahPackages'} title={"Umrah Management"} packageTypes={packageTypes}/>
      </Grid>
      <Grid item xs={12} className={'bg-white mt-10'}>
        <DynamicFiltersManagement />
      </Grid>
    </Grid>
  )
}

export default FormWizard
