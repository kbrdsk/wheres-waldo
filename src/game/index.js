import React from "react";
import "./style.css";

export class Game extends React.Component {
	constructor(props) {
		super(props);

		this.state = { menu: false, foundCharacters: [] };

		this.toggleMenu = this.toggleMenu.bind(this);
		this.guess = this.guess.bind(this);
		this.renderSelectButton = this.renderSelectButton.bind(this);
		this.renderMenu = this.renderMenu.bind(this);
		this.showMenu = this.showMenu.bind(this);
		this.handleCorrectGuess = this.handleCorrectGuess.bind(this);
		this.handleIncorrectGuess = this.handleIncorrectGuess.bind(this);
		this.clearGuessResult = this.clearGuessResult.bind(this);
	}

	render() {
		return (
			<div id="game">
				<button
					className="back"
					onClick={() => this.props.endGame()}
				></button>
				<img
					src={this.props.image}
					alt=""
					onMouseDown={this.toggleMenu}
					onMouseUp={this.showMenu}
				/>
				{this.state.menu ? this.renderMenu() : null}
				{this.renderGuessResult()}
			</div>
		);
	}

	toggleMenu(event) {
		this.clearGuessResult();
		event.persist();
		const menuRotation = Math.random() * Math.PI;
		const menu = !this.state.menu;
		this.setState({
			mouseClick: event,
			menu,
			menuRotation,
			showMenu: false,
		});
	}

	showMenu() {
		this.setState({ showMenu: true });
	}

	renderMenu() {
		const remainingCharacters = this.props.characters.filter(
			(character) => !this.state.foundCharacters.includes(character)
		);
		const location = {
			x: this.state.mouseClick.clientX,
			y: this.state.mouseClick.clientY,
		};
		const style = {
			position: "absolute",
			top: location.y,
			left: location.x,
		};
		return (
			<div className="menu" style={style}>
				{remainingCharacters.map(this.renderSelectButton)}
			</div>
		);
	}

	renderSelectButton(character, index) {
		const angle = ((index * 6) / 5) * Math.PI + this.state.menuRotation;
		const offset = {
			x: Math.cos(angle) * 6 - 3,
			y: Math.sin(angle) * 6 + 3,
		};
		const showStyle = {
			top: -offset.y.toString() + "em",
			right: offset.x.toString() + "em",
		};
		const hiddenStyle = {
			top: "0em",
			right: "0em",
		};
		return (
			<button
				className={!this.state.showMenu ? "hidden" : ""}
				key={character}
				style={!this.state.showMenu ? hiddenStyle : showStyle}
				onClick={() => this.guess(character)}
			>
				{character}
			</button>
		);
	}

	async guess(character) {
		const clickLoc = getRelativeLoc(this.state.mouseClick);
		const isCorrect = await checkGuess(
			this.props.id,
			character,
			clickLoc.x,
			clickLoc.y
		);
		if (isCorrect) this.handleCorrectGuess(character);
		else this.handleIncorrectGuess();
	}

	handleCorrectGuess(character) {
		this.setState({
			foundCharacters: [...this.state.foundCharacters, character],
			menu: false,
			showMenu: false,
			guessResult: "correct",
		});
		if (this.state.foundCharacters.length === this.props.characters.length)
			this.props.endGame(true);
	}

	handleIncorrectGuess() {
		this.setState({
			menu: false,
			showMenu: false,
			guessResult: "incorrect",
		});
	}

	renderGuessResult() {
		const result = this.state.guessResult;
		if (!result) return null;
		if(!this.resultTimer){
			this.resultTimer = setTimeout(this.clearGuessResult, 3000)
		}
		const location = {
			x: this.state.mouseClick.clientX,
			y: this.state.mouseClick.clientY,
		};
		const style = {
			position: "absolute",
			top: location.y,
			left: location.x,
		};
		return <div style={style} className={`guess-result ${result}`}></div>;
	}

	clearGuessResult(){
		clearTimeout(this.resultTimer);
		this.resultTimer = null;
		this.setState({guessResult: null});
	}

	componentWillUnmount(){
		this.clearGuessResult();
	}
}

function getRelativeLoc(event) {
	const bounds = event.target.getBoundingClientRect();
	const x =
		(100 * (event.pageX - (bounds.x + window.scrollX))) / bounds.width;
	const y =
		(100 * (event.pageY - (bounds.y + window.scrollY))) / bounds.height;
	return { x, y };
}

async function checkGuess(id, character, x, y) {
	const serverURL = "http://localhost:5001/finding-beyonce/us-central1/";
	const query = `?puzzleId=${id}&character=${character}&x=${x}&y=${y}`;
	const result = await fetch(serverURL + "replyToGuess" + query);
	const data = await result.json();
	return data;
}
