import React from "react";
import { Carousel } from "./carousel.js";
import "./style.css";

export class Menu extends React.Component {
	constructor(props) {
		super(props);
		this.state = { gameIndex: this.props.gameIndex };
	}
	render() {
		return (
			<div id="menu">
				<Carousel
					images={this.props.images}
					updateGameIndex={(gameIndex) =>
						this.setState({ gameIndex })
					}
					viewIndex={this.state.gameIndex}
				/>
				<div id="nav-buttons">
					<button
						className="play"
						onClick={() =>
							this.props.displayGame(this.state.gameIndex)
						}
					>
						Play
					</button>
					<button className="scores">Scores</button>
				</div>
			</div>
		);
	}
}
