// Next Imports
import Link from 'next/link'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Styled Component Imports
import AddAgents from '@views/admin/agent/AddAgents'


const FormWizard = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>Agent Management</Typography>
      </Grid>
      <Grid item xs={12}>
        <AddAgents />
      </Grid>

    </Grid>
  )
}

export default FormWizard
