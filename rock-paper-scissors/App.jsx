import { useState } from 'react'
import * as brain from 'brain.js'
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
    const computerMove = getComputerMove(userMove, rounds)

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

const getComputerMove = (userMove, rounds) => {
  try {
    const net = train(rounds)

    const inputRock = movesToInput(userMove, moves.rock)
    const inputPaper = movesToInput(userMove, moves.paper)
    const inputScissors = movesToInput(userMove, moves.scissors)

    const testRock = net.run(inputRock)
    const testPaper = net.run(inputPaper)
    const testScissors = net.run(inputScissors)

    return selectMove(testRock, testPaper, testScissors)
  }
  catch (e) {
    console.log(e)
    return randomMove()
  }
}

const movesToInput = (userMove, computerMove) => {
  const input = {
    userRock: +(userMove === moves.rock),
    userPaper: +(userMove === moves.paper),
    userScissors: +(userMove === moves.scissors),
    computerRock: +(computerMove === moves.rock),
    computerPaper: +(computerMove === moves.paper),
    computerScissors: +(computerMove === moves.scissors),
  }

  return input
}

const train = (rounds) => {
  const net = new brain.NeuralNetwork()

  if (!rounds.length) return net

  const trainingData = rounds.map(entry => {
    const input = movesToInput(entry.userMove, entry.computerMove)
    const output = {
      user: +(entry.winner === winner.user),
      computer: +(entry.winner === winner.computer),
      draw: +(entry.winner === winner.draw),
    }

    return {input, output}
  })

  net.train(trainingData)

  return net
}

const randomMove = () => {
  const keys = Object.keys(moves)
  const randomKey = keys[Math.floor(Math.random()*keys.length)]
  return moves[randomKey]
}

const selectMove = (rock, paper, scissors) => {
  const options = [
    { move: moves.rock, score: rock.computer },
    { move: moves.paper, score: paper.computer },
    { move: moves.scissors, score: scissors.computer },
  ]

  const best = options.reduce(
    (previousValue, currentValue) => {
      if(currentValue.score > previousValue.score) return currentValue

      return previousValue
    },
    options.at(0)
  )

  if (best.score < 0.1) throw('didn\'t find good move')

  return best.move
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
