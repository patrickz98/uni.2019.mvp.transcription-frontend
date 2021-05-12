import React, { Component } from 'react'
import Container from '@material-ui/core/Container';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import TopBar from "./Components/TopBar";
import TextArea from "./Components/TextArea";
import RightArea from "./Components/RightArea";
import MenuBar from "./Components/MenuBar";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#fbffff',
        },
        secondary: {
            main: '#75926D',
        },
    },
});


class App extends Component {
    render() {
        return (
            <ThemeProvider theme={theme}>


                <Container maxWidth="lg">

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TopBar/>
                            <br/>
                        </Grid>

                        <Grid item xs={12}>
                            <MenuBar/>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography component="div" style={{ backgroundColor: '#75926D', height: '12vh', width: '100%' }}/>
                        </Grid>

                        <Grid item xs={9} >
                            <TextArea/>
                        </Grid>

                        <Grid item xs={3}>
                            <RightArea/>
                        </Grid>

                    </Grid>
                </Container>
            </ThemeProvider>
        )
    }
}
export default App