import React from 'react';

class App extends React.Component {
  constructor(props) {
    super();

    this.SESSION = 'session';
    this.BREAK = 'break';
    this.MODE_CHANGE = {
      [this.SESSION]: this.BREAK,
      [this.BREAK]: this.SESSION
    };

    this.state = {
      notifications: this.isNotificationsAvailable(),
      sessionLength: 25,
      breakLength: 5,
      sessionId: 0,
      tomatoFillHeight: 0,
      secondsGone: null,
      // mode can be 'session' or 'break'
      mode: null,
      time: null
    };
  }

  isNotificationsAvailable = () => {
    let isNotificationsAvailable = false;

    if ("Notification" in window) {
      if (Notification.permission === 'denied') {
        isNotificationsAvailable = false;
      } else if (Notification.permission === 'granted') {
        isNotificationsAvailable = true;
      } else {
        this.requestNotificationPermission();
      }
    }

    return isNotificationsAvailable;
  };

  requestNotificationPermission = () => {
    Notification.requestPermission((permission) => {
      if (permission === "granted") {
        this.setState({notifications: true});
      }
    });
  };

  startTimer = (mode) => {
    const secondsDefault = this.state[`${mode}Length`] * 60;
    const seconds = this.state.secondsGone === null ? secondsDefault : this.state.secondsGone;
    const percents = 100 / secondsDefault;

    this.setState({mode});
    this.setState({secondsGone: seconds});

    const sessionId = setInterval(() => {
      let height = this.state.tomatoFillHeight + percents;
      let seconds = --this.state.secondsGone;

      // change mode
      if (seconds === 0) {
        return this.changeMode();
      }

      this.recalculateTime(seconds);

      this.setState({tomatoFillHeight: height});
      this.setState({secondsGone: seconds});
    }, 1000);

    this.setState({sessionId});
  };

  pauseTimer = () => {
    clearInterval(this.state.sessionId);
    this.setState({sessionId: 0});
  };

  recalculateTime = (secondsTotal) => {
    let minutes = Math.floor(secondsTotal / 60);
    let seconds = secondsTotal - minutes * 60;

    minutes = minutes.toString().length === 1 ? `0${minutes}` : minutes;
    seconds = seconds.toString().length === 1 ? `0${seconds}` : seconds;

    this.setState({time: `${minutes}:${seconds}`});
  };
  // TODO different color for different modes?
  changeMode = () => {
    this.pauseTimer();

    let mode = this.MODE_CHANGE[this.state.mode];
    this.setState({mode});
    this.setState({tomatoFillHeight: 0});
    this.setState({secondsGone: null});
    this.startTimer(mode);
  };

  onTimerClick = () => {
    // start timer
    if (!this.state.sessionId) {
      let mode = this.state.mode || this.SESSION;
      this.startTimer(mode);
      // pause timer
    } else {
      this.pauseTimer();
    }
  };

  onValueChange = (value, name) => {
    this.setState({[name]: value});
  };

  render() {
    const time = this.state.time || `${this.state.sessionLength}:00`;

    return (
      <div className="container-fluid">
        <div className="row" style={{ height: 100 }}>
          <div className="col-4"></div>
          <div className="col-1 text-bottom text-white">Session length</div>
          <div className="col-2"></div>
          <div className="col-1 text-bottom text-white">Break length</div>
          <div className="col-4"></div>
        </div>
        <div className="row">
          <div className="col-4"></div>
          <div className="col-1 text-center">
            <Switcher value={this.state.sessionLength} name="sessionLength" onChange={this.onValueChange} />
          </div>
          <div className="col-2 text-center">
            <Tomato
              onTomatoClick={this.onTimerClick}
              height={this.state.tomatoFillHeight}
              mode={this.state.mode}
              time={time}
            />
          </div>
          <div className="col-1 text-center">
            <Switcher value={this.state.breakLength} name="breakLength" onChange={this.onValueChange} />
          </div>
          <div className="col-4"></div>
        </div>
      </div>
    );
  }
}

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

class Switcher extends React.Component {
  constructor(props) {
    super();

    this.value = props.value;
    this.name = props.name;
    this.onValueChange = props.onChange;
  }

  decrease = () => {
    const value = this.value > 1 ? this.value-- : 1;
    this.onValueChange(value, this.name);
  };

  // max value is 60 min
  increase = () => {
    const value = this.value < 61 ? this.value++ : 60;
    this.onValueChange(value, this.name);
  };

  render() {
    const value = this.value;

    return (
      <div>
        <span className="switch" onClick={this.decrease}> ➖ </span>
        <span className="value">{value}</span>
        <span className="switch" onClick={this.increase}> ➕ </span>
      </div>
    );
  }
}

export default App;
