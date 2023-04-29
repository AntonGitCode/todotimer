import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { v4 as uuidv4 } from 'uuid'

import Footer from '../Footer'
import NewTaskForm from '../NewTaskForm'
import TaskList from '../TaskList'

import './App.css'

const TodoApp = () => {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    const prevTodos = JSON.parse(localStorage.getItem('todos'))
    if (prevTodos) {
      const result = prevTodos.map((data) => {
        return { ...data, time: new Date(data.time) }
      })
      setTodos(result)
    }
  }, [])

  useEffect(() => {
    addToLocalStorage(todos)
  }, [todos])

  function createTodoItem(title, timerValue) {
    return {
      title,
      timerValue,
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
    localStorage.setItem('todos', JSON.stringify(data))
  }

  const editTodo = (id, key, value) => {
    const newArray = todos.map((todo) => (todo.id === id ? { ...todo, [key]: value } : todo))
    setTodos(newArray)
  }

  const deleteTodo = (id) => {
    setTodos((prevTodos) => {
      const indx = prevTodos.findIndex((el) => el.id === id)
      const result = [...prevTodos.slice(0, indx), ...prevTodos.slice(indx + 1)]
      return result
    })
  }

  const addItem = (title, timer) => {
    const newItem = createTodoItem(title, timer)
    let result = [...todos, newItem]
    setTodos(result)
  }

  const toogleDone = (id) => {
    const idx = todos.findIndex((el) => el.id === id)

    const oldItem = todos[idx]
    const classItem = classNames({ completed: oldItem.class === 'active', active: oldItem.class === 'completed' })

    const newItem = { ...oldItem, done: !oldItem.done, class: classItem }
    const newArray = [...todos.slice(0, idx), newItem, ...todos.slice(idx + 1)]
    setTodos(newArray)
  }

  const clearCompleted = (items) => {
    items.forEach((el) => deleteTodo(el.id))
  }

  const editTitle = (id, newTitle) => {
    editTodo(id, 'title', newTitle)
  }

  const filterTodo = (label) => {
    const actions = {
      all: 'All',
      active: 'Active',
      completed: 'Completed',
    }
    if (label === actions.all) {
      const newArray = todos.map((el) => (el.hidden ? { ...el, hidden: false } : el))
      setTodos(newArray)
    }
    if (label === actions.active) {
      const newArray = todos.map((el) => {
        if (el.class === 'active') {
          return { ...el, hidden: false }
        }

        return { ...el, hidden: true }
      })
      setTodos(newArray)
    }
    if (label === actions.completed) {
      const newArray = todos.map((el) => {
        if (el.class === 'active') {
          return { ...el, hidden: true }
        }
        return { ...el, hidden: false }
      })
      setTodos(newArray)
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
    const sec = Number(strSec) - 1

    if (min || sec) {
      const newMin = sec < 0 ? min - 1 : min
      const newSec = sec < 0 ? 59 : sec
      return formatTime(`${newMin}`, `${newSec}`)
    }
  }

  const timer = (id) => {
    const timer = setInterval(() => {
      setTodos((prevData) => {
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
    editTodo(id, 'timerOn', value)
  }

  const timerPlay = (id) => {
    const idx = todos.findIndex((el) => el.id === id)
    if (!todos[idx].timerOn) {
      toggleTimer(id, true)
      timer(id)
    }
  }

  const timerStop = (id) => {
    toggleTimer(id, false)
  }

  const doneItems = todos.filter((el) => el.done)
  const countTodos = todos.length - doneItems.length

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <NewTaskForm addItem={addItem} formatTime={formatTime} />
      </header>
      <section className="main">
        <TaskList
          todos={todos}
          toogleDone={toogleDone}
          deleteTodo={deleteTodo}
          editTitle={editTitle}
          timerPlay={timerPlay}
          timerStop={timerStop}
        />
        <Footer countTodos={countTodos} clearCompleted={() => clearCompleted(doneItems)} filterTodo={filterTodo} />
      </section>
    </section>
  )
}

export default TodoApp
