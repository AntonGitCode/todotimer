import React from 'react'
import PropTypes from 'prop-types'

import Task from '../Task'
import './TaskList.css'

function TaskList({ todos, onDeleted, onToggleDone, statusFilter, saveTimer, updateIsRunning }) {
  let filteredArray = [...todos]

  if (statusFilter === 'active') filteredArray = todos.filter((el) => !el.completed)
  if (statusFilter === 'completed') filteredArray = todos.filter((el) => el.completed)

  const elements = filteredArray.map((todo) => {
    const { id } = todo
    return (
      <Task
        todo={todo}
        onDeleted={onDeleted}
        key={id}
        onToggleDone={onToggleDone}
        saveTimer={saveTimer}
        updateIsRunning={updateIsRunning}
        id={id}
      />
    )
  })

  return <ul className="todo-list">{elements}</ul>
}

TaskList.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDeleted: PropTypes.func.isRequired,
  onToggleDone: PropTypes.func.isRequired,
  statusFilter: PropTypes.string,
  saveTimer: PropTypes.func.isRequired,
  updateIsRunning: PropTypes.func.isRequired,
}

TaskList.defaultProps = {
  todos: [],
  statusFilter: 'all',
  onDeleted: () => {},
  onToggleDone: () => {},
  saveTimer: () => {},
  updateIsRunning: () => {},
}

export default TaskList
