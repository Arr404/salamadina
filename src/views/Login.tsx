'use client'

// React Imports
import { useState, useRef, useEffect } from 'react'
import type { RefObject, ChangeEvent } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

// Third-party Imports
import classnames from 'classnames'
import ReCAPTCHA from 'react-google-recaptcha'
import type { ReCAPTCHAProps } from 'react-google-recaptcha'

// Firebase Imports
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth'

// Type Imports
import type { SystemMode } from '@core/types'

// Component Imports
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'
import { loginWithEmailPassword, loginWithGoogle, resetPassword } from '@/services/auth'

// Firebase configuration
// Replace with your own Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

// Styled Custom Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 680,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

// Rate limiting variables
const MAX_FAILED_ATTEMPTS = 3
const LOCKOUT_TIME = 30 * 60 * 1000 // 30 minutes in milliseconds

const LoginV2 = () => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutEndTime, setLockoutEndTime] = useState(0)
  const [showCaptcha, setShowCaptcha] = useState(false)

  const recaptchaRef = useRef<ReCAPTCHA>(null)

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'

  // Hooks
  const router = useRouter()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant("light", lightImg, darkImg)

  // Check if account is locked on load and setup timer if needed
  useEffect(() => {
    const storedLockTime = localStorage.getItem('accountLockTime')
    const storedFailedAttempts = localStorage.getItem('failedLoginAttempts')

    if (storedFailedAttempts) {
      setFailedAttempts(parseInt(storedFailedAttempts))

      // Show captcha after certain number of attempts
      if (parseInt(storedFailedAttempts) >= 2) {
        setShowCaptcha(true)
      }
    }

    if (storedLockTime) {
      const lockTime = parseInt(storedLockTime)
      if (lockTime > Date.now()) {
        setIsLocked(true)
        setLockoutEndTime(lockTime)

        // Set a timer to unlock
        const timerId = setTimeout(() => {
          setIsLocked(false)
          localStorage.removeItem('accountLockTime')
        }, lockTime - Date.now())

        return () => clearTimeout(timerId)
      } else {
        localStorage.removeItem('accountLockTime')
      }
    }
  }, [])

  // Update remaining lockout time
  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined
    if (isLocked && lockoutEndTime > Date.now()) {
      interval = setInterval(() => {
        if (lockoutEndTime <= Date.now()) {
          setIsLocked(false)
          localStorage.removeItem('accountLockTime')
          clearInterval(interval)
        }
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isLocked, lockoutEndTime])

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value)
  }

  const incrementFailedAttempts = () => {
    const newCount = failedAttempts + 1
    setFailedAttempts(newCount)
    localStorage.setItem('failedLoginAttempts', newCount.toString())

    // Show captcha after 2 failed attempts
    if (newCount >= 2) {
      setShowCaptcha(true)
    }

    // Lock account after MAX_FAILED_ATTEMPTS
    if (newCount >= MAX_FAILED_ATTEMPTS) {
      const lockoutEnd = Date.now() + LOCKOUT_TIME
      setIsLocked(true)
      setLockoutEndTime(lockoutEnd)
      localStorage.setItem('accountLockTime', lockoutEnd.toString())
    }
  }

  const resetFailedAttempts = () => {
    setFailedAttempts(0)
    localStorage.removeItem('failedLoginAttempts')
    setShowCaptcha(false)
  }

  const getLockoutTimeRemaining = () => {
    const remainingMs = lockoutEndTime - Date.now()
    if (remainingMs <= 0) return '0 seconds'

    const minutes = Math.floor(remainingMs / 60000)
    const seconds = Math.floor((remainingMs % 60000) / 1000)

    return `${minutes} minutes and ${seconds} seconds`
  }

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Check if account is locked
    if (isLocked) {
      setError(`Too many failed attempts. Account is locked for ${getLockoutTimeRemaining()}.`)
      return
    }

    // Validate captcha if shown
    if (showCaptcha && !captchaValue) {
      setError('Please complete the reCAPTCHA verification')
      return
    }

    setIsLoading(true)
    setError('')

    // In a real implementation, you would verify the captcha token on the server-side
    // For this example, we'll simulate the captcha verification as successful

    const authPromise = loginWithEmailPassword(email, password)

    authPromise
      .then(() => {
        resetFailedAttempts() // Reset counter on successful login
        router.push('/admin/gallery')
      })
      .catch((error) => {
        console.error('Authentication error:', error)
        setError(error.message || 'Authentication failed. Please try again.')
        incrementFailedAttempts()

        // Reset captcha
        if (recaptchaRef.current) {
          recaptchaRef.current.reset()
          setCaptchaValue(null)
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleGoogleSignIn = () => {
    // Check if account is locked
    if (isLocked) {
      setError(`Too many failed attempts. Account is locked for ${getLockoutTimeRemaining()}.`)
      return
    }

    setIsLoading(true)
    setError('')

    loginWithGoogle()
      .then(() => {
        resetFailedAttempts() // Reset counter on successful login
        router.push('/admin/gallery')
      })
      .catch((error) => {
        console.error('Google Sign-in error:', error)
        setError(error.message || 'Google sign-in failed. Please try again.')
        incrementFailedAttempts()
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleForgotPassword = () => {
    if (!email) {
      setError('Please enter your email address first')
      return
    }

    resetPassword(email)
      .then(() => {
        alert('Password reset email sent! Check your inbox')
      })
      .catch((error) => {
        console.error('Password reset error:', error)
        setError(error.message || 'Failed to send reset email. Please try again.')
      })
  }

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <div className="relative w-full h-full">
          <img
            src="/images/gallery/3 Februari/IMG-20250205-WA0051.jpg"
            alt="image"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
        </div>

        {!hidden && (
          <MaskImg
            alt='mask'
            src={authBackground}
            className={classnames({ 'scale-x-[-1]': theme.direction === 'rtl' })}
          />
        )}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link href='/landing' className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <img
            src="/images/logo-white.png"
            alt="Company Logo"
            width="10"
            height="5"
            className="w-auto h-[4rem] md:block hidden max-w-full"
            sizes="(max-width: 768px) 7px, (max-width: 1200px) 24px, 32px"
          />
          <img
            src="/images/logos.png"
            alt="Company Logo"
            width="10"
            height="5"
            className="w-auto h-[4rem] md:hidden block max-w-full"
            sizes="(max-width: 768px) 7px, (max-width: 1200px) 24px, 32px"
          />
        </Link>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}! 👋🏻`}</Typography>
            <Typography>{isSignUp ? 'Create your account and start the adventure' : 'Please sign-in to your account and start the adventure'}</Typography>
          </div>

          {error && <Alert severity="error">{error}</Alert>}

          {isLocked && (
            <Alert severity="warning">
              Account temporarily locked due to too many failed attempts.
              Please try again in {getLockoutTimeRemaining()}.
            </Alert>
          )}

          <form
            noValidate
            autoComplete='off'
            onSubmit={handleLogin}
            className='flex flex-col gap-5'
          >
            <CustomTextField
              autoFocus
              fullWidth
              label='Email'
              placeholder='Enter your email'
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              disabled={isLocked}
            />
            <CustomTextField
              fullWidth
              label='Password'
              placeholder='············'
              id='outlined-adornment-password'
              type={isPasswordShown ? 'text' : 'password'}
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              disabled={isLocked}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                      <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {showCaptcha && (
              <div className="flex justify-center my-2">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
                  onChange={handleCaptchaChange}
                />
              </div>
            )}

            <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
              <FormControlLabel
                control={<Checkbox checked={rememberMe} onChange={(e: ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)} disabled={isLocked} />}
                label='Remember me'
              />
              <Typography
                className='text-end cursor-pointer'
                color='primary'
                onClick={handleForgotPassword}
              >
                Forgot password?
              </Typography>
            </div>
            <Button
              fullWidth
              variant='contained'
              type='submit'
              disabled={isLoading || isLocked || (showCaptcha && !captchaValue)}
            >
              {isLoading ? <CircularProgress size={24} /> : isSignUp ? 'Sign Up' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginV2
