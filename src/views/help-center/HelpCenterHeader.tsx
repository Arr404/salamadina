// MUI Imports
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'


// Styles imports
import styles from './styles.module.css'

/*// Styled TextField component
const CustomTextFieldStyled = styled(CustomTextField)<TextFieldProps>(({ theme }) => ({
  '& .MuiInputBase-root.MuiFilledInput-root': {
    width: '100%',
    backgroundColor: 'var(--mui-palette-background-paper) !important'
  },
  [theme.breakpoints.up('sm')]: {
    width: '55%'
  }
}))*/


const HelpCenterHeader = () => {
  return (
    <section className={classnames('-mbs-[18%] sm:mbs-[-10%] lg:mbs-[-5%] md:mbs-[-8%]', styles.bgImage)}>
      <div
        className={classnames(
          'flex flex-col gap-4 items-center text-center pbs-[150px] lg:pbs-[168px] pbe-[40px] sm:pbe-[100px] pli-5'
        )}
      >
        <Typography variant='h4' color='primary'>
          Hello, how can we help?
        </Typography>
        {/*<CustomTextFieldStyled
          className='is-full sm:max-is-[55%] md:max-is-[465px]'
          placeholder=''
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <i className='tabler-search' />
              </InputAdornment>
            )
          }}
        />*/}
        <Typography></Typography>
      </div>
    </section>
  )
}

export default HelpCenterHeader
