// import { userLimitTypes } from '../../../utils/constant';

const useEditLimits = ({ userDetails }) => {
	const { userLimits } = userDetails || [];

	// const findLimitValue = (key) => {
	// 	const limit = userLimits?.find((limits) => limits.key === key);
	// 	return limit?.value ? limit?.value : 0;
	// };

	// const limitLabels = [
	// 	{
	// 		label: 'Daily Wager Limit',
	// 		key: userLimitTypes.dailyBetLimit,
	// 		value: findLimitValue(userLimitTypes.dailyBetLimit),
	// 		minimum: 0,
	// 	},
	// 	{
	// 		label: 'Weekly Wager Limit',
	// 		key: userLimitTypes.weeklyBetLimit,
	// 		value: findLimitValue(userLimitTypes.weeklyBetLimit),
	// 		minimum: findLimitValue(userLimitTypes.dailyBetLimit),
	// 	},
	// 	{
	// 		label: 'Monthly Wager Limit',
	// 		key: userLimitTypes.monthlyBetLimit,
	// 		value: findLimitValue(userLimitTypes.monthlyBetLimit),
	// 		minimum: findLimitValue(userLimitTypes.weeklyBetLimit),
	// 	},
	// 	{
	// 		label: 'Daily Deposit Limit',
	// 		key: userLimitTypes.dailyDepositLimit,
	// 		value: findLimitValue(userLimitTypes.dailyDepositLimit),
	// 		minimum: 0,
	// 	},
	// 	{
	// 		label: 'Weekly Deposit Limit',
	// 		key: userLimitTypes.weeklyDepositLimit,
	// 		value: findLimitValue(userLimitTypes.weeklyDepositLimit),
	// 		minimum: findLimitValue(userLimitTypes.dailyDepositLimit),
	// 	},
	// 	{
	// 		label: 'Monthly Deposit Limit',
	// 		key: userLimitTypes.monthlyDepositLimit,
	// 		value: findLimitValue(userLimitTypes.monthlyDepositLimit),
	// 		minimum: findLimitValue(userLimitTypes.weeklyDepositLimit),
	// 	},
	// 	{
	// 		label: 'Daily Loss Limit',
	// 		key: userLimitTypes.dailyLossLimit,
	// 		value: findLimitValue(userLimitTypes.dailyLossLimit),
	// 		minimum: 0,
	// 	},
	// 	{
	// 		label: 'Weekly Loss Limit',
	// 		key: userLimitTypes.weeklyLossLimit,
	// 		value: findLimitValue(userLimitTypes.weeklyLossLimit),
	// 		minimum: findLimitValue(userLimitTypes.dailyLossLimit),
	// 	},
	// 	{
	// 		label: 'Monthly Loss Limit',
	// 		key: userLimitTypes.monthlyLossLimit,
	// 		value: findLimitValue(userLimitTypes.monthlyLossLimit),
	// 		minimum: findLimitValue(userLimitTypes.weeklyLossLimit),
	// 	},
	// ];

	return {
		userLimits,
	};
};

export default useEditLimits;
