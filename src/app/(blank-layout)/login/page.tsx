'use client'
// Component Imports
import Login from '@views/Login'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { isLogin } from '@/services/auth'


const LoginPage = () => {
  // Vars
  const router = useRouter();
  const [isLoginData, setIsLogin] = useState<'loading' | boolean>(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
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
    if (isLoginData !== false) {
      router.push('/home');
    }
  }, [isLoginData, router]);
  return <Login />
}

export default LoginPage
