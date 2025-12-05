import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { UncontrolledTooltip } from 'reactstrap';
import { modules } from '../../constants/permissions';
import usePermission from '../../components/Common/Hooks/usePermission';

const KeyValueData = ({ value, defaultCurrency }) =>
	defaultCurrency ? `${defaultCurrency.symbol} ${value}` : value;

const PlayerPNL = ({ value, defaultCurrency }) => {
	const colorValue = value < 0 ? 'red' : 'green';
	return (
		<span style={{ color: colorValue }}>
			{defaultCurrency ? `${defaultCurrency.symbol} ${value}` : value}
		</span>
	);
};

PlayerPNL.propTypes = {
	value: PropTypes.string.isRequired,
	defaultCurrency: PropTypes.isRequired,
};

const Email = ({ cell }) => {
	const userId = cell?.row?.original?.userId;
	const { isGranted } = usePermission();
	return isGranted(modules.player, 'R') && userId ? (
		<>
			<Link to={`/player-details/${userId}`} id={`email-${userId}`}>
				{cell?.value}
			</Link>
			<UncontrolledTooltip placement="top" target={`email-${userId}`}>
				{cell?.value}
			</UncontrolledTooltip>
		</>
	) : (
		cell?.value || ''
	);
};

Email.propTypes = {
	cell: PropTypes.shape({
		value: PropTypes.string.isRequired,
		row: PropTypes.shape({
			original: PropTypes.shape({
				userId: PropTypes.string.isRequired,
			}).isRequired,
		}).isRequired,
	}).isRequired,
};

export { KeyValueData, PlayerPNL, Email };
