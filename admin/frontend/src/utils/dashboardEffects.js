/* eslint-disable consistent-return */
export const getTextColor = (str) => {
	if (typeof str === 'string') {
		const ch = str.charAt(0);
		if (ch === '-') return 'text-danger';
		return 'green-text';
	}
	if (str >= 0) return 'green-text';
	return 'text-danger';
};

export const getPercentageColor = (str) => {
	if (typeof str === 'string') {
		if (Number(str.split(' ')[0]) > 100) {
			return 'text-danger';
		}
		return 'green-text';
	}
};
