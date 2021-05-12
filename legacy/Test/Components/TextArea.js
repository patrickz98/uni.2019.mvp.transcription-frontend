import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiTextField-root': {
            marginRight: theme.spacing(1),
            width: '97%',
            backgroundColor: 'white',
        },
        border: '12px solid',
        borderColor: '#75926D',
    },
}));

export default function MultilineTextFields() {
    const classes = useStyles();
    const [value, setValue] = React.useState('Controlled');

    const handleChange = event => {
        setValue(event.target.value);
    };

    return (
        <form className={classes.root} noValidate autoComplete="off">
            <div>
                <Grid container spacing={1} className={classes.root}>
                    <Grid item xs={12}/>
                        <Grid item xs={11}>
                            <Button variant="outlined" style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>b</Button>
                            <Button variant="outlined" style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>I</Button>
                            <Button variant="outlined" style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>U</Button>
                        </Grid>
                        <Grid item xs={1} >
                            <Button variant="outlined" style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>ABC</Button>
                        </Grid>
                    <Grid item xs={12}>
                        <hr/>
                        <TextField
                            id="standard-multiline-static"
                            multiline
                            rows="25"
                            defaultValue="ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet"
                        />
                    </Grid>
                </Grid>
            </div>
        </form>
    );
}