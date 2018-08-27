import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const SQUARE_TYPE = Object.freeze({ BLANK: "blank", SELECTED: "selected", FILLED: "filled"});
const GAME_FIELD_SIZE = 4;
const MIN_SELECTION = 3;
const MAX_SELECTION = 5;

function Square(props) {
  return (
    <button className={`square ${props.value.type}`} onClick={props.onClick}/>
  );
}

class Board extends React.Component {
  renderSquare(i, j) {
    return (
      <Square
        value={this.props.squares[i][j]}
        onClick={() => this.props.onClick(i, j)}
      />
    );
  }

  render() {
    return (
      <div>
        {this.props.squares.map((row, i) =>
         <div className="board-row" key={i}>
           {row.map((col, j) =>
            <span key={j}>
              {this.renderSquare(i, j)}
            </span>
           )}
         </div>
       )}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: createSquaresArray(),
      selectedSquares: 0,
      nextIsHuman: true,
    };
  }

  handleClick(i, j) {
    const squares = this.state.squares.slice();
    if (squares[i][j].type === SQUARE_TYPE.BLANK && this.state.selectedSquares < MAX_SELECTION) {
      squares[i][j].type = SQUARE_TYPE.SELECTED;
      this.setState({
        squares: squares,
        selectedSquares: this.state.selectedSquares + 1,
        nextIsHuman: false,
      });
    }
  }

  finishMove() {
    var squares = changeSquaresType(this.state.squares, SQUARE_TYPE.SELECTED, SQUARE_TYPE.FILLED, this.state.selectedSquares);
    this.setState({
      squares: squares,
      selectedSquares: 0,
    });
    if (!this.isGameFinished()) {
      this.computerMove();
    }
  }

  computerMove() {
    const numberOfSquares = Math.floor((Math.random() * MAX_SELECTION) + MIN_SELECTION);
    var squares = changeSquaresType(this.state.squares, SQUARE_TYPE.BLANK, SQUARE_TYPE.FILLED, numberOfSquares);
    this.setState({
      squares: squares,
      nextIsHuman: true,
    });
  }

  restartGame() {
    this.setState({
      squares: createSquaresArray(),
      selectedSquares: 0,
      nextIsHuman: true,
    });
  }

  isGameFinished() {
    return calculateNumberOfSquares(this.state.squares, SQUARE_TYPE.FILLED) > (GAME_FIELD_SIZE*GAME_FIELD_SIZE - MIN_SELECTION);
  }

  render() {
    const resultClassName = this.isGameFinished() ? 'game-result' : 'game-result hidden'
    const result = this.state.nextIsHuman ? 'You lost' : 'You won';
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={this.state.squares}
            onClick={(i, j) => this.handleClick(i, j)}
          />
        </div>
        <div className={resultClassName}>
          {result}
        </div>
        <div className="game-controls">
          <button onClick={() => this.finishMove()} disabled={this.state.selectedSquares < MIN_SELECTION}>Finish move</button>
          <button onClick={() => this.restartGame()}>Restart game</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateNumberOfSquares(squares, type) {
  var numberOfSquares = 0;
  for (let i = 0; i < squares.length; i++) {
    for (let j = 0; j < squares[i].length; j++) {
      if (squares[i][j].type === type) {
        numberOfSquares++;
      }
    }
  }
  return numberOfSquares;
}

function changeSquaresType(oldSquares, oldType, newType, numberOfSquares) {
  var squares = oldSquares.slice();
  for (let i = 0; i < squares.length; i++) {
    for (let j = 0; j < squares[i].length; j++) {
      if (squares[i][j].type === oldType) {
        squares[i][j].type = newType;
        numberOfSquares--;
        if (numberOfSquares <= 0) {
          return squares;
        }
      }
    }
  }
  return squares;
}

function createSquaresArray() {
  return Array(GAME_FIELD_SIZE).fill().map(r => (new Array(GAME_FIELD_SIZE).fill().map(c => ({type: SQUARE_TYPE.BLANK}))));
}
