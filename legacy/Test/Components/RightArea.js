import Grid from "@material-ui/core/Grid";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Slider from "./SliderWgeschwindigkeit"
import FormControl from '@material-ui/core/FormControl';
import Select from "./SelecterWgeschwindigkeit"
import Typography from "@material-ui/core/Typography";
import {Stop} from "@material-ui/icons";
// import 'typeface-roboto';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
    root: {
        marginRight: theme.spacing(1),

        backgroundColor: '#75926D',
    },
}));

export default function SecondTopAppBar() {
    const classes = useStyles();
    return (
        <Grid container spacing={0} className={classes.root} style={{color: 'white',  padding: '5%'}}>
            <Grid item xs={12} style={{height: '8vh'}}>
                <Slider/>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="body2" style={{color: '#333333'}}>
                    Wiedergabesprung:
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <Select/>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6">Hotkeys:</Typography>
            </Grid>
            <Grid item xs={6} >
                <Typography variant="body2" style={{color: '#333333'}}>
                    shift+shift
                    <br/>
                    enter+enter
                    <br/>
                    shift + w
                    <br/>
                    shift + e
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="body2" style={{color: '#333333'}}>
                    Stop
                    <br/>
                    Sprecherwechsel
                    <br/>
                    Geschwindigkeit
                    <br/>
                    2x Geschwindigkeit
                    <br/>
                </Typography>
            </Grid>
            <Grid item xs={12}>
                 <Typography variant="h6">Sprecher:</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body2" style={{color: '#333333'}}>
                    Sprecher1
                    <br/>
                    Sprecher2
                    <br/>
                </Typography>
            </Grid>
            <Grid item xs={12}>
                 <Typography variant="h6">Zu schwärzende Wörter:</Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField id="standard-basic" size="small"/>
            </Grid>
            <Grid item xs={12}>
                <br/>
                <Button variant="contained">Schwärzen</Button>
            </Grid>
        </Grid>


    );
}