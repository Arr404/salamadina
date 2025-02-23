'use client'

// Type Imports
import { useEffect, useState } from 'react'

import type { ChildrenType } from '@core/types'

// Component Imports
import Footer from '@components/layout/front-pages/Footer'
import Header from '@components/layout/front-pages/Header'


// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'
import Loading from '@views/loading/page'

const FrontLayout = ({ children }: ChildrenType) => {
  // Vars
  const mode = 'light'
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={frontLayoutClasses.root}>
      <Header mode={mode} setIsLoading={setIsLoading} />
      {isLoading ? (
        <>
          <Loading/>
        </>
        ) : (
        <>

          {children}
          <Footer mode={mode} />
        </>
      )}

    </div>
  )
}

export default FrontLayout
