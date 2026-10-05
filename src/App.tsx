import { use, useEffect, useMemo, useState } from 'react'
import { FaPlay, FaPause, FaStop, FaPlus } from 'react-icons/fa'

function App() {

  const [workDuration, setWorkDuration] = useState(25)  // minutes
  const [breakDuration, setBreakDuration] = useState(5)  // minutes

  //25 mins
  const [seconds, setSeconds] = useState(() => {
    const saved = localStorage.getItem('secondsLeft')
    return saved ? parseInt(saved) : workDuration * 60
  })
  const [isRunning, setIsRunning] = useState(false)
  const [sessionCount, setSessionCount] = useState(() => {
    const savedSession = localStorage.getItem('sessionNumber')
    return savedSession ? parseInt(savedSession) : 1
  })
  const [isBreak, setIsBreak] = useState(() => {
    const savedBreak = localStorage.getItem('setBreak') 
    return savedBreak ? JSON.parse(savedBreak) : false
  })
  const displayedSessionCount = Math.round(sessionCount/2)
  const [sessionType, setSessionType] = useState("Lock in Time!")
  const [isAddingTodo, setIsAddingToDo] = useState(false)
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const listTodo = todos.map(todo => (
    <li 
      key={todo.id} 
      onClick={() => handleToggleTodo(todo.id)}
      onDoubleClick={() => handleDeleteTodo(todo.id)}
      className={todo.completed ? 'completed' : ''}
    >
      {todo.text}
    </li>
  ))


  const [inputValue, setInputValue] = useState('')

  const handleToggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const handleAddTodo = () => {
    const lines = inputValue.trim().split('\n')
    const newTodos = lines
      .filter(line => line.trim() !== '')
      .map(line => ({ 
        id: Date.now() + Math.random(), 
        text: line.trim(), 
        completed: false 
      }))
    
    if(newTodos.length > 0) {
      setTodos([...todos, ...newTodos])
      setInputValue('')
      setIsAddingToDo(false)
    }
  }

  const playSound = (frequency = 800, duration = 0.5) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    
    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    
    oscillator.frequency.value = frequency
    oscillator.type = 'sine'
    gain.gain.setValueAtTime(0.3, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  }

  //buttons
  const handleStart = () => {
    playSound(800, 1)  // Quick beep
    setIsRunning(true)
  }
  const handlePause = () => setIsRunning(false)
  const handleStop = () =>  {
    setIsRunning(false);
    setSeconds(workDuration * 60)
    setSessionCount(1)
    //todo finish session screen
  }

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    if(isBreak) {
      setSessionType("Break!")
    }
    else {
      setSessionType("Lock in Time!")
    }
  }, [isBreak])

  //count mechanics
  useEffect(() => {
    const intervalId = setInterval(() => {
      if(isRunning) {
        setSeconds(prev => prev-1);
      }
    },1000);

    return () => {
      clearInterval(intervalId)
    }
  }, [isRunning])

  //Timer ends
  useEffect(() => {
    if(seconds <= 0) {
      setSessionCount(prev => prev+1)
      if((sessionCount+1) % 2 == 0) {
        playSound(1000, 1.5)
        setIsBreak(true)
        localStorage.setItem('setBreak', JSON.stringify(true))  // Store the actual boolean
        setSeconds(breakDuration * 60)
      }
      else {
        playSound(900, 1)
        setIsBreak(false)
        localStorage.setItem('setBreak', JSON.stringify(false))  // Store the actual boolean
        setSeconds(workDuration * 60)
      }
    }
  }, [seconds])

  //Session Tracker
  useEffect(() => {
    localStorage.setItem('sessionNumber', sessionCount.toString())
    if(sessionCount > 7)
    {
      setIsRunning(false)
    }
  }, [sessionCount])

  //Seconds Tracker
  useEffect(() => {
    localStorage.setItem('secondsLeft', seconds.toString())
  }, [seconds])

  return (
    <>
      <section className={`timer ${isRunning ? 'running' : 'paused'}`}>
        <div className='timerText'>
          <h2 className='sessionType'>{sessionType}</h2>
          <h2 className='sessionCount'>{displayedSessionCount}/4</h2>
          <h1 className='time'>{Math.floor(seconds/60)}:{((seconds%60).toString()).padStart(2,"0")}</h1>
        </div>
        <section className='timerButtons'>
          {!isRunning ? (
            <button onClick={handleStart}>
              <FaPlay />
            </button>
          ) : (
            <>
              <button onClick={handlePause}>
                <FaPause />
              </button>
              <button onClick={handleStop}>
                <FaStop />
              </button>
            </>
          )}
        </section>
      </section>
      <section className='todoList'>
        <p className='title'>To-do List</p>
        <ul>{listTodo}</ul>
        <div >
          {isAddingTodo ? (
            <div className='inputTodo'>
              <textarea 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if(e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleAddTodo()
                  }
                }}
              />
              <button onClick={handleAddTodo}>Add</button>
            </div>
          ) : (
            <button className='addTodo' onClick={() => setIsAddingToDo(true)}>Add new</button>
          )}
        </div>
      </section>
    </>
  )
}

export default App
