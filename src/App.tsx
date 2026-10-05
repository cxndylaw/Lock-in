import { use, useEffect, useMemo, useState } from 'react'

function App() {
  const todo = [
    'Revise for humb test',
    'Miss girbi',
    'Take muppion on a walk',
    'Clean room'
  ]

  const listTodo = todo.map(todo => <li>{todo}</li>)

  //25 mins
  const [seconds, setSeconds] = useState(() => {
    const saved = localStorage.getItem('secondsLeft')
    return saved ? parseInt(saved) : 1500
  })
  const [isRunning, setIsRunning] = useState(false)
  const [sessionCount, setSessionCount] = useState(() => {
    const savedSession = localStorage.getItem('sessionNumber')
    return savedSession ? parseInt(savedSession) : 1
  })
  const displayedSessionCount = Math.round(sessionCount/2)

  //buttons
  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleStop = () =>  {
    setIsRunning(false);
    setSeconds(1500)
    setSessionCount(1)
    //todo finish session screen
  }

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

  useEffect(() => {
    if(seconds <= 0) {
      setSessionCount(prev => prev+1)
      if((sessionCount+1) % 2 == 0) {
        setSeconds(300)
      }
      else {
        setSeconds(1500)
      }
    }
  }, [seconds])

  useEffect(() => {
    localStorage.setItem('sessionNumber', sessionCount.toString())
    if(sessionCount > 7)
    {
      setIsRunning(false)
    }
  }, [sessionCount])

  useEffect(() => {
    localStorage.setItem('secondsLeft', seconds.toString())
  }, [seconds])

  return (
    <>
      <section id='timer'>
        <h1>{Math.floor(seconds/60)}:{((seconds%60).toString()).padStart(2,"0")}</h1>
        <h2>{displayedSessionCount}/4</h2>
        <section className='timerButtons'>
          <button onClick={handleStart}>
            start
          </button>
          <button onClick={handlePause}>
            pause
          </button>
          <button onClick={handleStop}>
            stop
          </button>
        </section>
      </section>
      <section className='todoList'>
        <ul>{listTodo}</ul>
      </section>
    </>
  )
}

export default App
