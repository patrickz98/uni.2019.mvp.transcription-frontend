import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    root: {
        width: 250,
    },
    margin: {
        height: theme.spacing(0),
    },
}));

function valuetext(value) {
    return `${value}°C`;
}

const marks = [
    {
        value: 0,
        label: '0°C',
    },
    {
        value: 20,
        label: '20°C',
    },
    {
        value: 37,
        label: '37°C',
    },
    {
        value: 100,
        label: '100°C',
    },
];

export default function DiscreteSlider() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography id="discrete-slider" gutterBottom variant="h6">
                Wiedergabegeschwindigkeit
            </Typography>
            <Slider
                defaultValue={30}
                getAriaValueText={valuetext}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                step={10}
                marks
                min={10}
                max={110}
            />
        </div>
    );
}