'use client'

import PackageDetailsEditor from '@views/package/umrah/PackageDetailsEditor'
import { Grid, Typography } from '@mui/material'
import { useSearchParams } from 'next/navigation';

export default function PackageDetailsPage() {
  const searchParams = useSearchParams();
  const id = searchParams?.get('id') as string;

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>Umrah Package details</Typography>
      </Grid>
      <Grid item xs={12} className="bg-white mt-10">
        <PackageDetailsEditor packageId={id} tipePaket={'umrahPackages'}/>
      </Grid>
    </Grid>
  )
}
