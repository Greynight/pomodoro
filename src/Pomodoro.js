import React from 'react';

import Switcher from './Switcher';
import Tomato from './Tomato';

class Pomodoro extends React.Component {
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

    this.clearSession();

    let message = `${mode} has been started`;

    if (this.state.notifications) {
      new Notification(message);
    }

    this.startTimer(mode);
  };

  clearSession = () => {
    this.setState({tomatoFillHeight: 0});
    this.setState({secondsGone: null});
  };

  onTimerClick = () => {
    // start timer
    if (!this.state.sessionId) {
      let mode = this.state.mode || this.SESSION;
      this.startTimer(mode);

      this.startTimeTracking();
      // pause timer
    } else {
      this.pauseTimer();

      // track working time
      this.saveTimeTracking();
    }
  };

  onValueChange = (value, name) => {
    if (!this.state.sessionId) {
      this.setState({[name]: value});

      if (this.state.mode) {
        this.clearSession();
      }
    }
  };

  startTimeTracking = () => {
    const today = this.getTodayTimeStamp();
    const timestamp = Date.now();

    localStorage[today] = {...localStorage[today], start: timestamp};
  };

  // save total working time to localStorage for now
  // TODO use smth like mlab.com to store data
  saveTimeTracking = () => {
    const timestamp = Date.now();
    const today = this.getTodayTimeStamp();
    const start = localStorage[today].start;

    // save duration in minutes
    localStorage[today].duration = localStorage[today].duration + (timestamp - start) / 1000 / 60;
  };

  getTodayTimeStamp = () => {
    const msToDate = 1000 * 60 * 60 * 24;
    const timestamp = Date.now();

    return timestamp - timestamp % msToDate;
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

export default Pomodoro;
