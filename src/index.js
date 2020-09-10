import React from "react";
import ReactDOM from "react-dom";

import "./style.css";

import { Menu } from "./menu/index.js";
import { Game } from "./game/index.js";
import { Scores } from "./scores/index.js";

function importAll(r) {
	return r.keys().map(r);
}

const gameImages = importAll(
	require.context("./images/", false, /\d+\.(png|jpe?g|svg)$/)
);

const gameCharacters = [
	["Beyoncé", "Beyoncé's Queendom"],
	["Beyoncé", "Beyoncé's Queendom"],
	["Beyoncé", "Beyoncé's Queendom"],
	["Beyoncé", "Beyoncé's Queendom"],
	["Beyoncé", "Beyoncé's Queendom"],
	["Beyoncé", "Beyoncé's Queendom"],
	["Beyoncé", "Beyoncé's Queendom"],
];

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = { display: null, gameIndex: 0 };

		this.displayGame = this.displayGame.bind(this);
		this.displayMenu = this.displayMenu.bind(this);
		this.endGame = this.endGame.bind(this);
	}

	render() {
		const display = this.state.display;
		const gameIndex = this.state.gameIndex;
		return (
			<div id="app">
				{display === "menu" ? (
					<Menu
						images={gameImages}
						displayGame={this.displayGame}
						gameIndex={this.state.gameIndex}
					/>
				) : display === "game" ? (
					<Game
						image={gameImages[gameIndex]}
						endGame={this.endGame}
						id={gameIndex}
						characters={gameCharacters[gameIndex]}
					/>
				) : display === "scores" ? (
					<Scores />
				) : (
					<div id="loading-image" onClick={this.displayMenu}></div>
				)}
			</div>
		);
	}

	endGame(time){
		if(time);
		this.displayMenu();
	}

	displayGame(gameIndex) {
		this.setState({ display: "game", gameIndex });
	}

	displayMenu() {
		this.setState({ display: "menu" });
	}
}

// ========================================

ReactDOM.render(<App />, document.getElementById("root"));
