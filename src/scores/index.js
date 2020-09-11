import React from "react";

import "./style.css";

const serverURL = "http://localhost:5001/finding-beyonce/us-central1/";

export class Scores extends React.Component {
	constructor(props) {
		super(props);

		const scores = {};
		this.state = { scores, imgId: 0 };
		this.props.images.forEach((...[, i]) => (scores[i] = []));

		this.renderScore = this.renderScore.bind(this);
		this.renderImgSelect = this.renderImgSelect.bind(this);
		this.getScores = this.getScores.bind(this);

		this.getScores(0);
	}

	render() {
		const backgroundImg = this.props.images[this.state.imgId];
		return (
			<div id="scores">
				<div className="img-select-menu">
					{this.props.images.map(this.renderImgSelect)}
				</div>
				<button className="back" onClick={this.props.displayMenu} />
				<div className="score-list-container">
					<img
						className="score-list-background"
						src={backgroundImg}
						alt=""
					/>
					<div className="score-list">
						{this.state.scores[this.state.imgId].map(
							this.renderScore
						)}
					</div>
				</div>
			</div>
		);
	}

	renderScore(scoreObj) {
		const playerId = scoreObj.playerId.match(/^user_anon/)
			? "Anonymous"
			: scoreObj.playerId;
		return (
			<div className="score-listing" key={scoreObj.playerId}>
				<span className="name">{playerId}</span>
				<span className="score">{scoreObj.score}</span>
			</div>
		);
	}

	renderImgSelect(img, imgId) {
		return (
			<img
				key={`img-${img}`}
				className="img-select"
				src={img}
				alt=""
				onClick={() => {
					this.getScores(imgId);
					this.setState({ imgId });
				}}
			/>
		);
	}

	async getScores(imgId) {
		const newScores = await getImgScores(imgId);
		const scores = Object.assign(this.state.scores, { [imgId]: newScores });
		this.setState({ scores });
	}
}

export class ScoreSubmission extends React.Component {
	constructor(props) {
		super(props);

		this.state = { badName: false, usedName: false };

		this.setPlayerId = this.setPlayerId.bind(this);
		this.submitScore = this.submitScore.bind(this);

		this.printedScore = Math.floor(this.props.score / 10) / 100;
	}
	render() {
		return (
			<div id="score-submission">
				<div className="form-container">
					<div className="score-report">
						Time:{" "}
						<span className="printed-score">
							{this.printedScore}
						</span>
					</div>
					{this.state.usedName ? (
						<div className="name-error">
							A score has already been registered for that name.
						</div>
					) : this.state.badName ? (
						<div className="name-error">
							Please only use letters and numbers.
						</div>
					) : null}
					<input
						className="name-input"
						type="text"
						placeholder="Enter your name."
						onChange={this.setPlayerId}
					/>
					<button className="submit" onClick={this.submitScore}>
						Submit
					</button>
				</div>
			</div>
		);
	}

	setPlayerId(event) {
		this.setState({ playerId: event.target.value });
	}

	async submitScore() {
		const playerId = this.state.playerId || "";
		if (!playerId.match(/^\w*$/)) {
			this.setState({ badName: true });
			return;
		}
		const submission = await logScore(
			this.printedScore,
			this.props.gameId,
			playerId
		);
		if (!submission) {
			this.setState({ usedName: true });
			return;
		}
		this.props.displayScores();
	}
}

async function getIP() {
	const result = await fetch("http://gd.geobytes.com/GetCityDetails");
	const data = await result.json();
	return data.geobytesipaddress;
}

async function logScore(score, imgId, playerId) {
	if (!playerId) {
		const ip = 7;
		playerId = `user_anon#${ip}`;
	}
	const query = `?score=${score}&imgId=${imgId}&playerId=${playerId}`;
	const result = await fetch(serverURL + "registerScore" + query);
	const data = await result.json();
	return data;
}

async function getImgScores(imgId) {
	const query = `?imgId=${imgId}`;
	const result = await fetch(serverURL + "getImgScores" + query);
	const data = await result.json();
	return data.sort(sortScores);
}

function sortScores({score: scoreA}, {score: scoreB}) {
	return scoreA < scoreB ? -1 : scoreA > scoreB ? 1 : 0;
}
