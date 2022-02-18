import React, { useCallback, useRef, useState } from 'react'
import produce from 'immer'
import './styles/App.scss'

const numRows = 50
const numCols = 50
const vHeight = (85 - 5) / numCols
const operations = [
  [0, 1], [0, -1],
  [1, 1], [1, -1], [1, 0],
  [-1, 1], [-1, -1], [-1, 0],
]
const initGrid = () => {
  const rows = []
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0))
  }
  return rows
}

const App: React.FC = () => {
  const [grid, setGrid] = useState(initGrid())

  const [lifeTime, setLifeTime] = useState(500)
  const lifeTimeRef = useRef(lifeTime)
  lifeTimeRef.current = lifeTime

  const [running, setRunning] = useState(false)
  const runningRef = useRef(running)
  runningRef.current = running

  const runSimulation = useCallback(() => {
    if (!runningRef.current) return

    setGrid((g) => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numRows; k++) {
            let neighbours = 0

            operations.forEach(([x, y]) => {
              const newI = i + x
              const newK = k + y
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbours += g[newI][newK]
              }
            })

            if (neighbours < 2 || neighbours > 3) {
              gridCopy[i][k] = 0
            } else if (g[i][k] === 0 && neighbours === 3) {
              gridCopy[i][k] = 1
            }
          }
        }
      })
    })

    setTimeout(runSimulation, lifeTimeRef.current)
  }, [])

  const generateRandomGrid = () => {
    const rows = []
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => (Math.random() > 0.8 ? 1 : 0)))
    }
    setGrid(rows)
  }

  return (
    <div className="App">
      <header className="App-header">
        <p className="App-title">Conway's Game of Life</p>

        <div className="actions">

          <div className="actions-btn-div">
            <button
              onClick={() => {
                setRunning(!running)
                if (!running) {
                  runningRef.current = true
                  runSimulation()
                }
              }}
            >
              {running ? "Stop" : "Start"}
            </button>

            <button onClick={generateRandomGrid}>
              Random
            </button>

            <button onClick={() => setGrid(initGrid())}>
              Clear
            </button>
          </div>

          <div className="actions-range-div">
            <span className='lifetime-value'>Lifetime: {lifeTime / 1000}s</span>

            <div className="actions-input-div">
              <span className='lifetime-span'>0.025s</span>
              <input
                className="action-input-range"
                type="range"
                min={25}
                value={lifeTime}
                max={1000}
                onChange={(e) => {
                  setLifeTime(Number(e?.target?.value))
                }}
              />
              <span className='lifetime-span'>1s</span>
            </div>
          </div>

        </div>
      </header>

      <section className="App-section" >
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, ${vHeight}vh)`
        }} >
          {grid.map((rows, i) => (
            rows.map((cols, k) => (
              <div
                key={`${i}-${k}`}
                onClick={() => {
                  const newGrid = produce(grid, gridCopy => {
                    gridCopy[i][k] = gridCopy[i][k] ? 0 : 1
                  })
                  setGrid(newGrid)
                }}
                style={{
                  width: `${vHeight}vh`,
                  height: `${vHeight}vh`,
                  backgroundColor: grid[i][k] ? "#c4d1ee" : undefined,
                  boxShadow: grid[i][k] ? `inset 2px 2px 2px rgba(0, 0, 0, 0.5),
                  inset -2px -2px 2px rgba(255, 255, 255, 0.5)` : undefined,
                  border: "solid 1px #404653"
                }}
              ></div>
            ))
          ))}
        </div>
      </section>
    </div>
  )
}

export default App
