import React from 'react';
import PropTypes from 'prop-types';
// import moment from 'moment/moment';
// import { YMDFormat } from '../../constants/config';

const LevelId = ({ value }) => value ?? '';

const Custom = ({ value }) => value ?? '-';

const Status = ({ value }) => value ?? '-';

const Icon = ({ value }) =>
	value ? (
		<img
			style={{ maxWidth: '50px' }}
			alt="icon"
			src={`${value}?date=${new Date()}`}
		/>
	) : (
		'-'
	);
Icon.propTypes = { value: PropTypes.string };
Icon.defaultProps = { value: '' };

export { LevelId, Custom, Status, Icon };
