import React from "react";

import Defines from "./Defines";

import
{
    AppBar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Paper,
    Select,
    InputLabel,
    MenuItem,
    FormControl,
    Button,
    Typography,
    IconButton,
    Box,
    LinearProgress,
    Container,
    CircularProgress,
} from "@material-ui/core"

import
{
    Edit,
    Done,
    Error,
} from "@material-ui/icons"

class DashboardPage extends React.Component
{
    LOGTAG = "Dashboard";

    status = {
        SUCCESS: 0,
        FAILED: 1,
        ONGOING: 2,
        UNKNOWN: 3,
    };

    constructor(props)
    {
        super(props);

        var urlParams = new URLSearchParams(window.location.search);
        var uuid = urlParams.get("user");

        console.debug(this.LOGTAG, "constructor", "user", uuid);

        this.state = {
            projects: undefined,
            language: "en",
            user: uuid
        };
    }

    componentDidMount()
    {
        console.debug(this.LOGTAG, "componentDidMount");
        this.update();
    }

    update = () =>
    {
        fetch(Defines.server() + "/projects/" + this.state.user)
            .then(response => response.json())
            .then(data =>
            {
                console.debug(this.LOGTAG, "data", data)

                if (!data["success"])
                {
                    alert("Error: " + data["error"]);
                    return;
                }

                this.setState({
                    projects: new Map(Object.entries(data["projects"])),
                }, () =>
                {
                    setTimeout(() =>
                    {
                        this.update();
                    }, 1500);
                });
            })
            .catch(error =>
            {
                console.error(this.LOGTAG, "error", error)
                // alert();
            });
    }

    // POST-request: passes the audiofile to backend, to store it (backend starts API-Calls to IBM).
    // Calls fetchStatus(uuid) afterwards to get the transcribed data.
    handleUpload = (event) =>
    {
        const files = event.target.files
        const formData = new FormData()
        formData.append("file", files[0])

        fetch(Defines.server() + "/upload/" + this.state.user + "?lang=" + this.state.language, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data =>
            {
                console.debug(this.LOGTAG, "handleUpload", data)
            })
            .catch(error =>
            {
                console.error(error)
            });
    }


    // Changes language field when a language change is triggered in UI
    changeLang = (event) =>
    {
        this.setState({ language: event.target.value });
    }

    goTo = (uuid) =>
    {
        window.location.href = window.location.origin + window.location.pathname + "?page=edit&user=" + this.state.user + "&uuid=" + uuid
    }

    logout = () =>
    {
        window.location.href = window.location.origin + window.location.pathname + "?page=SignIn"
    }

    buildProjectTable = () =>
    {
        if (this.state.projects === undefined)
        {
            return (
                <center>
                    <CircularProgress />
                    <Typography style={{color: "grey"}}>Loading projects</Typography>
                </center>
            );
        }

        var tableRows = [];

        this.state.projects.forEach((status, uuid) =>
        {
            // console.debug(this.LOGTAG, "uuid", uuid, "status", status);

            var statusElem = "unknown";

            if (status["status"] === 0)
            {
                // statusElem = "Success";
                statusElem = (<Done />);
            }

            if (status["status"] === 1)
            {
                // statusElem = "Failed";
                statusElem = (<Error />);
            }

            if (status["status"] === 2)
            {
                // statusElem = (<CircularProgress />);
                statusElem = (<LinearProgress />);
            }

            tableRows.push(
                <TableRow key={uuid}>
                    <TableCell>{statusElem}</TableCell>
                    <TableCell component="th" scope="row">
                        {uuid}
                    </TableCell>
                    <TableCell>{status["details"]}</TableCell>
                    <TableCell>{status["cost"]}</TableCell>
                    <TableCell>
                        <IconButton
                            disabled={status["status"] !== 0}
                            onClick={this.goTo.bind(this, uuid)}>
                            <Edit />
                        </IconButton>
                    </TableCell>
                </TableRow>
            );
        });

        var table = (
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Status</TableCell>
                            <TableCell>Uuid</TableCell>
                            <TableCell>Transcription</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableRows}
                    </TableBody>
                </Table>
            </TableContainer>
        );

        return table;
    }

    render()
    {
        console.debug(this.LOGTAG, "render");

        var topBar = (<div style={{
            width: "100%",
            color: "#ff00ff",
        }}>
            <Box display="flex">
                {/* flexGrow={1} */}
                <Box p={2}>
                    <FormControl>
                        <InputLabel>Language</InputLabel>
                        <Select
                            value={this.state.language}
                            onChange={this.changeLang}>
                            <MenuItem value={"de"}>German</MenuItem>
                            <MenuItem value={"en"}>English</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box p={2}>
                    <Button
                        variant="contained"
                        component="label">
                        Upload File
                        <input
                            onChange={this.handleUpload}
                            type="file"
                            style={{ display: "none" }}
                        />
                    </Button>
                </Box>
            </Box>
        </div>);

        return (<div style={{
            // backgroundColor: "#ffffff",
            backgroundColor: "#fafafa",
            position: "absolute",
            left: "0px",
            top: "0px",
            right: "0px",
            bottom: "0px",
            padding: "0px"
        }}>

            <AppBar position="static" color="default" elevation={0}>
                <Toolbar>
                    <Container >
                        <Box display="flex">
                            <Box p={2} flexGrow={3}>
                                <Typography variant="h5" >
                                    Transcriptions:
                                </Typography>
                            </Box>
                            <Box p={2}>

                                <Button
                                    onClick={this.logout}
                                    color="primary"
                                    variant="outlined">
                                    Logout
                                </Button>

                            </Box>
                        </Box>


                    </Container>
                </Toolbar>
            </AppBar>
            <br />
            <Container maxWidth="lg">
                <div style={{ width: "100%", textAlign: "left" }}>
                    {this.buildProjectTable()}
                    <Typography variant="h5" style={{
                        paddingTop: "20px",
                        paddingBottom: "20px",
                    }}>
                        Upload File
                    </Typography>
                    {topBar}
                </div>
            </Container>
        </div>);
    }
}

export default DashboardPage;