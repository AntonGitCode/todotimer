import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { v4 as uuidv4 } from 'uuid'

import Footer from '../Footer'
import NewTaskForm from '../NewTaskForm'
import TaskList from '../TaskList'

import './TodoApp.css'

const TodoApp = () => {
  const [todoData, setTodoData] = useState([])

  useEffect(() => {
    const prevData = JSON.parse(localStorage.getItem('todoData'))
    if (prevData) {
      const result = prevData.map((el) => {
        return { ...el, time: new Date(el.time) }
      })
      setTodoData(result)
    }
  }, [])

  useEffect(() => {
    addToLocalStorage(todoData)
  }, [todoData])

  function createTodoItem(label, timer) {
    return {
      label,
      timerValue: timer,
      timerOn: false,
      time: new Date(),
      done: false,
      class: 'active',
      hidden: false,
      id: uuidv4(),
      checked: false,
    }
  }

  const addToLocalStorage = (data) => {
    localStorage.setItem('todoData', JSON.stringify(data))
  }

  const editState = (id, key, value) => {
    const newArray = todoData.map((el) => (el.id === id ? { ...el, [key]: value } : el))
    setTodoData(newArray)
  }

  const deleteItem = (id) => {
    setTodoData((prevData) => {
      const idx = prevData.findIndex((el) => el.id === id)
      const result = [...prevData.slice(0, idx), ...prevData.slice(idx + 1)]
      return result
    })
  }

  const addItem = (text, timer) => {
    const newItem = createTodoItem(text, timer)
    let result = [...todoData, newItem]
    setTodoData(result)
  }

  const toogleDone = (id) => {
    const idx = todoData.findIndex((el) => el.id === id)

    const oldItem = todoData[idx]
    const classItem = classNames({ completed: oldItem.class === 'active', active: oldItem.class === 'completed' })

    const newItem = { ...oldItem, done: !oldItem.done, class: classItem }
    const newArray = [...todoData.slice(0, idx), newItem, ...todoData.slice(idx + 1)]
    setTodoData(newArray)
  }

  const clearDone = (items) => {
    const ids = items.map((el) => el.id)
    ids.forEach((element) => {
      deleteItem(element)
    })
  }

  const editLabel = (id, newLabel) => {
    editState(id, 'label', newLabel)
  }

  const filterTodo = (label) => {
    const actions = {
      all: 'All',
      active: 'Active',
      completed: 'Completed',
    }
    if (label === actions.all) {
      const newArray = todoData.map((el) => (el.hidden ? { ...el, hidden: false } : el))
      setTodoData(newArray)
    }
    if (label === actions.active) {
      const newArray = todoData.map((el) => {
        if (el.class === 'active') {
          return { ...el, hidden: false }
        }

        return { ...el, hidden: true }
      })
      setTodoData(newArray)
    }
    if (label === actions.completed) {
      const newArray = todoData.map((el) => {
        if (el.class === 'active') {
          return { ...el, hidden: true }
        }

        return { ...el, hidden: false }
      })
      setTodoData(newArray)
    }
  }

  const formatTime = (min, sec) => {
    const formatMin = min.length > 1 ? min : `0${min.length ? min : 0}`
    const formatSec = sec.length > 1 ? sec : `0${sec.length ? sec : 0}`
    return `${formatMin}:${formatSec}`
  }

  const countDown = (time) => {
    const [strMin, strSec] = time.split(':')
    const min = Number(strMin)
    const sec = Number(strSec)

    if ((min || !min) && sec) {
      return formatTime(`${min}`, `${sec - 1}`)
    }
    if (min && !sec) {
      return formatTime(`${min - 1}`, '59')
    }
    if (!min && !sec) {
      return false
    }
  }

  const timer = (id) => {
    const timer = setInterval(() => {
      setTodoData((prevData) => {
        const idx = prevData.findIndex((el) => el.id === id)
        const item = { ...prevData[idx] }
        if (!item.timerOn) {
          clearInterval(timer)
          return prevData
        }
        if (item.timerValue !== '00:00') {
          item.timerValue = countDown(String(item.timerValue))
          const newArr = [...prevData.slice(0, idx), item, ...prevData.slice(idx + 1)]
          return newArr
        }
      })
    }, 1000)
  }

  const toggleTimer = (id, value) => {
    editState(id, 'timerOn', value)
  }

  const timerPlay = (id) => {
    const idx = todoData.findIndex((el) => el.id === id)
    if (!todoData[idx].timerOn) {
      toggleTimer(id, true)
      timer(id)
    }
  }

  const timerStop = (id) => {
    toggleTimer(id, false)
  }
  console.log(todoData)
  const doneItems = todoData.filter((el) => el.done)
  const countItems = todoData.length - doneItems.length
  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <NewTaskForm addItem={addItem} formatTime={formatTime} />
      </header>
      <section className="main">
        <TaskList
          todoData={todoData}
          toogleDone={toogleDone}
          deleteItem={deleteItem}
          editLabel={editLabel}
          timerPlay={timerPlay}
          timerStop={timerStop}
        />
        <Footer countItems={countItems} clearDone={() => clearDone(doneItems)} filterTodo={filterTodo} />
      </section>
    </section>
  )
}

export default TodoApp
