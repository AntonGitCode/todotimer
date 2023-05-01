import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import Task from '../Task/Task'
import './TaskList.css'

function TaskList({ todos, deleteTodo, toggleDone, editTitle, timerPlay, timerStop }) {
  const elements = todos.map(({ id, ...item }) => {
    return (
      <Task
        key={id}
        id={id}
        {...item}
        toggleDone={() => toggleDone(id)}
        deleteTodo={() => deleteTodo(id)}
        editTitle={editTitle}
        timerPlay={() => timerPlay(id)}
        timerStop={() => timerStop(id)}
      />
    )
  })

  const emptyClassName = classNames('todo-list__empty', { hidden: todos.length })

  return (
    <ul className="todo-list">
      {elements}
      <li className={emptyClassName}>Type above to add new todo</li>
    </ul>
  )
}

TaskList.defaultProps = {
  deleteTodo: () => {},
  toggleDone: () => {},
  editLabel: () => {},
}

TaskList.propTypes = {
  todos: PropTypes.array,
  deleteTodo: PropTypes.func,
  toggleDone: PropTypes.func,
  editLabel: PropTypes.func,
}

export default TaskList
