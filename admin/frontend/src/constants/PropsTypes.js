import PropTypes, { oneOfType } from 'prop-types';

const validationType = PropTypes.objectOf(
	oneOfType([
		PropTypes.object,
		PropTypes.func,
		PropTypes.bool,
		PropTypes.number,
		PropTypes.string,
	])
);

const cellType = PropTypes.shape({
	value: PropTypes.string,
	row: PropTypes.shape({
		original: PropTypes.shape({
			adminUserId: PropTypes.string,
		}),
	}),
});

export { validationType, cellType };
