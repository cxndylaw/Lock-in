import { use, useEffect, useMemo, useState } from 'react'
import { FaPlay, FaPause, FaStop } from 'react-icons/fa'

function App() {
  const todo = [
    'Revise for humb test',
    'Miss girbi',
    'Take muppion on a walk with girbidi girbi <3',
    'Clean room'
  ]

  const listTodo = todo.map(todo => <li>{todo}</li>)
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
  const [isBreak, setIsBreak] = useState(false)
  const displayedSessionCount = Math.round(sessionCount/2)
  const [sessionType, setSessionType] = useState("Lock in Time!")

  //buttons
  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleStop = () =>  {
    setIsRunning(false);
    setSeconds(workDuration * 60)
    setSessionCount(1)
    //todo finish session screen
  }

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
        setIsBreak(true)
        setSeconds(breakDuration * 60)
      }
      else {
        setIsBreak(false)
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
      </section>
    </>
  )
}

export default App
