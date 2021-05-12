import React from 'react';
import Editor from '../src/Editor';
import WaveView from '../src/WaveView';
import Button from '@material-ui/core/Button';


import Container from '@material-ui/core/Container';
import Grid from "@material-ui/core/Grid";
import {ThemeProvider, createMuiTheme} from "@material-ui/core/styles";
import TopBar from "../src/Test/Components/TopBar";
import RightArea from "../src/Test/Components/RightArea";
import MenuBar from "../src/Test/Components/MenuBar";


const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#FFF7F0',
        },
        secondary: {
            main: '#75926D',
        },
    },
});


class App extends React.Component {
    server = "http://localhost:8080";

    status = {
        SUCCESS: 0,
        FAILED: 1,
        ONGOING: 2,
        UNKNOWN: 3,
    };

    constructor(props) {
        super(props);

        this.state = {
            lang: "de",
            time: 0.0,
            editorText: "",
            transcript: undefined,
            audoBinary: new ArrayBuffer(),
            uuid: undefined,
        };

        // function handleResize()
        // {
        //     console.log('resized to: ', window.innerWidth, 'x', window.innerHeight)
        // }

        // window.addEventListener('resize', handleResize)
    }

    componentDidMount() {
        console.log("componentDidMount");
    }

    audio = new Audio("")

    seekTo = (data) => {
        console.log("seekTo");

        var start = data["startTime"];
        var end = data["endTime"];
        var timeSec = end - start;

        console.log(start);
        console.log(end);
        console.log(timeSec);

        this.setState({
            time: start
        });

        this.audio.currentTime = start;
        // this.audio.play();

        // setTimeout(() =>
        // {
        //     this.audio.pause();
        // }, timeSec * 1000);
    }

    updateTimer = () => {
        this.setState(
            {
                time: this.audio.currentTime
            }, () => {
                if (this.state.play) {
                    setTimeout(() => {
                        this.updateTimer();
                    }, 100);
                }
            });
    }

    /* Updates play field and plays and pauses the audiofile audio (When play/pause button is triggered in UI) */
    togglePlay = () => {
        this.setState(
            {
                play: !this.state.play
            },
            () => {
                this.state.play ? this.audio.play() : this.audio.pause();
                this.updateTimer();
            }
        );
    }


    /* Sets results field to result(information from IBM) (perhaps edited) */
    fetchResults(uuid) {
        fetch(this.server + '/results/' + uuid, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                console.log("fetchResults data", data.length)

                var text = "";

                for (var inx = 0; inx < data.length; inx++) {
                    text += data[inx]["word"] + " ";
                }

                this.setState({
                    editorText: text,
                    transcript: data,
                });
            })
            .catch(error => {
                console.error(error)
            });
    }

    fetchAudioData(uuid) {
        console.log("fetchAudioData");

        this.audio = new Audio()

        fetch(this.server + '/wav/' + uuid).then((response) => {
            response.arrayBuffer().then((buffer) => {
                console.log("fetchAudioData buffer", buffer.byteLength);

                var blob = new Blob([buffer], {type: 'audio/wav'});
                var blobUrl = URL.createObjectURL(blob);

                this.audio.src = blobUrl
                this.audio.type = "audio/wav"
                this.audio.load();

                console.log("fetchAudioData", "buffer.byteLength", buffer.byteLength);

                this.setState({
                    audoBinary: buffer,
                    uuid: uuid,
                });
            });
        });
    }

    /* Checks if Transcription is already done (updates status field) and creates Audio-Object from original audiofile,
     calls fetchResults(uuid) to get transcription results .
     Waits for 0.5 sec when transcription not done and checks again.  */
    fetchStatus(uuid) {
        fetch(this.server + '/status/' + uuid, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                console.log("fetchStatus", data)

                this.setState(
                    {
                        status: data
                    }, () => {
                        // Debug/Change this!
                        if (data.status === this.status.ONGOING) {
                            setTimeout(() => {
                                this.fetchStatus(uuid);
                            }, 0.5 * 1000);

                            return;
                        }

                        if (data.status === this.status.SUCCESS) {
                            this.fetchAudioData(uuid);
                            this.fetchResults(uuid);
                        }
                    });
            })
            .catch(error => {
                console.error("fetchStatus", error)
            });
    }

    // POST-request: passes the audiofile to backend, to store it (backend starts API-Calls to IBM).
    // Calls fetchStatus(uuid) afterwards to get the transcribed data.
    handleUpload(event) {
        const files = event.target.files
        const formData = new FormData()
        formData.append('file', files[0])

        fetch('http://localhost:8080/upload/' + this.state.lang, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)

                this.setState({
                    uplaodResonse: data
                }, () => {
                    this.fetchStatus(data.uuid);
                });
            })
            .catch(error => {
                console.error(error)
            });
    }

    // Changes language field when a language change is triggered in UI
    changeLang(event) {
        console.log("lang", event.target.value);
        this.setState({lang: event.target.value});
    }

    fakeUpload() {
        console.log("fakeUpload")

        var data = {
            "success": true,
            "uuid": "123456789",
            // "uuid": "cad16bab-b42e-4a56-ab02-3240f4040e09",
        };

        this.setState({
            uplaodResonse: data
        }, () => {
            this.fetchStatus(data.uuid);
        });
    }

    onEditorChange = (text, transcript) => {
        console.log("onEditorChange text", text);
        // console.log("onEditorChange transcript", transcript);

        this.setState({
            editorText: text,
            transcript: transcript,
        });

        // Save change!
        fetch('http://localhost:8080/results/' + this.state.uuid, {
            method: 'POST',
            body: JSON.stringify(transcript)
        })
            .then(response => response.json())
            .then(data => {
                console.log("onEditorChange", data)
            })
            .catch(error => {
                console.error("onEditorChange", error)
            });
    }

    render() {
        console.log("render");

        // return(<App2/>);

        return (
            <ThemeProvider theme={theme}>

                {/* Language Selecter */}
                <select onChange={this.changeLang.bind(this)} value={this.state.lang}>
                    <option value="de">de</option>
                    <option value="en">en</option>
                </select>
                {/* Choose input to upload */}
                <input type="file" onChange={this.handleUpload.bind(this)}/>
                <Button onClick={this.fakeUpload.bind(this)}>FakeUpload</Button>
                {/* play/pause-button for audio */}
                <Button onClick={this.togglePlay}>{this.state.play ? 'Pause' : 'Play'}</Button>


                <Container maxWidth="lg">

                    <Grid container spacing={10}>


                        <Grid item xs={12}>
                            <TopBar/>
                        </Grid>

                        <Grid item xs={12}>
                            <MenuBar/>
                        </Grid>

                        <Grid item xs={12}>

                            <div>
                                <WaveView
                                    audoBinary={this.state.audoBinary}
                                    chunks={100}
                                    uuid={this.state.uuid}
                                />
                            </div>

                        </Grid>

                        <Grid item xs={9}>
                            <div style={{
                                position: "relative",
                                //left: "50%",
                                //top: "15%",
                                //right: "0%",
                                //bottom: "0%",
                                overflow: "hidden",
                                backgroundColor: "white"
                            }}>
                                <Editor
                                    value={this.state.editorText}
                                    time={this.state.time}
                                    transcript={this.state.transcript}
                                    seekTo={this.seekTo}
                                    onChange={this.onEditorChange}
                                />
                            </div>


                        </Grid>

                        <Grid item xs={3}>
                            <RightArea/>
                        </Grid>

                    </Grid>
                </Container>
            </ThemeProvider>
        );
    }
}

export default App;