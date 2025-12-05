import moment from 'moment/moment';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { UncontrolledTooltip } from 'reactstrap';
import { YMDFormat } from '../../constants/config';

const WithdrawalId = ({ value }) => value ?? '';

const Date = ({ value }) => (value ? moment(value).format(YMDFormat) : '-');

const Custom = ({ value }) => value ?? '-';

const Status = ({ value }) => value ?? '-';

const UserId = ({ cell }) => (
	<>
		<div className="text-ellipsis" id={`username-${cell?.row?.original?.id}`}>
			{cell.value ? (
				<Link to={`/player-details/${cell.value}`}>{cell.value}</Link>
			) : (
				''
			)}
		</div>
		<UncontrolledTooltip
			placement="top"
			target={`username-${cell?.row?.original?.id}`}
		>
			{cell.value || '-'}
		</UncontrolledTooltip>
	</>
);

UserId.propTypes = {
	cell: PropTypes.shape({
		value: PropTypes.string.isRequired,
		row: PropTypes.shape({
			original: PropTypes.shape({
				id: PropTypes.string.isRequired,
			}).isRequired,
		}).isRequired,
	}).isRequired,
};

export { WithdrawalId, Date, Custom, Status, UserId };
