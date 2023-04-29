import React from 'react'
import PropTypes from 'prop-types'
import './TasksFilter.css'

function TasksFilter({ makeFiltered, statusFilter }) {
  return (
    <ul className="filters">
      <li>
        <button onClick={() => makeFiltered('all')} className={statusFilter === 'all' ? 'selected' : ''}>
          All
        </button>
      </li>
      <li>
        <button onClick={() => makeFiltered('active')} className={statusFilter === 'active' ? 'selected' : ''}>
          Active
        </button>
      </li>
      <li>
        <button onClick={() => makeFiltered('completed')} className={statusFilter === 'completed' ? 'selected' : ''}>
          Completed
        </button>
      </li>
    </ul>
  )
}

TasksFilter.propTypes = {
  makeFiltered: PropTypes.func.isRequired,
  statusFilter: PropTypes.string.isRequired,
}

TasksFilter.defaultProps = {
  makeFiltered: () => {},
  statusFilter: 'all',
}

export default TasksFilter
