import React, { useState } from 'react'
import PropTypes from 'prop-types'

import TaskFilter from '../TasksFilter'

import './Footer.css'

const Footer = ({ filterTodo, countTodos, clearCompleted }) => {
  const [filters, setFilters] = useState([
    { label: 'All', id: 1, selected: true },
    { label: 'Active', id: 2, selected: false },
    { label: 'Completed', id: 3, selected: false },
  ])

  const toggleSelected = (id) => {
    const newArray = filters.map((el) => (el.selected ? { ...el, selected: false } : el))
    const idx = newArray.findIndex((el) => el.id === id)
    const result = newArray.map((el, i) => (idx === i ? { ...el, selected: true } : el))
    setFilters(result)
  }

  const changeFilter = (id, label) => {
    toggleSelected(id)
    filterTodo(label)
  }

  const elements = filters.map(({ id, label, selected }) => {
    return <TaskFilter key={id} label={label} selected={selected} changeFilter={() => changeFilter(id, label)} />
  })

  return (
    <footer className="footer">
      <span className="todo-count">{countTodos} items left</span>
      <ul className="filters">{elements}</ul>
      <button className="clear-completed" onClick={clearCompleted}>
        Clear completed
      </button>
    </footer>
  )
}

Footer.defaultProps = {
  countTodos: 0,
  clearCompleted: () => {},
}

Footer.propTypes = {
  countTodos: PropTypes.number,
  clearCompleted: PropTypes.func,
}

export default Footer
