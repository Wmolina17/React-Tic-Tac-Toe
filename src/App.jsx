import { useState } from 'react'
import confetti from "canvas-confetti"
import { Square } from './components/square.jsx'
import { TURNS, WINNER_COMBOS } from './constants.js'
import { WinnerModal } from './components/winnerModal.jsx'
 
function App() {
  const [board , setboard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem("board")
    if (boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem("turn")
    return turnFromStorage ?? TURNS.X
  })


  const [winner, setWinner] = useState(null)


  const checkWinner = (boardToCheck) => {
    for (const combo of WINNER_COMBOS){
      const [a, b, c] = combo
      if(
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ){
        return board[a]
      }
    }
  }

  const resetGame = () => {
    setboard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    window.localStorage.removeItem("board")
    window.localStorage.removeItem("turn")
  }

  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square != null)
  }

  const updateBoard = (index) => {
    // si el square ya tiene algo
    if (board[index] || winner) return

    // actualizar el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setboard(newBoard)

    // cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    // guardar partida
    window.localStorage.setItem("board", JSON.stringify(newBoard))
    window.localStorage.setItem("turn", newTurn)

    // revisar si hay ganador
    const NewWinner = checkWinner(newBoard)
    if (NewWinner){
      confetti()
      setWinner(NewWinner)
    } else if (checkEndGame(newBoard)){
      setWinner(false)
    }

  }


  return (
    <>
      <main className='board'>
          <h1>Tic Tac Toe En React 😎</h1>
          <section className='game'>
              {
                board.map((square, index) => {
                  return(
                    <Square key={index} index={index} updateBoard={updateBoard}>
                       {square}
                    </Square>
                  )
                })
              }
          </section>
          <section className='turn'>
              <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
              <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
          </section>
          <button onClick={resetGame}>Resetear Juego</button>
      </main>

      <WinnerModal resetGame={resetGame} winner={winner}></WinnerModal>
    </>
  )
}

export default App
