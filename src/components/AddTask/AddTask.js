import React, { Component } from 'react'

import './AddTask.css'

export default class NewTaskForm extends Component {
  state = {
    title: '',
    minutes: '',
    seconds: '',
    timer: null,
  }

  onLabelChange = (e) => {
    if (e.target.value[0] === ' ') {
      e.target.value = ''
      e.target.placeholder = 'Type any symbol — not a space'
    } else e.target.placeholder = 'What needs to be done?'
    this.setState({
      title: e.target.value,
    })
  }

  onSecondsChange = (e) => {
    const regex = /[^0-9]/g
    this.setState({ seconds: e.target.value.replace(regex, '') })
  }
  onMinutesChange = (e) => {
    const regex = /[^0-9]/g
    this.setState({ minutes: e.target.value.replace(regex, '') })
  }
  onSubmit = (e) => {
    e.preventDefault()
    if (parseInt(this.state.minutes, 10) > 59) {
      this.setState({ minutes: '' })
      this.inputMin.focus()
      return
    }
    if (parseInt(this.state.seconds, 10) > 59) {
      this.setState({ seconds: '' })
      this.inputSec.focus()
      return
    }
    this.props.addTask(this.state.title, this.state.minutes, this.state.seconds)
    this.setState({
      title: '',
      minutes: '',
      seconds: '',
    })
  }

  render() {
    return (
      <form className="new-todo-form" onSubmit={this.onSubmit}>
        <input
          type="text"
          className="new-todo"
          placeholder="What needs to be done?"
          value={this.state.title}
          autoFocus
          required
          onChange={this.onLabelChange}
        ></input>
        <input
          type="text"
          className="new-todo-form__timer"
          value={this.state.minutes}
          onChange={this.onMinutesChange}
          placeholder="Min"
          ref={(input) => {
            this.inputMin = input
          }}
        />
        <input
          type="number"
          className="new-todo-form__timer"
          value={this.state.seconds}
          onChange={this.onSecondsChange}
          placeholder="Sec"
          required
          ref={(input) => {
            this.inputSec = input
          }}
        />
        <button type="submit"></button>
      </form>
    )
  }
}
