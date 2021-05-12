import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';

const BootstrapInput = withStyles(theme => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(0),
        },
    },
    input: {
        borderRadius: 0,
        position: 'relative',
        backgroundColor: 'white',
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '0px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            backgroundColor: 'white',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);

const useStyles = makeStyles(theme => ({
    margin: {
        margin: theme.spacing(0),
    },
}));

export default function CustomizedSelects() {
    const classes = useStyles();
    const [age, setAge] = React.useState('');
    const handleChange = event => {
        setAge(event.target.value);
    };
    return (
        <div>
            <FormControl className={classes.margin}>
                <Select labelId="demo-customized-select-label id="demo-customized-select value={age} onChange={handleChange} input={<BootstrapInput />} >
                    <MenuItem value={1}>1. Sek</MenuItem>
                    <MenuItem value={2}>2. Sek</MenuItem>
                    <MenuItem value={3}>3. Sek</MenuItem>
                </Select>
            </FormControl>
        </div>
);
}
