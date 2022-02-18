import React, { useCallback, useRef, useState } from 'react'
import produce from 'immer'
import './styles/App.scss'

const numRows = 50
const numCols = 50
const vHeight = (90 - 5) / numCols
const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
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

    setTimeout(runSimulation, 1000)
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
        <p>Conway's Game of Life</p>
        <div>

          <button
            onClick={() => {
              setRunning(!running)
              if (!running) {
                runningRef.current = true
                runSimulation()
              }
            }}
          >
            {running ? "stop" : "start"}
          </button>
          <button onClick={generateRandomGrid}>
            Random
          </button>
          <button onClick={() => setGrid(initGrid())}>
            Clear
          </button>
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
                  backgroundColor: grid[i][k] ? "pink" : undefined,
                  border: "solid 1px black"
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
