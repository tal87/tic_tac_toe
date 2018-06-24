import React, { Component } from 'react';
import './Board.css'
// import ScoreBoard from '../scoreboard/scoreboard';

class Board extends Component {
  constructor(props) {
    super(props);
    let state = this.initState();
    state.scoreBoard = {
      computer: 0,
      player: 0
    };

    this.state = state;
  }

  initBoard() {
    let board = [];
    for(let i = 0; i < 3; i++) {
      board.push([]);
      for(let j = 0; j < 3; j++) {
        board[i].push('');
      }
    }

    return board;
  }

  initState() {
    let board = this.initBoard();
    return {
      board,
      winner: '',
      filled: 0
    }
  }

  onCellClicked(e, rowIdx, idx) {
    if(this.state.board[rowIdx][idx] || this.state.winner) {
      return;
    }

    let board = this.state.board;
    board[rowIdx][idx] = 'x';
    let winner = this.checkWinner(board);
    let filled = this.state.filled + 1;
    if(!winner && filled < 9) {
      this.computerNextMove(board);
      winner = this.checkWinner(board);
      filled++;
    }
    
    let scoreBoard = this.state.scoreBoard;
    if(winner) {
      scoreBoard = this.updateScoreBoard(winner);
    }

    this.setState({
      board,
      winner,
      filled,
      scoreBoard
    });
  }

  updateScoreBoard(winner) {
    let scoreBoard = this.state.scoreBoard;
    if(winner === 'o') {
      scoreBoard.computer++;
    }else {
      scoreBoard.player++;
    }

    return scoreBoard;
  }

  computerNextMove(board) {
    let emptyCells = [];
    let row = 0;
    let col = 0;
    let i = 0;
    for(i = 0; i < board.length; i++) {
      for(var j = 0; j < board[0].length; j++) {
        if(!board[i][j]) {
          let singleIdx = i * board.length + j;
          emptyCells.push(singleIdx);
        }
      }
    }

    // see if there's a chance to win
    let copyBoard = [];
    for(i = 0; i < 3; i++){
      copyBoard.push([]);
      for(let j = 0; j < 3; j++){
        copyBoard[i].push(board[i][j]);
      }
    }
    
    for(i = 0; i < emptyCells.length; i++) {
      row = Math.floor(emptyCells[i] / 3);
      col = emptyCells[i] % 3;
      copyBoard[row][col] = 'o';
      if(this.checkWinner(copyBoard) === 'o'){
        board[row][col] = 'o';
        return;
      }

      copyBoard[row][col] = '';
    }

    // no chance to win
    // block x if it has a chance to win
    for(i = 0; i < emptyCells.length; i++) {
      row = Math.floor(emptyCells[i] / 3);
      col = emptyCells[i] % 3;
      copyBoard[row][col] = 'x';
      if(this.checkWinner(copyBoard) === 'x'){
        board[row][col] = 'o';
        return;
      }

      copyBoard[row][col] = '';
    }

    let randIdx = Math.floor(Math.random() * emptyCells.length);
    let boardIdx = emptyCells[randIdx];
    row = Math.floor(boardIdx / 3);
    col = boardIdx % 3;
    board[row][col] = 'o';
  }

  checkWinner(board) {
    // check rows
    for(let i = 0; i < board.length; i++) {
      if(board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]){
        return board[i][0];
      }
    }
    
    // check columns
    for(let i = 0; i < board.length; i++) {
      if(board[0][i] && board[0][i] === board[1][i] && board[0][i] === board[2][i]){
        return board[0][i];
      }
    }

    // check primary diagonal
    if(board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]){
      return board[0][0];
    }

    // check secondary diagonal
    if(board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]){
      return board[0][2];
    }
  }

  onRestartClicked() {
    this.setState(this.initState())
  }

  render() {
    let table = this.state.board.map((row, rowIdx) => {
      return <tr key={rowIdx}>{row.map((cell, idx) => {
        return <td key={'cell_' + idx} onClick={(e) => this.onCellClicked(e, rowIdx, idx)}><span>{cell}</span></td>;
      })}
      </tr>;
    });

    let winnerMessage = `${this.state.winner === 'x' ? 'You' : 'Computer'} won: ${this.state.winner === 'x' ? 'Congratulations!' : 'Try again next time'}`
    let tieMessage = 'It\'s a tie! try again.'
    return (
      <div>
        <div id="tblDiv">
          <table><tbody>{table}</tbody></table>
        </div>
        <div className="center">
          <button onClick={() => this.onRestartClicked()}>Restart</button>
          <div>Computer: {this.state.scoreBoard.computer} - Player: {this.state.scoreBoard.player}</div>
          {this.state.winner && <div id="winner">{winnerMessage}</div>}
          {!this.state.winner && this.state.filled === 9 && <div id="winner">{tieMessage}</div>}
        </div>
      </div>
    );
  }
}

export default Board;
