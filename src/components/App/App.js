import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { v4 as uuidv4 } from 'uuid'

import Footer from '../Footer'
import NewTaskForm from '../NewTaskForm'
import TaskList from '../TaskList'

import './App.css'

const TodoApp = () => {
  const [todos, setTodos] = useState([])
  const [intervalIds, setIntervalIds] = useState([])

  useEffect(() => {
    const prevTodos = JSON.parse(localStorage.getItem('todos')) || []
    const updatedTodos = prevTodos.map((todo) => {
      return { ...todo, time: new Date(todo.time) }
    })
    setTodos(updatedTodos)
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    const timersToStart = todos.filter((todo) => todo.timerOn)

    if (timersToStart.length > 0) {
      const newIds = timersToStart.map((todo) => {
        return setInterval(() => {
          setTodos((prevTodos) => {
            const index = prevTodos.findIndex((t) => t.id === todo.id)
            if (index > -1) {
              const newTodos = [...prevTodos]
              newTodos[index] = {
                ...newTodos[index],
                time: new Date(newTodos[index].time),
                timerValue: countDown(String(newTodos[index].timerValue)),
              }
              return newTodos
            }
            return prevTodos
          })
        }, 1000)
      })
      setIntervalIds((prevIds) => [...prevIds, ...newIds])
    }
  }, [todos])

  useEffect(() => {
    return () => {
      intervalIds.forEach(clearInterval)
    }
  }, [intervalIds])

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

    const oldTodo = todos[idx]
    const classItem = classNames({ completed: oldTodo.class === 'active', active: oldTodo.class === 'completed' })

    const newTodo = oldTodo.timerOn
      ? { ...oldTodo, done: !oldTodo.done, class: classItem }
      : { ...oldTodo, done: !oldTodo.done, class: classItem, timerOn: false }
    const newArray = [...todos.slice(0, idx), newTodo, ...todos.slice(idx + 1)]
    console.log('oldTodo.timerOn ', oldTodo.timerOn)
    console.log('intervalIds[idx]', intervalIds[idx])

    if (oldTodo.timerOn) {
      clearInterval(intervalIds[idx])
      setIntervalIds((prevIds) => prevIds.filter((id) => id !== intervalIds[idx])) // remove intervalId from intervalIds
    }
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

  const timerStop = (id) => {
    const index = todos.findIndex((todo) => todo.id === id)
    const todo = todos[index]
    clearInterval(intervalIds[index])
    const newTodos = [...todos]
    newTodos[index] = { ...todo, timerOn: false }
    setTodos(newTodos)
    setIntervalIds((prevIds) => prevIds.filter((id) => id !== intervalIds[index])) // remove intervalId from intervalIds
  }

  const startTimer = (id) => {
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
    if (!todos[idx].timerOn && !todos[idx].done) {
      toggleTimer(id, true)
      startTimer(id)
    }
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
