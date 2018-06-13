import React, { Component } from 'react';
import './Board.css'

class Board extends Component {
  constructor(props) {
    super(props);
    let board = [];
    for(let i = 0; i < 3; i++) {
      board.push([]);
      for(let j = 0; j < 3; j++) {
        board[i].push('');
      }
    }

    this.state = {
      board: board
    };
  }

  onCellClicked(e, rowIdx, idx) {
    let board = this.state.board;
    board[rowIdx][idx] = board[rowIdx][idx] === 'x' ? 'o' : 'x';
    this.setState({
      board
    });
  }

  render() {
    let table = this.state.board.map((row, rowIdx) => {
      return <tr key={rowIdx}>{row.map((cell, idx) => {
        return <td key={'cell_' + idx} onClick={(e) => this.onCellClicked(e, rowIdx, idx)}><span>{cell}                  </span></td>;
      })}
      </tr>;
    });

    console.log(table);

    return (
      <div>
        <table><tbody>{table}</tbody></table>
      </div>
    );
  }
}

export default Board;
