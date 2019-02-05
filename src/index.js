import React from 'react';
import ReactDOM from 'react-dom';
import Switch from '@material-ui/core/Switch';
import './index.css';

function Square(props){
	return (
		<button
			className="square"
			onClick={props.onClick}
		>
			{props.value}
		</button>
	);
}


class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		let grid = [];
		for(let i = 0; i < 3; i++) {
			let bordRow = [];
			for(let j = 0; j < 3; j++) {
				bordRow.push(this.renderSquare(i * 3 + j));
			}
			let row = (
				<div className="board-row">
					{bordRow}
				</div>
			);
			grid.push(row);
		}

		return (
			<div>{grid}</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null)
			}],
			stepNumber: 0,
			xIsNext: true,
			selectedMove: null,
			isReverse: false
		}
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if(calculateWinner(squares) || squares[i]) {
			return;
		}

		squares[i] = this.state.xIsNext ? "X" : "O";
		this.setState({
			history: history.concat([{
				squares: squares
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext
		})
	}

	jumpTo(step) {
		this.setState({
			selectedMove: step,
			stepNumber: step,
			xIsNext: (step % 2) === 0
		});
	}

	handleSwitch(data) {
		this.setState({
			isReverse: !data
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		let reverseHistory = history.reverse();
		let isReverse = this.state.isReverse;
		let historyList = isReverse ? reverseHistory : history;

		const moves = historyList.map((step, move) => {
			const desc = move ? "Go to move #" + move : "Go to game start";
			let moveButton = "idel";
			if(this.state.selectedMove === move) {
				moveButton = "active";
			}
			return (
				<li key={move}>
					<button className={moveButton} onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			)
		})

		let status;
		if(winner) {
			status = "Winner: " + winner;
		}else{
			status = "Next player: " + (this.state.xIsNext ? "X" : "O");
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={i => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<div>
						<Switch
							checked={this.state.isReverse}
							onChange={() => this.handleSwitch(this.state.isReverse)}
							value={true}
						/>
						{"Switch"}
					</div>
					<ol>{moves}</ol>
				</div>
			</div>
		)
	}
}

function calculateWinner(squares) {
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

	for(let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}


// ==========
ReactDOM.render(
	<Game />,
	document.getElementById('root')
);