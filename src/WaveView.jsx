import React from 'react';
import Defines from './Defines';

class WaveView extends React.Component
{
    LOGTAG = "WaveView";

    constructor(props)
    {
        super(props);

        console.debug(this.LOGTAG, "constructor");

        this.state = {
            waveForm: [],
        };
    }

    loadWaveForm = () =>
    {
        fetch(Defines.server() + "/plot/" + this.props.user + "/" + this.props.uuid + "?chunks=" + this.props.chunks, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data =>
            {
                console.debug(this.LOGTAG, "loadWaveForm", "data", data);

                this.setState({
                    waveForm: data
                });
            })
            .catch(error =>
            {
                console.error(error)
            });
    }

    render()
    {
        console.debug(this.LOGTAG, "render");
        console.debug(this.LOGTAG, "render", "duration", this.props.duration);

        if ((this.state.waveForm.length <= 0) && (this.props.uuid !== undefined))
        {
            this.loadWaveForm();
        }

        // this.parseAndSetBinaryData();

        //
        // Build view
        //

        var timePerChunk = this.props.duration / this.state.waveForm.length;

        var ample = [];

        var percent = 100 / this.props.chunks;

        for (var inx = 0; inx < this.state.waveForm.length; inx++)
        {
            var ampl = this.state.waveForm[inx];

            if (ampl < 0)
            {
                ampl = ampl * -1;
            }

            var amplPercent = (((ampl * 6) / (0xffff / 2)) * 100) % 100;

            if (amplPercent < 2) amplPercent = 2;

            // console.debug("WaveView.render", "inx", inx);
            // console.debug("WaveView.render", "ampl", ampl);
            // console.debug("WaveView.render", "amplPercent", amplPercent);

            var time = timePerChunk * inx;

            var margin = 50 - amplPercent / 2;

            var styleContainer = {
                position: "absolute",
                display: "block",
                left: (percent * inx) + "%",
                top: "0%",
                bottom: "0%",
                width: (percent) + "%",
            }

            var style = {
                position: "absolute",
                display: "block",
                left: "0px",
                top: (margin) + "%",
                right: "0px",
                bottom: (margin) + "%",
                backgroundColor: (time < this.props.time) ? "#3f51b5" : "#dadada",
                borderRadius: "1000px"
            }

            var container = (
                <div
                    key={inx}
                    style={styleContainer}
                    onClick={this.props.seekTo.bind(this, time + timePerChunk)}>
                    <div style={style}></div>
                </div>
            );

            ample.push(container);
        }

        return (
            <React.Fragment>
                {ample}
            </React.Fragment>
        );
    }
}

export default WaveView;
