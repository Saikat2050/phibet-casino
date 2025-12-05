/* eslint-disable react/prop-types */

const bonusTypes = {
	vipTierMonthlyBonus: 'VIP Tier Monthly Bonus',
	vipTierWeeklyBonus: 'VIP Tier Weekly Bonus',
	purchaseBonus: 'Purchase Bonus',
	spinWheelBonus: 'Spin Wheel Bonus',
	joiningBonus: 'Joining Bonus',
	dailyBonus: 'Daily Bonus'
}

const KeyValueData = ({ value }) => value ?? 0;

const Type = ({ cell }) => {
	return bonusTypes[cell.value]
}

export { KeyValueData, Type };
