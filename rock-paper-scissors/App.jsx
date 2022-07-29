import { useState } from 'react'
import rockImg from './assets/rock.svg'
import paperImg from './assets/paper.svg'
import scissorsImg from './assets/scissors.svg'

import './App.css'

const moves = {
  rock: 'rock',
  paper: 'paper',
  scissors: 'scissors',
}

const winner = {
  computer: 'computer',
  user: 'user',
  draw: 'draw',
}

const App = () => {
  const [rounds, setRounds] = useState([])

  const makeMove = (userMove) => {
    const computerMove = getComputerMove()
    const winner = calculateWinner(userMove, computerMove)
    const entry = {userMove, computerMove, winner}
    setRounds(current => [...current, entry])
  }

  const score = calculateScore(rounds)

  return (
    <div className="App">
      <h1>Rock Paper Scissors</h1>
      <div>
        <button onClick={() => makeMove(moves.rock)} className="move-btn">
          <img src={rockImg} alt="rock" />
          <p>Rock</p>
        </button>
        <button onClick={() => makeMove(moves.paper)} className="move-btn">
          <img src={paperImg} alt="paper" />
          <p>Paper</p>
        </button>
        <button onClick={() => makeMove(moves.scissors)} className="move-btn">
          <img src={scissorsImg} alt="scissors" />
          <p>Scissors</p>
        </button>
      </div>

      <h2>Score</h2>
      <p>You: {score.user} Computer: {score.computer} Draw: {score.draw}</p>

      {renderRounds(rounds)}
    </div>
  )
}

const renderRounds = (rounds) => {
  if(!rounds.length) return null

  return (
    <>
      <h3>Rounds</h3>
      <table className='rounds-table'>
        <thead>
          <tr>
            <th>Round</th>
            <th>User</th>
            <th>Computer</th>
            <th>Winner</th>
          </tr>
        </thead>
        <tbody>
        {rounds.slice().reverse().map((entry, i) => {
          return (
            <tr key={i}>
              <td>{rounds.length - i}</td>
              <td>{entry.userMove}</td>
              <td>{entry.computerMove}</td>
              <td>{entry.winner}</td>
            </tr>
          )
        })}
        </tbody>
      </table>
    </>
  )
}

const getComputerMove = () => {
  const keys = Object.keys(moves)
  const randomKey = keys[Math.floor(Math.random()*keys.length)]
  return moves[randomKey]
}

const calculateWinner = (userMove, computerMove) => {
  if (userMove === computerMove) return winner.draw

  if (userMove === moves.rock && computerMove == moves.paper ) return winner.computer
  if (userMove === moves.paper && computerMove == moves.scissors ) return winner.computer
  if (userMove === moves.scissors && computerMove == moves.rock ) return winner.computer

  return winner.user
}

const calculateScore = (history) => {
  const score = {
    user: 0,
    computer: 0,
    draw: 0,
  }

  for (const entry of history) {
    if (entry.winner === winner.computer) score.computer++
    if (entry.winner === winner.user) score.user++
    if (entry.winner === winner.draw) score.draw++
  }

  return score
}

export default App
