import React from "react";
import ReactDOM from "react-dom";

import "./style.css";

import { Menu } from "./menu/index.js";
import { Game } from "./game/index.js";
import { Scores, ScoreSubmission } from "./scores/index.js";

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
		this.displayScores = this.displayScores.bind(this);
		this.endGame = this.endGame.bind(this);
	}

	render() {
		const display = this.state.display;
		const gameIndex = this.state.gameIndex;
		const score = this.state.score;
		return (
			<div id="app">
				{display === "menu" ? (
					<Menu
						images={gameImages}
						displayGame={this.displayGame}
						displayScores={this.displayScores}
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
					<Scores
						displayMenu={this.displayMenu}
						images={gameImages}
					/>
				) : (
					<div id="loading-image" onClick={this.displayMenu}></div>
				)}
				{score ? (
					<ScoreSubmission
						score={score}
						displayScores={this.displayScores}
						gameId={gameIndex}
					/>
				) : null}
				<div id="credits">
					Based on{" "}
					<a
						target="_blank"
						rel="noopener noreferrer"
						href="https://www.amazon.com/Hands-High-Unofficial-Finding-Adventure/dp/0995578095"
					>
						Hands High
					</a>{" "}
					by Sugoi Books.
				</div>
			</div>
		);
	}

	endGame(victory) {
		if (victory) {
			const score = Date.now() - this.startTime;
			this.setState({ score });
		} else {
			this.displayMenu();
		}
	}

	displayGame(gameIndex) {
		this.startTime = Date.now();
		this.setState({ display: "game", gameIndex });
	}

	displayMenu() {
		this.setState({ display: "menu", score: null });
	}

	displayScores() {
		this.setState({ display: "scores", score: null });
	}
}

// ========================================

ReactDOM.render(<App />, document.getElementById("root"));
