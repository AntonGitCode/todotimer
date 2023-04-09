import React, { Component } from 'react'
import { formatDistanceToNow } from 'date-fns'
import PropTypes from 'prop-types'
import './Task.css'
import classNames from 'classnames'

export default class Task extends Component {
  state = {
    isRunning: false,
    timer: null,
    sec: 0,
    min: 0,
  }

  startTimer = (timerId = null, isRunning = true) => {
    if (timerId && isRunning) return
    clearInterval(timerId)
    this.props.updateIsRunning(this.props.id, true)
    let timer = setInterval(() => {
      this.setState(({ sec, min }) => {
        if (Number(sec) == 0 && Number(min) > 0) return { sec: 59, min: Number(min) - 1 }
        if (Number(sec) <= 0 && Number(min) <= 0) return { sec: 0, min: 0 }
        return { sec: Number(sec) - 1 }
      })
    }, 1000)

    this.setState({ timer: timer, isRunning: true })
  }

  pauseTimer = (timer, isRunning) => {
    if (!isRunning) return
    clearInterval(timer)
    this.setState({ isRunning: false })
  }

  componentWillUnmount() {
    const { saveTimer, id } = this.props
    if (this.state.timer) {
      saveTimer(this.state.min, this.state.sec, this.state.timer, this.state.isRunning, id)
      clearInterval(this.state.timer)
    }
  }

  componentDidMount() {
    const { todo } = this.props
    const { minutes, seconds, timer, isRunning } = todo
    this.setState({ sec: seconds, min: minutes, timer: timer, isRunning: isRunning })
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.todo.minutes == this.props.todo.minutes &&
      prevProps.todo.seconds == this.props.todo.seconds &&
      prevState.timer !== this.state.timer &&
      prevState.timer === null &&
      prevState.isRunning == false &&
      this.state.isRunning == true
    ) {
      clearInterval(this.state.timer)
      this.startTimer()
    }
    if (
      prevState.timer &&
      this.state.timer &&
      !prevProps.todo.isRunning &&
      !this.props.todo.isRunning &&
      prevState.timer == this.state.timer &&
      prevState.isRunning &&
      this.state.isRunning &&
      prevState.sec == this.state.sec &&
      prevState.min == this.state.min
    ) {
      this.setState({ isRunning: false })
    }
  }

  render() {
    const { todo, onDeleted, onToggleDone } = this.props
    const { sec, min, timer, isRunning } = this.state
    const { completed, id } = todo

    return (
      <li className={classNames({ completed })}>
        <div className="view">
          <input className="toggle" type="checkbox" checked={completed} onChange={() => onToggleDone(timer, id)} />
          <label>
            <span className="title">{todo.title}</span>
            {!completed && (
              <span className="description">
                <button className="icon icon-play" onClick={() => this.startTimer(timer, isRunning)} />
                <button className="icon icon-pause" onClick={() => this.pauseTimer(timer, isRunning)} />
              </span>
            )}
            <span className="description">
              {min < 10 ? '0' : ''}
              {min}:{sec < 10 ? '0' : ''}
              {sec}
            </span>
            <span className="description">{formatDistanceToNow(todo.createDate)}</span>
          </label>
          <button className="icon icon-destroy" onClick={() => onDeleted(timer, id)} />
        </div>
      </li>
    )
  }
}

Task.propTypes = {
  todo: PropTypes.object.isRequired,
  onDeleted: PropTypes.func.isRequired,
  onToggleDone: PropTypes.func.isRequired,
  updateIsRunning: PropTypes.func.isRequired,
  saveTimer: PropTypes.func.isRequired,
  id: PropTypes.number,
}

Task.defaultProps = {
  todo: {},
  onDeleted: () => {},
  onToggleDone: () => {},
  updateIsRunning: () => {},
  saveTimer: () => {},
}
