import React from 'react'
import PropTypes from 'prop-types'

import './TaskFilter.css'

const TaskFilter = ({ label, selected, changeFilter }) => {
  return (
    <li>
      <button className={selected ? 'selected' : ''} onClick={changeFilter}>
        {label}
      </button>
    </li>
  )
}

TaskFilter.defaultProps = {
  selected: false,
}

TaskFilter.propTypes = {
  label: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  changeFilter: PropTypes.func.isRequired,
}

export default TaskFilter
