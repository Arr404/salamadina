'use client'

// Component Imports
import PackageViewDetails from '@views/umrah/PackageDetail'
import { useSearchParams } from 'next/navigation'

const Page = () => {
  const searchParams = useSearchParams();
  const id = searchParams?.get('id') as string;

  return <PackageViewDetails packageId={id} type={'hajiPackages'}/>
}

export default Page
