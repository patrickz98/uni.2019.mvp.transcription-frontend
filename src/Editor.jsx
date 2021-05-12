import React from 'react';
import { diffString } from './jsdiff';

import
{
    InputBase,
} from '@material-ui/core/';

/**
 * Editor for Transcript.
 * 
 * This class manages transcript changes.
 * It creates two layers:
 *     1. A Textinput layer for writing text, handle changes and clicks.
 *     2. A layer composed of spans for visual stuff.
 * 
 * Props:
 *     - time = point of time in played wav
 *     - transcript = transcript json
 *     - seekToWord = callback to seek to selected word
 *     - onChange = transcript changed callback
 *     - obfuscate = obfuscated words
 *     - speakerSelectModus = speaker select modus active?
 *     - confidentModus = confident modus active?
 *     - speakerColors = colors for speakers
 *     - selectWords = callback for selected word range 
 */
class Editor extends React.Component
{
    LOGTAG = "Editor";

    constructor(props)
    {
        super(props);
        console.debug(this.LOGTAG, "constructor");
    }

    /**
     * Handles click and select events in the textinput.
     * The clicked word will be identified. Afterwords the "seekToWord" callback will be called.
     * If a range is selected and speakerSelectModus is active "selectWords" callback will be called.
     */
    onClick = (event) =>
    {
        if (!this.props.transcript)
        {
            return;
        }

        var start = event.target.selectionStart;
        var end = event.target.selectionEnd;

        console.debug(this.LOGTAG, "onClick", "start", start, "end", end);

        // Array with clicked / seleceted word indices in transcript
        var selectedWordsIndices = [];

        var lastWordEnd = 0;

        for (var inx = 0; inx < this.props.transcript.length; inx++)
        {
            var wordinfo = this.props.transcript[inx];
            var word = wordinfo["word"];

            var startOk = (start < lastWordEnd + word.length + 1);
            var endOk = (lastWordEnd < end);

            if (startOk && endOk)
            {
                selectedWordsIndices.push(inx);
            }

            lastWordEnd += word.length + 1;
        }

        if (selectedWordsIndices.length <= 0)
        {
            return;
        }

        if (start === end)
        {
            this.props.seekToWord(selectedWordsIndices[0]);
            return;
        }

        if (this.props.speakerSelectModus)
        {
            this.props.selectWords(selectedWordsIndices);
        }
    }

    /**
     * Guess start time, end time and speaker for a new word in the transcript.
     */
    heuristicElemPrediction = (index) =>
    {
        var startTime = 0.0;
        var endTime = 0.0;
        var speaker = null;

        var transcript = this.props.transcript;

        var elem = undefined;

        if (index < transcript.length)
        {
            elem = transcript[index];
        }

        if (index >= transcript.length)
        {
            elem = transcript[transcript.length - 1];
        }

        if (elem)
        {
            startTime = elem["startTime"];
            endTime = elem["endTime"];
            speaker = elem["speaker"] ?? null;
        }

        return [startTime, endTime, speaker];
    }

    /**
     * This function compares the old transcript with the new text.
     * It deletes and inserts the new words in the transcript.
     * Afterwards it'll call "onChange".
     */
    handleChange = (event) =>
    {
        console.debug(this.LOGTAG, "handleChange", event);

        var newText = event.target.value;
        var oldText = this.transcriptToText();

        var transcript = this.props.transcript;

        if (!transcript)
        {
            return;
        }

        // Compare old transcript with changed one.
        var diff = diffString(oldText, newText);
        console.debug(this.LOGTAG, "handleChange", "diff", diff);

        var index = 0;

        for (var inx = 0; inx < diff.length; inx++)
        {
            var elem = diff[inx];

            if (elem.op == null)
            {
                index++;
                continue;
            }

            var word = elem["word"];

            console.debug(this.LOGTAG, "handleChange", "index", index);
            console.debug(this.LOGTAG, "handleChange", "operation", elem.op);
            console.debug(this.LOGTAG, "handleChange", "word", word);

            if (elem.op === "del")
            {
                var deletedElem = transcript.splice(index, 1);
                console.debug(this.LOGTAG, "handleChange", "delete", deletedElem);
            }

            if (elem.op === "ins")
            {
                var heuristicWordData = this.heuristicElemPrediction(index);

                var newWordInfo = {
                    word: word,
                    startTime: heuristicWordData[0],
                    endTime: heuristicWordData[1],
                    speaker: heuristicWordData[2]
                };

                console.debug(this.LOGTAG, "handleChange", "insert", newWordInfo);

                transcript.splice(index++, 0, newWordInfo);
            }
        }

        this.props.onChange(transcript);
    }

    /**
     * Convert hex to rgb string part.
     */
    hexToRgb = (hex) =>
    {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ?
            [
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16)
            ] : [0, 0, 0];
    }

    /**
     * Build styled overlay for textinput.
     * This overlay is generated from the transcript.
     */
    buildStyledSpans = () =>
    {
        var textStyled = [];

        var transcript = this.props.transcript;

        if (!transcript)
        {
            return textStyled;
        }

        var map = new Map(this.props.obfuscate);

        for (var inx = 0; inx < transcript.length; inx++)
        {
            var wordInfo = transcript[inx];

            var style = {
                // don't fuck with this!
                whiteSpace: "pre-wrap",
            };

            //
            // Word style based on time.
            //

            if (this.props.time < wordInfo["startTime"])
            {
                style.color = "#888888";
            }
            else
            {
                style.color = "#000000";
            }

            //
            // Speaker Select Modus styles
            //

            if (this.props.speakerSelectModus)
            {
                var speaker = wordInfo["speaker"];
                if (speaker)
                {
                    var speakerColor = this.props.speakerColors[speaker - 1];
                    var rgb = this.hexToRgb(speakerColor);

                    style.backgroundColor = "rgb(" + rgb.join(",") + ", 0.15)";
                }
            }

            //
            // Word confidents styles
            //

            if (this.props.confidentModus
                && !this.props.speakerSelectModus
                && wordInfo["word_confidence"])
            {
                var confidentColor = "rgba("
                    + 0x3f + ", "
                    + 0x51 + ", "
                    + 0xb5 + ", "
                    + (1 - wordInfo["word_confidence"]) + ")";

                style.backgroundColor = confidentColor;
            }

            //
            // Blackout styles
            // Todo: Blackout does currently only work for single words.
            //

            var blackout = false;

            if (map.has(wordInfo["word"]))
            {
                blackout = map.get(wordInfo["word"]);
            }

            if (blackout)
            {
                style.backgroundColor = "#000000";
                style.color = "#000000";
                style.borderRadius = "5px";
            }

            //
            // Build and append span
            //

            var wordSpan = (
                <span
                    key={wordInfo["word"] + Math.random()}
                    style={style}>
                    {wordInfo["word"] + " "}
                </span>
            );

            textStyled.push(wordSpan);
        }

        return textStyled;
    }

    /**
     * Transcript to string helper function.
     */
    transcriptToText = () =>
    {
        var text = [];

        var transcript = this.props.transcript;

        if (transcript)
        {
            for (var inx = 0; inx < transcript.length; inx++)
            {
                var wordInfo = transcript[inx];
                text.push(wordInfo["word"]);
            }
        }

        return text.join(" ");
    }

    /**
     * React render function.
     */
    render()
    {
        console.debug(this.LOGTAG, "render");

        return (
            <div
                style={{
                    // pointerEvents: "none",
                    position: "absolute",
                    left: "0px",
                    top: "0px",
                    right: "0px",
                    bottom: "0px",
                    padding: "0px",
                    margin: "0px",
                }}>
                <InputBase
                    multiline
                    value={this.transcriptToText()}
                    onChange={this.handleChange}
                    onClick={this.onClick}
                    style={{
                        width: "100%",
                        padding: "0px",
                        margin: "0px",    
                    }} />

                <div
                    className="MuiInputBase-root MuiInputBase-multiline"
                    style={{
                        pointerEvents: "none",
                        position: "absolute",
                        left: "0px",
                        top: "0px",
                        right: "0px",
                        // bottom: "0px",
                        padding: "0px",
                        margin: "0px",    
                    }}
                >
                    <div
                        className="MuiInputBase-input MuiInputBase-inputMultiline"
                        style={{
                            padding: "0px",
                            margin: "0px",    
                        }}
                    >
                        {this.buildStyledSpans()}
                    </div>
                </div>
            </div>
        );
    }
}

export default Editor;
