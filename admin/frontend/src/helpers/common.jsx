const Colors = {
	primaryBlue: '#2f06e9',
};

const colorOptions = [
	'bg-secondary',
	'bg-primary',
	'bg-danger',
	'bg-warning',
	'bg-info',
	'bg-success',
];

let lastColor = null;

const getRandomColor = () => {
	let randomColor;

	do {
		const randomIndex = Math.floor(Math.random() * colorOptions.length);
		randomColor = colorOptions[randomIndex];
	} while (randomColor === lastColor);
	lastColor = randomColor;
	return randomColor;
};

const getSyncColor = (idx) => {
	const conertedIndex = idx % 10;
	const syncColor = colorOptions?.[conertedIndex]
		? colorOptions?.[conertedIndex]
		: colorOptions?.[conertedIndex - 5];
	return syncColor;
};

const downloadReport = (type, data, CSVFileName = 'downloaded_data') => {
	const blob = new Blob([data], { type: `application/${type}` });
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = `${CSVFileName}.${type}`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};

const capitalizeFirstLetter = (text) => {
	if (!text) return '';
	return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export {
	getRandomColor,
	Colors,
	getSyncColor,
	downloadReport,
	capitalizeFirstLetter,
};
