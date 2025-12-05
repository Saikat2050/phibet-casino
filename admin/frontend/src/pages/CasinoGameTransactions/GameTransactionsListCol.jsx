const IdValue = ({ cell }) => cell;

const Name = ({ cell }) => cell;

const NUMBEROFROUNDS = ({ cell }) => cell || 0;

const NumberPlayer = ({ cell }) => cell || 0;

const TotalBetsAmount = ({ cell }) => `${cell ?? 0}`;

const TotalWins = ({ cell }) => `${cell ?? 0}`;
const GameRevenue = ({ cell }) => `${cell ?? 0}`;
const Payout = ({ cell }) => `${cell ?? 0} %`;

export {
	IdValue,
	Name,
	NUMBEROFROUNDS,
	NumberPlayer,
	TotalBetsAmount,
	TotalWins,
	GameRevenue,
	Payout,
};
