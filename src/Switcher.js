import React from 'react';

class Switcher extends React.Component {
  constructor(props) {
    super();

    this.value = props.value;
    this.name = props.name;
    this.onValueChange = props.onChange;
  }

  decrease = () => {
    const value = this.value > 1 ? --this.value : 1;
    this.onValueChange(value, this.name);
  };

  // max value is 60 min
  increase = () => {
    const value = this.value < 61 ? ++this.value : 60;
    this.onValueChange(value, this.name);
  };

  render() {
    this.value = this.props.value;

    return (
      <div>
        <span className="switch" onClick={this.decrease}> ➖ </span>
        <span className="value">{this.value}</span>
        <span className="switch" onClick={this.increase}> ➕ </span>
      </div>
    );
  }
}

export default Switcher;
