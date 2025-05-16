// Next Imports
import Link from 'next/link'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Styled Component Imports
import AddContactPerson from '@views/admin/contact-person/AddContactPerson'


const FormWizard = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>Contact Person Management</Typography>
      </Grid>
      <Grid item xs={12}>
        <AddContactPerson />
      </Grid>

    </Grid>
  )
}

export default FormWizard
