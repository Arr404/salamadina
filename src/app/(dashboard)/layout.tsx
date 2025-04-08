'use client'

// MUI Imports
import Button from '@mui/material/Button'

// Type Imports
import type { ChildrenType } from '@core/types'

// Layout Imports
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import HorizontalLayout from '@layouts/HorizontalLayout'

// Component Imports
import Providers from '@components/Providers'
import Navigation from '@components/layout/vertical/Navigation'
import Navbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import ScrollToTop from '@core/components/scroll-to-top'

// Util Imports
import { getDictionary } from '@/utils/getDictionary'
import { getMode, getSystemMode } from '@core/utils/serverHelpers'
import { isLogin } from '@/services/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoadingWrapper from '@views/loading'

const Layout = ({ children }: ChildrenType) => {
  const router = useRouter();
  const [isLoginData, setIsLogin] = useState<'loading' | boolean>('loading');
  const [dictionary, setDictionary] = useState<any>(null);

  const getLanguage = (): 'en' | 'ind' => {
    if (typeof window !== 'undefined') {
      const lang = localStorage.getItem('I18N_LANGUAGE') as string | null;
      return lang === 'en' || lang === 'ind' ? lang : 'en'; // Default to 'en'
    }
    return 'en';
  };

  const direction = 'ltr';
  const mode = getMode();
  const systemMode = getSystemMode();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lang = getLanguage();
        const dict = await getDictionary(lang);
        setDictionary(dict);

        const dataLogin = await isLogin();
        setIsLogin(dataLogin);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLogin(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isLoginData === false) {
      router.push('/login');
    }
  }, [isLoginData, router]);

  const isLoading = isLoginData === 'loading' || !dictionary;

  const renderContent = () => (
    <Providers direction={direction}>
      <LayoutWrapper
        systemMode={systemMode}
        verticalLayout={
          <VerticalLayout
            navigation={<Navigation dictionary={dictionary} mode={mode} systemMode={systemMode} />}
            navbar={<Navbar />}
            footer={<VerticalFooter />}
          >
            {children}
          </VerticalLayout>
        }
      />
      <ScrollToTop className="mui-fixed">
        <Button
          variant="contained"
          className="is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center"
        >
          <i className="tabler-arrow-up" />
        </Button>
      </ScrollToTop>
    </Providers>
  );

  return isLoading ? <LoadingWrapper /> : renderContent();
};


export default Layout
