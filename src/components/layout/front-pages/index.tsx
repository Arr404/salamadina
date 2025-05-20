'use client'

// Type Imports
import { useState } from 'react'

import type { ChildrenType } from '@core/types'

// Component Imports
import Footer from '@components/layout/front-pages/Footer'
import Header from '@components/layout/front-pages/Header'


// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'
import LoadingWrapper from '@views/loading'
import classnames from 'classnames'
import styles from '@components/layout/front-pages/styles.module.css'

const FrontLayout = ({ children }: ChildrenType) => {
  // Vars
  const mode = 'light'
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div  className={`${classnames(frontLayoutClasses.root, styles.frontLayout)}`} >
      <Header mode={mode} setIsLoading={setIsLoading} />
      {isLoading ? (
        <>
          <LoadingWrapper/>
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
