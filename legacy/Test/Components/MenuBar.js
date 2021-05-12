import Grid from "@material-ui/core/Grid";
import AndroidIcon from "@material-ui/icons/Android";
import MenuIcon from "@material-ui/icons/Menu";
import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";
import FastRewindIcon from "@material-ui/icons/FastRewind";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import FastForwardIcon from "@material-ui/icons/FastForward";
import PauseIcon from "@material-ui/icons/Pause";
import HomeIcon from "@material-ui/icons/Home";
import GetAppIcon from "@material-ui/icons/GetApp";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(1),
        height: '3vh',
    },
}));

export default function SecondTopAppBar() {
    const classes = useStyles();
    return (
        <Grid container spacing={0} className={classes.root}>
            <Grid item xs={3}>
                <IconButton><AndroidIcon fontSize='large'/> </IconButton>
                <IconButton><MenuIcon fontSize='large'/></IconButton>
                <IconButton><UndoIcon fontSize='large'/></IconButton>
                <IconButton><RedoIcon fontSize='large'/></IconButton>

            </Grid>
            <Grid item xs={2}>
            </Grid>
            <Grid item xs={4}>
                <IconButton><FastRewindIcon fontSize='large'/></IconButton>
                <IconButton><PlayArrowIcon fontSize='large'/></IconButton>
                <IconButton><PauseIcon fontSize='large'/></IconButton>
                <IconButton><FastForwardIcon fontSize='large'/></IconButton>
            </Grid>

            <Grid item xs={3} container alignItems="flex-start" justify="flex-end" direction="row">
                <IconButton><HomeIcon fontSize='large'/></IconButton>
                <IconButton><GetAppIcon fontSize='large'/></IconButton>
            </Grid>
        </Grid>

    );
}