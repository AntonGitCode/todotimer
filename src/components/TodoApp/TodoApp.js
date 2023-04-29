import React, { Component } from 'react'

import TaskList from '../TaskList'
import NewTaskForm from '../NewTaskForm'
import Footer from '../Footer'

import './TodoApp.css'

export default class App extends Component {
  counter = 1

  state = {
    todos: [],
    statusFilter: 'all',
  }

  saveTimer = (unmountedMin = 0, unmountedSec, unmountedTimerId, isRunning, unmountedId) => {
    if (!this.state.todos.length) return
    if (!unmountedTimerId && !unmountedMin && !unmountedSec) return

    if (unmountedMin >= 0 || unmountedSec > 0) {
      this.setState(
        ({ todos }) => {
          const idx = todos.findIndex((el) => el.id === unmountedId)
          if (idx < 0) return false
          const oldTodo = todos[idx]

          if (oldTodo.timer === unmountedTimerId) return false

          const updateTodo = {
            ...oldTodo,
            minutes: unmountedMin,
            seconds: unmountedSec,
            timer: unmountedTimerId,
            isRunning: isRunning,
          }
          const updateArr = [...todos.slice(0, idx), updateTodo, ...todos.slice(idx + 1)]

          return { todos: updateArr }
        },
        () => {
          const { todos } = this.state
          const idx = todos.findIndex((el) => el.id === unmountedId)
          if (idx < 0) return
          const oldTodo = todos[idx]
          if (!oldTodo.isRunning) return
          clearInterval(oldTodo.timer)

          const tempTimerId = setInterval(() => {
            this.setState(({ todos }) => {
              const indx = todos.findIndex((el) => el.id === unmountedId)
              const oldTodo = todos[indx]

              const { minutes, seconds } = oldTodo
              let newMinutes = Number(minutes)
              let newSeconds = Number(seconds)

              if (Number(seconds) == 0 && Number(minutes) > 0) {
                newMinutes--
                newSeconds = 59
              }
              if (Number(seconds) == 0 && Number(minutes) == 0) {
                newSeconds = 0
                newMinutes = 0
              }
              newSeconds--

              const newTodo = {
                ...oldTodo,
                minutes: newMinutes,
                seconds: newSeconds,
              }
              const newArr = [...todos.slice(0, idx), newTodo, ...todos.slice(idx + 1)]
              return { todos: newArr }
            })
          }, 1000)

          const updTodo = {
            ...oldTodo,
            timer: tempTimerId,
          }

          const newArr = [...todos.slice(0, idx), updTodo, ...todos.slice(idx + 1)]
          this.setState({ todos: newArr })
        }
      )
    }
  }

  createTask = (title, mins, secs) => {
    return {
      id: this.counter++,
      title,
      createDate: Date.now(),
      completed: false,
      minutes: Number(mins),
      seconds: secs,
      timer: null,
      isRunning: false,
    }
  }

  addTask = (title, mins, secs) => {
    if (mins == '') mins = 0
    this.setState(({ todos }) => {
      return {
        todos: todos.concat([this.createTask(title, mins, secs)]),
      }
    })
  }

  deleteTodo = (timer, id) => {
    clearInterval(timer)

    this.setState(({ todos }) => {
      const idx = todos.findIndex((el) => el.id === id)
      if (idx < 0) return false
      const newArray = [...todos.slice(0, idx), ...todos.slice(idx + 1)]
      return {
        todos: newArray,
      }
    })
  }

  updateIsRunning = (id, isRunning) => {
    this.setState(({ todos }) => {
      const idx = todos.findIndex((el) => el.id === id)
      if (idx < 0) return false
      const oldTodo = todos[idx]
      const newTodo = { ...oldTodo, isRunning: isRunning }
      const newArray = [...todos.slice(0, idx), newTodo, ...todos.slice(idx + 1)]
      return {
        todos: newArray,
      }
    })
  }

  onToggleDone = (timer, id) => {
    clearInterval(timer)
    this.setState(({ todos }) => {
      const idx = todos.findIndex((el) => el.id === id)
      if (idx < 0) return false
      const oldTodo = todos[idx]
      const newTodo =
        todos[idx].completed === false
          ? { ...oldTodo, completed: true, isRunning: false }
          : { ...oldTodo, completed: false, isRunning: false }
      const newArray = [...todos.slice(0, idx), newTodo, ...todos.slice(idx + 1)]

      return { todos: newArray }
    })
  }

  makeFiltered = (newStatus) => {
    this.setState(() => {
      return {
        statusFilter: newStatus,
      }
    })
  }

  clearCompleted = () => {
    this.setState(({ todos }) => {
      return {
        todos: todos.filter((el) => !el.completed),
      }
    })
  }

  render() {
    const { todos, statusFilter } = this.state
    const activeTodoCount = todos.length - todos.filter((el) => el.completed).length

    return (
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <NewTaskForm addTask={this.addTask} />
        </header>
        <section className="main">
          {todos.length ? (
            <TaskList
              todos={todos}
              onDeleted={this.deleteTodo}
              onToggleDone={this.onToggleDone}
              statusFilter={statusFilter}
              saveTimer={this.saveTimer}
              clearTemporaryTimer={this.clearTemporaryTimer}
              updateIsRunning={this.updateIsRunning}
            />
          ) : (
            <p className="list-is-empty">List is empty - type above to add a task</p>
          )}
          {
            <Footer
              activeTodoCount={activeTodoCount}
              makeFiltered={this.makeFiltered}
              clearCompleted={this.clearCompleted}
              statusFilter={statusFilter}
            />
          }
        </section>
      </section>
    )
  }
}
