import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'reactstrap';
import { Link } from 'react-router-dom';
import moment from 'moment/moment';
import { YMDFormat, selectedLanguage } from '../../constants/config';
import { bonusLabel } from './constants';

const BonusId = ({ value }) => (
	<Link to="/" className="text-body fw-bold">
		{value ?? ''}
	</Link>
);
const Title = ({ value }) => value[selectedLanguage] ?? '-';

const BonusType = ({ value }) => bonusLabel[value] ?? '-';

const Date = ({ value }) => (value ? moment(value).format(YMDFormat) : '-');

const Custom = ({ value }) => value ?? '-';

const IsClaimed = ({ value }) => value ?? '-';

const Status = ({ value }) =>
	value ? (
		<Badge className="bg-success">Active</Badge>
	) : (
		<Badge className="bg-danger">In Active</Badge>
	);

BonusId.propTypes = {
	value: PropTypes.number.isRequired,
};

Status.propTypes = {
	value: PropTypes.bool.isRequired,
};

export { BonusId, Title, BonusType, Date, Custom, IsClaimed, Status };
