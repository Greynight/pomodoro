import React from 'react';

class Tomato extends React.Component {
  constructor(props) {
    super();

    this.onTomatoClick = props.onTomatoClick;
  }

  render() {
    const height = this.props.height;
    const mode = this.props.mode || 'start';
    const modeText = mode.toUpperCase();
    const time = this.props.time || '00.00';

    return (
      <div id="tomato" onClick={this.onTomatoClick}>
        <div id="tomato-fill" style={{height: height + '%'}}></div>
        <div id="tomato-text" className="text-white">{modeText}</div>
        <div id="tomato-time" className="text-white">{time}</div>
      </div>
    );
  }
}

export default Tomato;
