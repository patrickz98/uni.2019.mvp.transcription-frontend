//deleteable

// import React from 'react';
// import Avatar from '@material-ui/core/Avatar';
// import Button from '@material-ui/core/Button';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import Link from '@material-ui/core/Link';
// import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
// import Typography from '@material-ui/core/Typography';
// import {makeStyles} from '@material-ui/core/styles';
// import Container from '@material-ui/core/Container';
// import {borderRadius} from '@material-ui/system';
// import hintergrund from './hintergrund.jpg';
// import InputAdornment from '@material-ui/core/InputAdornment';
// import AccountCircle from '@material-ui/icons/AccountCircle';
// import VpnKey from '@material-ui/icons/VpnKey';
// import Visibility from '@material-ui/icons/Visibility';
// import VisibilityOff from '@material-ui/icons/VisibilityOff';
// import FormControl from '@material-ui/core/FormControl';
// import clsx from 'clsx';
// import IconButton from '@material-ui/core/IconButton';
// import OutlinedInput from '@material-ui/core/OutlinedInput';
// import InputLabel from '@material-ui/core/InputLabel';
//
//
// function App() {
//     return (
//         <div styles={{backgroundImage: `url(${hintergrund})`}}><h1>This is red car</h1>
//         </div>
//     );
// }
//
//
// function Copyright() {
//     return (
//         <Typography variant="body2" color="textSecondary" align="center">
//             {'Copyright © '}
//             <Link color="inherit" href="https://material-ui.com/">
//                 TeamChicken.de
//             </Link>{' '}
//             {new Date().getFullYear()}
//             {'.'}
//         </Typography>
//     );
// }
//
// const useStyles = makeStyles(theme => ({
//
//
//     paper: {
//         marginTop: theme.spacing(8),
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//
//
//     },
//     /*
//     avatar: {
//       margin: theme.spacing(5),
//       backgroundColor:'#75926D',
//
//     },
//     */
//     form: {
//         width: '100%', // Fix IE 11 issue.
//         backgroundColor: '#ffffff',
//
//
//     },
//     submit: {
//         margin: theme.spacing(1, 0, 2),
//         backgroundColor: '#2196f3',
//         border: '1px solid',
//         borderColor: '#000000',
//
//         color: '#ffffff',
//     },
//
//
//     tf1: {
//         margin: theme.spacing(1, 0, 2),
//
//         backgroundColor: '#ffffff',
//
//     },
//     tf2: {
//         margin: theme.spacing(1, 0, 2),
//         backgroundColor: '#ffffff',
//
//
//     },
//
//     tf3: {},
//
//
// }));
// /*
// document.body.style.backgroundImage = "url('hintergrund.jpg')";
// document.body.style.backgroundPosition = "center";
// document.body.style.backgroundRepeat = "repeat-y";
// document.body.style.backgroundSize = "100% ";
// */
//
//
// export default function SignIn() {
//     const classes = useStyles();
//
//     const [values, setValues] = React.useState({
//
//         password: '',
//
//         showPassword: false,
//     });
//
//     const handleChange = prop => event => {
//         setValues({...values, [prop]: event.target.value});
//     };
//
//     const handleClickShowPassword = () => {
//         setValues({...values, showPassword: !values.showPassword});
//     };
//
//     const handleMouseDownPassword = event => {
//         event.preventDefault();
//     };
//
//
//     return (
//
//
//         <Container component="main" maxWidth="xs">
//             <CssBaseline/>
//             <div className={classes.paper}>
//
//                 <img src="logoFreigestellt2.png" width="45%" alt="alternativer_text"/>
//
//
//                 <form className={classes.form} noValidate>
//                     <TextField InputProps={{
//                         classes, disableUnderline: true, startAdornment: (
//                             <InputAdornment position='start'>
//                                 <AccountCircle/>
//                             </InputAdornment>
//                         ),
//                     }}
//
//                                margin="normal"
//
//                                fullWidth
//                                id="email"
//                                label="Email Adresse"
//                                variant="outlined"
//
//                                name="email"
//                                autoComplete="email"
//                                autoFocus
//
//                                className={classes.tf1}
//
//
//                     />
//
//
//                     <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined" fullWidth
//
//                     >
//                         <InputLabel htmlFor="outlined-adornment-password">Passwort</InputLabel>
//                         <OutlinedInput
//                             startAdornment={
//                                 <InputAdornment position="start">
//                                     <VpnKey/>
//                                 </InputAdornment>
//                             }
//
//                             id="outlined-adornment-password"
//                             type={values.showPassword ? 'text' : 'password'}
//                             value={values.password}
//                             onChange={handleChange('password')}
//                             endAdornment={
//                                 <InputAdornment position="end">
//                                     <IconButton
//                                         aria-label="toggle password visibility"
//                                         onClick={handleClickShowPassword}
//                                         onMouseDown={handleMouseDownPassword}
//                                         edge="end"
//                                     >
//                                         {values.showPassword ? <Visibility/> : <VisibilityOff/>}
//                                     </IconButton>
//
//                                 </InputAdornment>
//                             }
//                             labelWidth={70}
//                         />
//
//                     </FormControl>
//
//
//                     <FormControlLabel
//
//                         control={<Checkbox value="remember"/>}
//                         label="Nutzername speichern"
//
//
//                         className={classes.tf3}
//                     />
//                     <Button
//                         type="submit"
//                         fullWidth
//                         variant="contained"
//                         color="#2196f3" className={classes.submit}
//                     >
//                         Anmelden
//                     </Button>
//                     <Grid container>
//                         <Grid item xs>
//                             <Link href="#" variant="body2">
//                                 Passwort Vergessen?
//                             </Link>
//                         </Grid>
//                         <Grid item>
//                             <Link href="#" variant="body2">
//                                 {"Noch kein Konto? Hier Registrieren"}
//                             </Link>
//                         </Grid>
//                     </Grid>
//                 </form>
//             </div>
//             <Box mt={8}>
//                 <Copyright/>
//             </Box>
//         </Container>
//     );
// }