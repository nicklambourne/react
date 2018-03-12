import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    return (
        <button className="square"
                onClick={props.onClick}
                style={{backgroundColor: props.winning ? 'green' : ''}}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i, winning) {
        if (winning) {
            return (
                <Square
                    key={i}
                    value={this.props.squares[i]}
                    onClick={() => this.props.onClick(i)}
                    winning={true}
                />
            );
        } else {
            return (
                <Square
                    key={i}
                    value={this.props.squares[i]}
                    onClick={() => this.props.onClick(i)}
                    winning={false}
                />
            );
        }

    }

    renderRow(i) {
        let squares = [];
        for (let j = 0; j < 3; j++) {
            squares.push(this.renderSquare(i*3+j, this.props.winners[i*3+j]))
        }
        return (
            <div className="board-row" key={i}>
                {squares}
            </div>
        )
    }

    render() {
        let rows = [];
        for (let i = 0; i < 3; i++) {
            rows.push(this.renderRow(i));
        }
        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            currentStep: 0,
            asc: true,
            winners: Array(9).fill(null),
        }
    }

    jumpTo(step) {
        if (!calculateWinner(this.state.history[this.state.currentStep], this.state.winners)) {
            this.setState(
                this.setState((state, props) => {
                    state['winners'] = Array(9).fill(null);
                    return state;
                })
            )
        }
        this.setState({
            currentStep: step,
            xIsNext: (step % 2) === 0,
        })
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.currentStep + 1);
        const current = history[history.length - 1];
        let squares = current.squares.slice(); // Deep copy
        if (calculateWinner(squares, this.state.winners) || squares[i]) {
            return;
        }
        if (this.state.xIsNext) {
            squares[i] = 'X';
        } else {
            squares[i] = 'O';
        }
        this.setState({
            history: history.concat([{
                squares: squares,
                x: Math.floor(i/3),
                y: i%3,
            }]),
            currentStep: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.currentStep];
        const winner = calculateWinner(current.squares, this.state.winners);
        const steps = this.state.asc ?
                      history.slice(0, this.state.currentStep) :
                      history.slice(0, this.state.currentStep).reverse();
        const moves = steps.map((step, move) => {
            const desc = 'Go to move #' + (this.state.asc ? move : history.slice(0, this.state.currentStep).length - 1 - move) +
                         (step.x === undefined ? '' : ' (' + step.x + ', ' + step.y + ') ');
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(this.state.asc ? move : history.length - 2 - move)}>{desc}</button>
                </li>
            );
        });

        let status = winner ? 'Winner: ' + winner : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

        status = draw(current.squares) && !winner ? 'The game ended in a draw' : status;

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winners={this.state.winners}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>
                        <button onClick={() => {
                            this.setState((state, props) => {
                                state['asc'] = !state.asc;
                                return state;
                            })}
                        }>
                            Swap Order
                        </button>
                    </div>
                    <ul>{moves}</ul>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares, winners) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],

    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            winners[a] = true;
            winners[b] = true;
            winners[c] = true;
            return squares[a];
        }
    }
    return null;
}

function draw(squares) {
    return squares.reduce((accumulator, currentValue) => currentValue ? accumulator + 1 : accumulator, 0) === 9;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
