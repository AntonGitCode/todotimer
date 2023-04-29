import React, { useState } from 'react'
import classNames from 'classnames'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import PropTypes from 'prop-types'

import './Task.css'

const Task = ({
  time,
  label,
  id,
  editLabel,
  done,
  hidden,
  toogleDone,
  deleteTodo,
  timerValue,
  timerPlay,
  timerStop,
}) => {
  const [value, setValue] = useState('')
  const [editing, setEditing] = useState(false)

  const timeToNow = () => {
    return formatDistanceToNow(time)
  }

  const onEditForm = () => {
    setValue(label)
    setEditing((editing) => !editing)
  }

  const labelChange = (e) => {
    setValue(e.target.value)
  }

  const onEditTask = (e) => {
    e.preventDefault()
    if (value.length) {
      editLabel(id, value)
      setEditing((editing) => !editing)
    }
  }

  const liClassNames = classNames({ completed: done, active: !done }, { hidden: hidden }, { editing: editing })
  const formClassNames = classNames({ hidden: !editing })
  const timerClassNames = classNames('description', { hidden: timerValue === '00:00' || !timerValue })

  return (
    <li className={liClassNames}>
      <div className="view">
        <input className="toggle" type="checkbox" onClick={toogleDone} defaultChecked={done} />
        <label>
          <span className="title">{label}</span>
          <span className={timerClassNames}>
            <button className="icon icon-play" onClick={timerPlay}></button>
            <button className="icon icon-pause" onClick={timerStop}></button>
            <span className="timer">{timerValue}</span>
          </span>
          <span className="created">{' ' + timeToNow() + ' ago'}</span>
        </label>
        <button className="icon icon-edit" onClick={onEditForm}></button>
        <button className="icon icon-destroy" onClick={deleteTodo}></button>
      </div>
      <form className={formClassNames} onSubmit={onEditTask}>
        <input type="text" className="edit" value={value} onChange={labelChange}></input>
      </form>
    </li>
  )
}

Task.defaultProps = {
  done: false,
  hidden: false,
}

Task.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  done: PropTypes.bool,
  hidden: PropTypes.bool,
}

export default Task
