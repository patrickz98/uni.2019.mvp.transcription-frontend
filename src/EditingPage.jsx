import React from 'react';

import Editor from './Editor';
import WaveView from './WaveView';
import Defines from './Defines';

import hotkeys from 'hotkeys-js';

import
{
    AppBar,
    Box,
    Button,
    Card,
    Checkbox,
    CircularProgress,
    Container,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Menu,
    MenuItem,
    Slider,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
} from '@material-ui/core/';

import
{
    Delete,
    Face,
    FastForward,
    FastRewind,
    GetApp,
    Home,
    Info,
    Pause,
    PlayArrow,
} from '@material-ui/icons/';

class EditingPage extends React.Component
{
    LOGTAG = "EditingPage";
    audio = new Audio();

    speakerColors = [
        "#3f51b5",
        "#f50057",
        "#ff0000",
        "#ff00ff",
        "#ffff00",
        "#00ff00",
        "#0f0f00",
    ];

    constructor(props)
    {
        super(props);

        this.state = {
            time: 0.0,
            duration: 0.0,
            transcript: undefined,
            obfuscate: new Map(),
            audoBinary: new ArrayBuffer(),
            user: undefined,
            uuid: undefined,
            playbackRate: 1.0,
            play: false,
            audioSkipOffset: 3.0,
            newObfuscate: "",
            hotkeys: ['ctrl+p', 'ctrl+f', 'ctrl+r'],
            speakerSelectModus: false,
            confidentModus: false,
            speakers: [0, 1, 2],
            selectedWords: [],
            anchorEl: null,
            specialKeyMap: new Map([
                [48, "0"],
                [49, "1"],
                [50, "2"],
                [51, "3"],
                [52, "4"],
                [53, "5"],
                [54, "6"],
                [55, "7"],
                [56, "8"],
                [57, "9"],
                [16, "shift"],
                [17, "ctrl"],
                [18, "alt"],
                [37, "left"],
                [38, "up"],
                [39, "right"],
                [40, "down"]
            ])
        };
    }

    componentWillUnmount()
    {
        //unbinding the Hotkeys
        hotkeys.unbind(this.state.hotkeys[0]);
        hotkeys.unbind(this.state.hotkeys[1]);
        hotkeys.unbind(this.state.hotkeys[2]);
    }

    componentDidMount()
    {
        console.debug(this.LOGTAG, "componentDidMount");

        var urlParams = new URLSearchParams(window.location.search);
        var user = urlParams.get("user");
        var uuid = urlParams.get("uuid");

        console.debug(this.LOGTAG, "componentDidMount", "user", user, "uuid", uuid);

        this.setState({
            user: user,
            uuid: uuid
        }, () =>
        {
            this.fetchResults(user, uuid);
            this.fetchAudioData(user, uuid);
        });

        //binding the Hotkeys
        hotkeys(this.state.hotkeys[0], this.togglePlay);
        hotkeys(this.state.hotkeys[1], this.forwardAudio);
        hotkeys(this.state.hotkeys[2], this.rewindAudio);

        //changeHotkeys, muss noch an Record-Button von Controlls gekoppelt werden statt shortcut!
        // hotkeys('alt+a', () => {
        //     setTimeout(() => {
        //         console.debug(hotkeys.getPressedKeyCodes());
        //         var keys = hotkeys.getPressedKeyCodes();
        //         this.changeHotkey(keys);
        //     },500);
        // })
    }

    changeHotkey = () =>
    {
        setTimeout(() =>
        {
            var keys = hotkeys.getPressedKeyCodes();
            console.debug(this.LOGTAG, "changeHotkey:" + keys);
            var str = "";
            keys.forEach((item, ind) =>
            {
                if (str === undefined) return;

                if (this.state.specialKeyMap.has(item))
                {
                    if (ind === 0) str = str + this.state.specialKeyMap.get(item);
                    else str = str + "+" + this.state.specialKeyMap.get(item);
                }
                else if (item >= 65 && item <= 90)
                {
                    if (ind === 0) str = str + String.fromCharCode(item);
                    else str = str + "+" + String.fromCharCode(item);
                }

                str = undefined;
            });

            if (str === undefined) return;

            var hotkeysnew = this.state.hotkeys;
            hotkeysnew[0] = str;
            console.debug(this.LOGTAG, "Str  state.hotkey change:", str.length);
            if (!(str.length === 0))
            {
                hotkeys.unbind(this.state.hotkeys[0]);

                this.setState({
                    hotkeys: hotkeysnew
                });
                setTimeout(() =>
                {
                    hotkeys(this.state.hotkeys[0], this.togglePlay);
                }, 2000);
            }
            console.debug(this.LOGTAG, "LOG  state.hotkey change:", this.state.hotkeys[0].length);
        }, 1000);
    }

    // TODO: unzulässige hotkeys abfangen, aber eigentlich nahezu alle Tastenfolgen möglich

    //Wenn hotkeys über record erfasst werden diese funktionen entfernen
    updatePlayHotkey = (event) =>
    {
        hotkeys.unbind(this.state.hotkeys[0]);
        hotkeys(event.target.value, this.togglePlay);

        // this.state.hotkeys[0] = event.target.value;
        this.state.hotkeys.splice(0, 1, event.target.value);

        console.debug(this.LOGTAG, "updatePlayHotkey", this.state.hotkeys);
    }

    updateForwardHotkey = (event) =>
    {
        hotkeys.unbind(this.state.hotkeys[1]);
        hotkeys(event.target.value, this.forwardAudio);

        // this.state.hotkeys[1] = event.target.value;
        this.state.hotkeys.splice(1, 1, event.target.value);

        console.debug(this.LOGTAG, "updateForwardHotkey", this.state.hotkeys);
    }

    updateRewindHotkey = (event) =>
    {
        hotkeys.unbind(this.state.hotkeys[2]);
        hotkeys(event.target.value, this.rewindAudio);

        // this.state.hotkeys[2] = event.target.value;
        this.state.hotkeys.splice(2, 1, event.target.value);

        console.debug(this.LOGTAG, "updateRewindHotkey", this.state.hotkeys);
    }

    /**
     * Seek in wav to point of time.
     */
    seekToTime = (time) =>
    {
        console.debug(this.LOGTAG, "seekToTime", time);

        this.setState(
            {
                time: time
            }, () =>
        {
            this.audio.currentTime = time
        }
        );
    }

    /**
     * Seek to time of word in transkript.
     */
    seekToWord = (index) =>
    {
        console.debug(this.LOGTAG, "seekToWord", index);

        var start = this.state.transcript[index]["startTime"];

        this.seekToTime(start);
    }

    /**
     * Update state.time
     */
    updateTimer = () =>
    {
        this.setState({
            time: this.audio.currentTime
        }, () =>
        {
            // Update time if audio is playing
            if (this.state.play)
            {
                setTimeout(() =>
                {
                    this.updateTimer();
                }, 100);
            }
        });
    }

    /**
     * Updates play field and plays and pauses the audiofile audio (When play/pause button is triggered in UI)
     */
    togglePlay = () =>
    {
        this.setState(
            {
                play: !this.state.play
            },
            () =>
            {
                this.state.play ? this.audio.play() : this.audio.pause();
                this.updateTimer();
            }
        );
    }

    forwardAudio = () =>
    {
        if (this.state.play)
        {
            this.audio.currentTime = Math.min(this.audio.currentTime + this.state.audioSkipOffset, this.audio.duration);
        }
    }

    rewindAudio = () =>
    {
        if (this.state.play)
        {
            this.audio.currentTime = Math.max(this.audio.currentTime - this.state.audioSkipOffset, 0);
        }
    }

    changeAudioSkipOffset = (event, value) =>
    {
        this.setState({
            audioSkipOffset: value
        });

        console.debug(this.LOGTAG, "changeAudioSkipOffset", this.state.audioSkipOffset)
    }

    /**
     * Sets results field to result(information from IBM) (perhaps edited)
     */
    fetchResults = (user, uuid) =>
    {
        console.debug(this.LOGTAG, "fetchResults", "user", user, "uuid", uuid);

        fetch(Defines.server() + "/results/" + user + "/" + uuid)
            .then(response => response.json())
            .then(data =>
            {
                console.debug(this.LOGTAG, "fetchResults", "data.length", data.length)

                if (!data["success"])
                {
                    alert("Error: " + data["error"]);
                    return;
                }

                var transcript = data["transcript"];

                var obfuscate = new Map();

                if (data["obfuscate"])
                {
                    obfuscate = new Map(Object.entries(data["obfuscate"]));
                }

                this.setState({
                    transcript: transcript,
                    obfuscate: obfuscate,
                });
            })
            .catch(error =>
            {
                console.error(this.LOGTAG, error)
            });
    }

    fetchAudioData = (user, uuid) =>
    {
        console.debug(this.LOGTAG, "fetchAudioData", "user", user, "uuid", uuid);

        this.audio = new Audio()
        this.audio.onended = () =>
        {
            this.setState({
                play: false,
            });
        };

        fetch(Defines.server() + "/wav/" + user + "/" + uuid).then((response) =>
        {
            response.arrayBuffer().then((buffer) =>
            {
                console.debug(this.LOGTAG, "fetchAudioData buffer", buffer.byteLength);

                var blob = new Blob([buffer], { type: 'audio/wav' });
                var blobUrl = URL.createObjectURL(blob);

                this.audio.src = blobUrl;
                this.audio.type = "audio/wav";
                this.audio.oncanplay = () =>
                {
                    console.debug(this.LOGTAG, "fetchAudioData", "audio.oncanplay");
                    console.debug(this.LOGTAG, "fetchAudioData", "this.audio.duration", this.audio.duration);

                    this.setState({
                        duration: this.audio.duration,
                        audoBinary: buffer,
                    });
                };

                this.audio.load();
            });
        });
    }

    strMapToObj = (strMap) =>
    {
        let obj = Object.create(null);
        for (let [k, v] of strMap)
        {
            // We don’t escape the key '__proto__'
            // which can cause problems on older engines
            obj[k] = v;
        }
        return obj;
    }

    commitChangesToServer = () =>
    {
        console.debug(this.LOGTAG, "commitChangesToServer");

        var postJson = {};
        postJson["transcript"] = this.state.transcript;
        postJson["obfuscate"] = this.strMapToObj(this.state.obfuscate);

        console.debug(this.LOGTAG, "commitChangesToServer", "postJson", postJson);

        // Save change!
        fetch(Defines.server() + "/results/" + this.state.user + "/" + this.state.uuid, {
            method: 'POST',
            body: JSON.stringify(postJson)
        })
            .then(response => response.json())
            .then(data =>
            {
                console.debug(this.LOGTAG, "onEditorChange", data)
            })
            .catch(error =>
            {
                console.error(this.LOGTAG, "onEditorChange", error)
            });

    }

    onEditorChange = (transcript) =>
    {
        console.debug(this.LOGTAG, "onEditorChange", transcript);

        this.setState({
            transcript: transcript,
        }, this.commitChangesToServer);
    }

    onPlaybackRateChanged = (event, value) =>
    {
        this.audio.playbackRate = value;

        this.setState({
            playbackRate: value
        });
    }

    onDownload = (format) =>
    {
        console.debug(this.LOGTAG, "onDownload", format);

        window.location.href = Defines.server() + "/download/"
            + this.state.user + "/"
            + this.state.uuid + "?format=" + format;

        this.setState({ anchorEl: null });
    }

    obfuscateWord = (word, val) =>
    {
        console.debug(this.LOGTAG, "obfuscateWord", "word", word, "val", val);

        this.setState({
            obfuscate: this.state.obfuscate.set(word, val)
        }, this.commitChangesToServer);
    }

    deleteobfuscateWord = (word) =>
    {
        console.debug(this.LOGTAG, "deleteobfuscateWord", "word", word);
        this.state.obfuscate.delete(word);

        this.setState({
            obfuscate: this.state.obfuscate
        }, this.commitChangesToServer);
    }

    addOfuscateWord = (word) =>
    {
        console.debug(this.LOGTAG, "addOfuscateWord", "word", word);

        this.setState({
            obfuscate: this.state.obfuscate.set(word, true)
        }, this.commitChangesToServer);
    }

    keyPressed = (event) =>
    {
        var newText = this.state.newObfuscate.trim()

        if (newText === "")
            return;


        if (event.key === "Enter")
        {
            this.addOfuscateWord(newText);
            this.setState({
                newObfuscate: ""
            });
        }
    }

    onObfuscateChange = (event) =>
    {
        this.setState({
            newObfuscate: event.target.value
        });
    }

    buildObfuscationList = () =>
    {
        console.debug(this.LOGTAG, "buildObfuscationList", this.state.obfuscate)

        var listItems = [];

        this.state.obfuscate.forEach((show, word) =>
        {
            var listItem = (
                <ListItem key={word} button onClick={this.obfuscateWord.bind(this, word, !show)}>
                    <ListItemIcon>
                        <Checkbox
                            edge="start"
                            checked={show}
                        // tabIndex={-1}
                        // disableRipple
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={word}
                    />
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="comments" onClick={this.deleteobfuscateWord.bind(this, word)}>
                            <Delete />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            );

            listItems.push(listItem);
        });

        return (
            <List
                key={"obfuscationList"}
                component="nav"
                aria-label="main mailbox folders">
                {listItems}
                <ListItem>
                    <TextField
                        fullWidth
                        label="Add Obfuscation"
                        variant="outlined"
                        value={this.state.newObfuscate}
                        onChange={this.onObfuscateChange}
                        onKeyPress={this.keyPressed} />
                </ListItem>
            </List>
        );
    }

    buildTopBar = () =>
    {
        var topBar = (
            <Box display="flex" justifyContent="center">
                <IconButton onClick={this.rewindAudio}>
                    <FastRewind fontSize='large' />
                </IconButton>
                <IconButton onClick={this.togglePlay}>{
                    this.state.play
                        ? <Pause fontSize='large' />
                        : <PlayArrow fontSize='large' />
                }</IconButton>
                <IconButton onClick={this.forwardAudio}>
                    <FastForward fontSize='large' />
                </IconButton>
            </Box>
        );

        return topBar;
    }

    buildWaveView = () =>
    {
        var waveView = (
            <div style={{
                position: "relative",
                width: "100%",
                height: "100px",
                overflow: "hidden",
                marginTop: "20px",
                marginBottom: "20px",
                // backgroundColor: "#0000ff"
            }}>
                <WaveView
                    audoBinary={this.state.audoBinary}
                    chunks={400}
                    time={this.state.time}
                    seekTo={this.seekToTime}
                    duration={this.state.duration}
                    user={this.state.user}
                    uuid={this.state.uuid}
                />
            </div>
        );

        return waveView;
    }

    buildDebugInfo = () =>
    {
        var transcriptInfo = (
            <div style={{
                position: "relative",
                width: "100%",
                // height: "100px",
                overflow: "scroll",
                marginTop: "20px",
                marginBottom: "20px",
                // backgroundColor: "#ffff88"
            }}>
                <p>Transcript:</p>
                <div>{JSON.stringify(this.state.transcript)}</div>
            </div>
        );

        return transcriptInfo;
    }

    buildLoadingView = () =>
    {
        return (
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}>
                <Grid item xs={3}>
                    <CircularProgress />
                </Grid>
            </Grid>
        );
    }

    onSelectWords = (indicies) =>
    {
        console.debug(this.LOGTAG, "onSelectWords", indicies);
        this.setState({ selectedWords: indicies });
    }

    buildEditorCard = () =>
    {
        var editor = (
            <Card style={{
                // border: "2px dotted #444444",
                padding: "10px"
            }}>
                <Typography variant="h6" style={{
                    paddingTop: "10px",
                    paddingBottom: "10px",
                }}>
                    Edit Transcript:
                </Typography>

                <div style={{
                    position: "relative",
                    width: "100%",
                    height: "500px",
                    overflow: "scroll",
                    // backgroundColor: "#ff88ff",
                }}>
                    <Editor
                        time={this.state.time}
                        transcript={this.state.transcript}
                        seekToWord={this.seekToWord}
                        onChange={this.onEditorChange}
                        obfuscate={this.state.obfuscate}
                        speakerSelectModus={this.state.speakerSelectModus}
                        confidentModus={this.state.confidentModus}
                        speakerColors={this.speakerColors}
                        selectWords={this.onSelectWords}
                    />
                </div>
            </Card>
        );

        return editor;
    }

    buildHotkeyInfo = () =>
    {
        return (
            <Box
                key={"hotkeyInfo"}
                display="flex">
                <Box p={0} flexGrow={1}>
                    {this.buildHeadline("Hotkeys")}
                </Box>

                <Box p={0}>
                    <Tooltip
                        fontSize="medium"
                        title={"Zulässige Keys: ctrl, alt, shift, left, right, up, down, Alphabet (A-Z), Zahlen 0 bis 10"}
                        style={{
                            width: "80px"
                        }}>
                        <Info fontSize="small"/>
                    </Tooltip>
                </Box>
            </Box>
        );
    }

    buildHotkeyControllBox = () =>
    {
        var buildTextField = function (defaultValue, onChange)
        {
            return (
                <TextField
                    defaultValue={defaultValue}
                    variant="outlined"
                    size="small"
                    onChange={onChange}
                    style={{
                        width: "80px"
                    }} />
            );
        };

        var textField0 = buildTextField(this.state.hotkeys[0], this.updatePlayHotkey);
        var textField1 = buildTextField(this.state.hotkeys[1], this.updateForwardHotkey);
        var textField2 = buildTextField(this.state.hotkeys[2], this.updateRewindHotkey);

        return (
            <Box key={"hotkeyControllBox"}>
                {this.buildControllBox("Play/Pause Audio:", textField0)}
                {this.buildControllBox("Forward Audio:", textField1)}
                {this.buildControllBox("Rewind Audio:", textField2)}
            </Box>
        );
    }

    buildHeadline = (text) =>
    {
        return (
            <Typography
                key={"headline"+text}
                variant="h6"
                style={{
                    paddingTop: "10px",
                    paddingBottom: "10px",
                }}
            >
                {text}
            </Typography>
        );
    }

    buildSpeedSlider = () =>
    {
        return (
            <React.Fragment key={"speedSlider"}>
                <Typography gutterBottom>Speed</Typography>
                <Slider
                    defaultValue={1.0}
                    value={this.state.playbackRate}
                    onChange={this.onPlaybackRateChanged}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={0.1}
                    marks
                    min={0.5}
                    max={1.5}
                />
            </React.Fragment>
        );
    }

    buildForwardRewindStuff = () =>
    {
        return (
            <React.Fragment key={"forwardRewindStuff"}>
                <Typography gutterBottom>Forward/Rewind Offset</Typography>
                <Slider
                    defaultValue={3.0}
                    value={this.state.audioSkipOffset}
                    onChange={this.changeAudioSkipOffset}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={0.5}
                    marks
                    min={1}
                    max={10}
                />
            </React.Fragment>
        );
    }

    changeSpeaker = (speaker) =>
    {
        if (this.state.selectedWords.length <= 0)
        {
            return;
        }

        var transcript = this.state.transcript;

        for (var inx = 0; inx < this.state.selectedWords.length; inx++)
        {
            var index = this.state.selectedWords[inx];
            transcript[index]["speaker"] = speaker;
        }

        this.setState({ transcript: transcript }, this.commitChangesToServer);
    }

    buildSpeakerSelectControll = () =>
    {
        var listItems = [];

        for (var inx = 0; inx < this.state.speakers.length; inx++)
        {
            var item = (
                <ListItem
                    key={inx}
                    button
                    onClick={this.changeSpeaker.bind(this, inx + 1)}>
                    <ListItemIcon>
                        <Face
                            style={{ color: this.speakerColors[inx] }}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={"Speaker " + inx}
                    />
                    <ListItemSecondaryAction>
                        <IconButton
                            onClick={() => { }}>
                            <Delete />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            );

            listItems.push(item);
        };

        // TODO: Build explain text!
        return (
            <List>
                {listItems}
            </List>
        );
    }

    buildControllBox = (text, widget) =>
    {
        return (
            <Box display="flex">
                <Box p={0} flexGrow={1}>
                    <Typography gutterBottom>{text}</Typography>
                </Box>
                <Box p={0}>
                    {widget}
                </Box>
            </Box>
        );
    }

    buildSpeakermodusBox = () =>
    {
        var button = (
            <Button
                onClick={() =>
                {
                    this.setState({ speakerSelectModus: !this.state.speakerSelectModus });
                }}>
                {this.state.speakerSelectModus
                    ? "Disable"
                    : "Enable"}
            </Button>
        );

        return this.buildControllBox("Speaker Select Mode", button);
    }

    buildConfidentModusBox = () =>
    {
        var button = (
            <Button
                onClick={() =>
                {
                    this.setState({ confidentModus: !this.state.confidentModus });
                }}>
                {this.state.confidentModus
                    ? "Disable"
                    : "Enable"}
            </Button>
        );

        return this.buildControllBox("Confident Mode", button);
    }

    buildControllCard = () =>
    {
        var controlls = [];

        if (this.state.speakerSelectModus)
        {
            //
            // Speaker controll stuff
            //

            controlls = this.buildSpeakerSelectControll();
        }
        else
        {
            //
            // Normal Stuff
            //

            controlls = [
                this.buildSpeedSlider(),
                this.buildForwardRewindStuff(),

                this.buildHeadline("Blackout"),
                this.buildObfuscationList(),

                this.buildHotkeyInfo(),
                this.buildHotkeyControllBox(),
            ];
        }

        return (
            <Card style={{
                padding: "10px",
            }}>
                {this.buildHeadline("Controlls")}
                {this.buildSpeakermodusBox()}
                {this.buildConfidentModusBox()}
                {/* <Divider style={{ marginBottom: "20px" }} /> */}
                {/* TODO: Overflow scroll */}
                {controlls}
            </Card>
        );
    }

    onDownloadMenu = (event) =>
    {
        console.debug("########", event.currentTarget);
        this.setState({ anchorEl: event.currentTarget });
    }

    closeMenu = (event) =>
    {
        this.setState({ anchorEl: null });
    }

    buildAppBar()
    {
        return (
            <AppBar position="static" color="default" elevation={0}>
                <Toolbar>
                    <Container maxWidth="lg">
                        <Box display="flex">
                            <Box p={2} flexGrow={3}>
                                <Typography variant="h6" >
                                    {this.state.uuid}
                                </Typography>
                            </Box>
                            <Box p={0}>
                                <IconButton onClick={this.onDownloadMenu}>
                                    <GetApp fontSize='large' />
                                </IconButton>
                                <Menu
                                    open={Boolean(this.state.anchorEl)}
                                    anchorEl={this.state.anchorEl}
                                    onClose={this.closeMenu}
                                    keepMounted>
                                    <MenuItem onClick={() => this.onDownload("json")}>json</MenuItem>
                                    <MenuItem onClick={() => this.onDownload("txt")}>txt</MenuItem>
                                </Menu>
                            </Box>
                            <Box p={0}>
                                <IconButton onClick={() =>
                                {
                                    window.location.href = window.location.origin
                                        + window.location.pathname + "?page=dashboard&user=" + this.state.user;
                                }}>
                                    <Home fontSize='large' />
                                </IconButton>
                            </Box>
                        </Box>
                    </Container>
                </Toolbar>
            </AppBar>
        );
    }

    buildEditorControls()
    {
        return (
            <Box display="flex">
                <Box p={2} flexGrow={3}>
                    {this.buildEditorCard()}
                </Box>
                <Box p={2} flexGrow={1}>
                    {this.buildControllCard()}
                </Box>
            </Box>
        );
    }

    toTime = (sec_num) =>
    {
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = Math.floor(sec_num - (hours * 3600) - (minutes * 60));

        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }

        return hours + ':' + minutes + ':' + seconds;
    }

    buildClock = () =>
    {
        return (
            <Box display="flex" justifyContent="center">
                <Typography variant="h4" style={{
                    paddingTop: "10px",
                    paddingBottom: "0px",
                    fontWeight: "bold",
                    whiteSpace: "pre-wrap",
                }}>
                    {this.toTime(this.state.time)}
                </Typography>
                <Typography variant="h4" style={{
                    paddingTop: "10px",
                    paddingBottom: "0px",
                    // color: "#aaaaaa",
                    whiteSpace: "pre-wrap",
                }}>
                    {" / " + this.toTime(this.state.duration)}
                </Typography>
            </Box>
        );
    }

    render()
    {
        console.debug(this.LOGTAG, "render");
        console.debug(this.LOGTAG, "window.location", window.location);

        if (this.state.uuid === undefined || this.state.uuid === "")
        {
            return this.buildLoadingView();
        }

        return (
            <div style={{
                // backgroundColor: "#ffffff",
                backgroundColor: "#fafafa",
                position: "absolute",
                left: "0px",
                top: "0px",
                right: "0px",
                bottom: "0px",
                padding: "0px",
                overflow: "scroll"
            }}>

                {this.buildAppBar()}

                <Container maxWidth="lg">
                    {this.buildClock()}
                    {this.buildTopBar()}
                    {this.buildWaveView()}
                    {this.buildEditorControls()}
                    {/* {this.buildDebugInfo()} */}
                </Container>
            </div>
        );
    }
}

export default EditingPage;
