import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'

import './NewTaskForm.css'

const NewTaskForm = ({ formatTime, addItem }) => {
  const [title, setTitle] = useState('')
  const [min, setMin] = useState('')
  const [sec, setSec] = useState('')
  const inputRef = useRef(null)

  const titleChange = (e) => {
    setTitle(e.target.value)
  }

  const timeChange = (e) => {
    if (Number(e.target.value) || e.target.value == '') {
      return e.target.placeholder === 'Min' ? setMin(e.target.value) : setSec(e.target.value)
    }
  }

  const submitForm = (e) => {
    e.preventDefault()
    const titleTrim = title.trim()

    if (titleTrim !== '') {
      const time = min.length || sec.length ? formatTime(min, sec) : false
      addItem(titleTrim, time)
      setTitle('')
      setMin('')
      setSec('')
    }
    inputRef.current.focus()
  }

  return (
    <form className="new-todo-form" onSubmit={submitForm}>
      <label htmlFor="new-todo" className="new-todo-form__input-label">
        <input
          id="new-todo"
          name="new-todo"
          className="new-todo"
          value={title}
          placeholder="What needs to be done?"
          onChange={titleChange}
          ref={inputRef}
          autoFocus
        />
      </label>
      <label htmlFor="timer-min" className="new-todo-form__min-label">
        <input
          id="timer-min"
          name="timer-min"
          className="new-todo-form__timer"
          placeholder="Min"
          value={min}
          onChange={timeChange}
        />
      </label>
      <label htmlFor="timer-sec" className="new-todo-form__sec-label">
        <input
          id="timer-min"
          name="timer-min"
          className="new-todo-form__timer"
          placeholder="Sec"
          value={sec}
          onChange={timeChange}
        />
      </label>
      <button type="submit" />
    </form>
  )
}

NewTaskForm.propTypes = {
  addItem: PropTypes.func.isRequired,
}

export default NewTaskForm
