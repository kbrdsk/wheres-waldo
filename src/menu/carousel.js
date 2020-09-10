import React from "react";

const carouselPositions = ["dblPrev", "prev", "view", "next", "dblNext"];

export class Carousel extends React.Component {
	constructor(props) {
		super(props);
		this.images = this.props.images;
		this.state = {
			timer: 0,
			viewIndex: this.props.viewIndex,
			carouselFocus: 0,
		};

		this.createCarouselWindow = this.createCarouselWindow.bind(this);
		this.createQuickNavButton = this.createQuickNavButton.bind(this);
		this.advanceCarousel = this.advanceCarousel.bind(this);
		this.regressCarousel = this.regressCarousel.bind(this);
		this.updateTimer = this.updateTimer.bind(this);

		this.timerId = setInterval(this.updateTimer, 1000);
	}

	render() {
		return (
			<div className="carousel-container">
				{Array(5).fill(null).map(this.createCarouselWindow)}
				<div
					className="advance-button nav-button"
					onClick={this.advanceCarousel}
				></div>
				<div
					className="regress-button nav-button"
					onClick={this.regressCarousel}
				></div>
				<div className="quick-nav-container">
					{this.images.map(this.createQuickNavButton)}
				</div>
			</div>
		);
	}

	createCarouselWindow(...[, index]) {
		const viewIndex = this.state.viewIndex;
		const focus = this.state.carouselFocus;
		const relativeIndex = mod(index - focus + 2, 5) - 2;
		const imageIndex = mod(viewIndex + relativeIndex, this.images.length);
		return (
			<div
				key={`carouselWindow${index}`}
				className="carousel-window"
				carousel-position={carouselPositions[relativeIndex + 2]}
				style={{ backgroundImage: `url(${this.images[imageIndex]})` }}
			></div>
		);
	}

	createQuickNavButton(...[, index]) {
		return (
			<div
				className="quick-nav-button"
				key={`quicknav${index}`}
				onClick={() => {
					this.props.updateGameIndex(index);
					this.setState({ viewIndex: index, timer: 0 });
				}}
				highlighted={(this.state.viewIndex === index).toString()}
			></div>
		);
	}

	advanceCarousel() {
		let { viewIndex, carouselFocus } = this.state;
		viewIndex = mod(viewIndex + 1, this.images.length);
		carouselFocus = mod(carouselFocus + 1, 5);
		this.props.updateGameIndex(viewIndex);
		this.setState({ viewIndex, carouselFocus, timer: 0 });
	}

	regressCarousel() {
		let { viewIndex, carouselFocus } = this.state;
		viewIndex = mod(viewIndex - 1, this.images.length);
		carouselFocus = mod(carouselFocus - 1, 5);
		this.props.updateGameIndex(viewIndex);
		this.setState({ viewIndex, carouselFocus, timer: 0 });
	}

	updateTimer() {
		this.setState({ timer: this.state.timer + 1 });
		if (this.state.timer === 8) {
			this.advanceCarousel();
		}
	}

	componentWillUnmount() {
		clearInterval(this.timerId);
	}
}

function mod(n, m) {
	return ((n % m) + m) % m;
}
