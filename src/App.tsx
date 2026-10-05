import { use, useEffect, useState } from 'react'

function App() {
  const todo = [
    'Revise for humb test',
    'Miss girbi',
    'Take muppion on a walk',
    'Clean room'
  ]

  const listTodo = todo.map(todo => <li>{todo}</li>)

  //25 mins
  const [seconds, setSeconds] = useState(1500)
  const [isRunning, setIsRunning] = useState(false)

  //buttons
  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleStop = () =>  {
    setIsRunning(false);
    setSeconds(1500)
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
        setIsRunning(false)
    }
  }, [seconds])

  return (
    <>
      <section id='timer'>
        <h1>{Math.floor(seconds/60)}:{((seconds%60).toString()).padStart(2,"0")}</h1>
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
