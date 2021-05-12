import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import
{
    Button,
    CssBaseline,
    TextField,
    FormControlLabel,
    Checkbox,
    Link,
    Grid,
    Box,
    Typography,
    Container,
    InputAdornment,
    IconButton,
} from "@material-ui/core"

import
{
    AccountCircle,
    VpnKey,
    Visibility,
    VisibilityOff,
} from "@material-ui/icons"

import Defines from "./Defines";

function Copyright()
{
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

class SignUpPage extends React.Component
{
    classes = makeStyles(theme => ({
        paper: {
            marginTop: theme.spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        avatar: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main,
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(3),
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
        },
    }));

    constructor(props)
    {
        super(props);

        this.state = {
            firstName: undefined,
            secondName: undefined,
            email: undefined,
            password: undefined,
            routing: false
        };
    }

    onFNameChanged = (event) =>
    {
        this.setState({
            firstName: event.target.value
        });
    };

    onSNameChanged = (event) =>
    {
        this.setState({
            secondName: event.target.value
        });
    };

    onEmailChanged = (event) =>
    {
        this.setState({
            email: event.target.value
        })
    }


    handleClickShowPassword = () =>
    {
        this.setState({
            showPassword: !this.state.showPassword
        });
    };


    onPasswordChanged = (event) =>
    {
        this.setState({ password: event.target.value })
    }

    SignInRouting = (event) =>
    {
        window.location.href = window.location.origin + window.location.pathname + "?page=SignIn";
    }

    safeData = () =>
    {

        var postJSON = {
            "name": this.state.firstName,
            "lastname": this.state.secondName,
            "email": this.state.email,
            "password": this.state.password,
        }
        console.debug(postJSON)

        // postJSON[ "key" ] = "value";

        //todo @k
        //siehe editing page: stringifizieren und dann an server

        if ((this.state.firstName  === "" || this.state.firstName  === undefined) &&
            (this.state.secondName === "" || this.state.secondName === undefined) &&
            (this.state.email      === "" || this.state.email      === undefined) &&
            (this.state.password   === "" || this.state.password   === undefined))
        {
            console.debug("Data Empty");
            window.alert("Fields Empty")
        }
        else
        {

            // fetch(defines.server() + '/userData/' + this.state.uuid, {
            fetch(Defines.server() + '/userData', {
                method: 'POST',
                body: JSON.stringify(postJSON)
            })
                .then(response => response.json())
                .then(data =>
                {
                    console.debug("SignUP: ", data)
                    if (!data.success)
                    {
                        window.alert("Userdata already exist!");
                    }
                    else
                    {
                        this.SignInRouting();
                    }
                })
                .catch(error =>
                {
                    console.error(this.LOGTAG, "onEditorChange", error)
                });
            this.setState({ routing: true });

        }
    }

    render()
    {
        let isFNameErr = false;

        if (this.state.firstName === undefined)
        {
            isFNameErr = false;
        }

        if (this.state.firstName === "")
            isFNameErr = true;


        let isSNameErr = false;

        if (this.state.secondName === undefined)
            isSNameErr = false;

        if (this.state.secondName === "")
            isSNameErr = true;

        let errIsEmailAnEmail = true;
        if ((this.state.email) && this.state.email.match(/^[A-Za-z0-9.-_]+@[A-Za-z0-9.-_]+\.[a-z]+$/))
        {
            errIsEmailAnEmail = false;
        }
        if (this.state.email === undefined)
            errIsEmailAnEmail = false

        let isPWErr = false;
        if (this.state.password === undefined)
            isPWErr = false

        if (this.state.password === "")
            isPWErr = true


        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={this.classes.paper}>
                    <center>
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALUAAACPCAYAAAC8sppiAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAARMaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOklwdGM0eG1wRXh0PSJodHRwOi8vaXB0Yy5vcmcvc3RkL0lwdGM0eG1wRXh0LzIwMDgtMDItMjkvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIj4KICAgICAgICAgPElwdGM0eG1wRXh0OkxvY2F0aW9uQ3JlYXRlZD4KICAgICAgICAgICAgPHJkZjpCYWcvPgogICAgICAgICA8L0lwdGM0eG1wRXh0OkxvY2F0aW9uQ3JlYXRlZD4KICAgICAgICAgPElwdGM0eG1wRXh0OkxvY2F0aW9uU2hvd24+CiAgICAgICAgICAgIDxyZGY6QmFnLz4KICAgICAgICAgPC9JcHRjNHhtcEV4dDpMb2NhdGlvblNob3duPgogICAgICAgICA8SXB0YzR4bXBFeHQ6UmVnaXN0cnlJZD4KICAgICAgICAgICAgPHJkZjpCYWcvPgogICAgICAgICA8L0lwdGM0eG1wRXh0OlJlZ2lzdHJ5SWQ+CiAgICAgICAgIDxJcHRjNHhtcEV4dDpBcnR3b3JrT3JPYmplY3Q+CiAgICAgICAgICAgIDxyZGY6QmFnLz4KICAgICAgICAgPC9JcHRjNHhtcEV4dDpBcnR3b3JrT3JPYmplY3Q+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50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"
                            width="45%"
                            alt="alternativer_text" />
                    </center>

                    <form className={this.classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="fname"
                                    name="firstName"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="Vorname"
                                    autoFocus
                                    value={this.state.firstName}
                                    error={isFNameErr}
                                    onChange={this.onFNameChanged}
                                    helperText={isFNameErr ? 'Empty field!' : ''}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Nachname"
                                    name="lastName"
                                    autoComplete="lname"
                                    onChange={this.onSNameChanged}
                                    error={isSNameErr}
                                    helperText={isSNameErr ? 'Empty field!' : ''}
                                    value={this.state.secondName}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    className={this.classes.tf1}
                                    InputProps={{
                                        disableUnderline: true, startAdornment: (
                                            <InputAdornment position='start'>
                                                <AccountCircle />
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Addresse"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={this.state.email}
                                    onChange={this.onEmailChanged}
                                    error={errIsEmailAnEmail}
                                    helperText={errIsEmailAnEmail ? 'Not a e-mail address!' : ''}

                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    InputProps={{
                                        disableUnderline: true, startAdornment: (
                                            <InputAdornment position='start'>
                                                <VpnKey />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={this.handleClickShowPassword}
                                                    onMouseDown={this.handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {/*<Delete />*/}
                                                    {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}

                                    className={this.classes.tf1}
                                    variant="outlined"

                                    required
                                    fullWidth
                                    name="password"
                                    label="Passwort"
                                    type={this.state.showPassword ? "password" : undefined}
                                    id="password"
                                    autoComplete="current-password"
                                    defaultValue={this.state.password}
                                    onChange={this.onPasswordChanged}
                                    error={isPWErr}
                                    helperText={isPWErr ? 'No password!' : ''}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                                    label="Ich akzeptiere die AGBs und Datenschutzerklärungen"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={this.classes.submit}
                            onClick={() =>
                            {
                                this.safeData()
                                //window.location.href = "/SignIn"
                                // if (this.state.routing === true)
                                // {this.SignInRouting()}
                            }}
                        >
                            Registrieren
                        </Button>
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link onClick={this.SignInRouting} variant="body2">
                                    Bereits regestriert? Hier anmelden
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={5}>
                    <Copyright />
                </Box>
            </Container>
        );
    }
}

export default SignUpPage;
