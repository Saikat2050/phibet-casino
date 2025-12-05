/* eslint-disable import/prefer-default-export */
import { countryFlag } from './countryFlag';

const filterWorker = (filter) => {
	const filterData = countryFlag.filter((item) => item.code === filter)[0];
	const countryImage = filterData?.image;
	const countryName = filterData?.name;

	return { countryImage, countryName };
};

const memoryHandler = (fWorker) => {
	const memory = {};
	return (...args) => {
		const exist = args[0];

		if (exist in memory) {
			return memory[exist];
		}
		const result = fWorker(exist);
		memory[exist] = result;
		return result;
	};
};

export const countryFilter = memoryHandler(filterWorker);
