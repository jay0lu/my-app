import React from 'react';
import ReactDOM from 'react-dom';
import Switch from '@material-ui/core/Switch';
import './index.css';

const LINES = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

const LOCATION = [
	"1 | 1",
	"2 | 1",
	"3 | 1",
	"1 | 2",
	"2 | 2",
	"3 | 2",
	"1 | 3",
	"2 | 3",
	"3 | 3"
]

function Square(props){
	let boldSquare = props.bold;
	let bold = {
		color: "green"
	}
	let buttonStyle = boldSquare ? bold : null;
	return (
		<button
			style={buttonStyle}
			className="square"
			onClick={props.onClick}
		>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i, bold) {
		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
				bold={bold}
			/>
		);
	}

	render() {
		const line = this.props.line;
		let grid = [];
		for(let i = 0; i < 3; i++) {
			let bordRow = [];
			for(let j = 0; j < 3; j++) {
				let num = i * 3 + j;
				let bold = false;
				if( line && line.indexOf(num) >= 0) bold = true;
				bordRow.push(this.renderSquare(num, bold));
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
			isReverse: false,
			location: []
		}
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if(this.calculateWinner(squares) || this.calculateWinner(squares) === 0 || squares[i]) {
			return;
		}
		let location = this.state.location;
		location.push(LOCATION[i]);

		squares[i] = this.state.xIsNext ? "X" : "O";
		this.setState({
			history: history.concat([{
				squares: squares
			}]),
			location: location,
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

	calculateWinner(squares) {
		for(let i = 0; i < LINES.length; i++) {
			const [a, b, c] = LINES[i];
			if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
				return i;
			}
		}
		return null;
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = this.calculateWinner(current.squares);
		let isReverse = this.state.isReverse;
		const winLine = LINES[winner];
		let draw = false;

		const moves = history.map((step, move) => {
			const desc = move ? "Go to move #" + move + " - " + this.state.location[move - 1]: "Go to game start";
			let moveButton = "idel";
			if(this.state.selectedMove === move) {
				moveButton = "active";
			}
			if(move === 9 && !winner && winner !== 0) draw = true;
			return (
				<li key={move + isReverse}>
					<button className={moveButton} onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			)
		})


		let toggleTitle = isReverse ? "Descending" : "Ascending";
		let reverseMove = moves.slice();
		reverseMove.reverse();
		let finalMoves = isReverse ? reverseMove : moves;

		let status;
		if(winner || winner === 0) {
			status = "Winner: " + current.squares[LINES[winner][0]];
		}else if (!draw) {
			status = "Next player: " + (this.state.xIsNext ? "X" : "O");
		}else {
			status = "Resule: Draw"
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={i => this.handleClick(i)}
						line={winLine}
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
						{toggleTitle}
					</div>
					<ol>{finalMoves}</ol>
				</div>
			</div>
		)
	}
}


// ==========
ReactDOM.render(
	<Game />,
	document.getElementById('root')
);