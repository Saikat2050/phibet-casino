/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { UncontrolledTooltip, Button, Badge } from 'reactstrap';
import ImageCell from '../../components/Common/ImageCell';
import usePermission from '../../components/Common/Hooks/usePermission';

import { modules } from '../../constants/permissions';
import { getDateTimeWithAMPM } from '../../utils/dateFormatter';
import { TOURNAMENT_STATUS } from './constants';

const Id = ({ value }) => value ?? '';

const Name = ({ value }) => value ?? '';

const TournamentPeriod = ({ value }) => value ?? '';

const Date = ({ value }) => getDateTimeWithAMPM(value);

const Status = ({ value }) =>
	value ?? '' ? (
		<span className="text-success">Active</span>
	) : (
		<span className="text-danger">In Active</span>
	);

const PoolPrize = ({ value }) => (value ? `${value}` : '');

const StatusBadge = ({ value, className }) =>
	value ? (
		<Badge color={TOURNAMENT_STATUS?.[value]?.color} className={className}>
			{TOURNAMENT_STATUS?.[value]?.title}
		</Badge>
	) : (
		<Badge color="warning">-</Badge>
	);

const NonSettled = ({ cell, setShowSettleModal }) => {
	const status = cell?.row?.original?.status;
	const isSettled = status === 'settled';
	const isCancelled = status === 'cancelled';
	const { isGranted } = usePermission();
	return (
		<ul className="list-unstyled hstack gap-1 mb-0">
			<li id={`settled-${cell?.row?.original?.id}`}>
				<Button
					type="button"
					hidden={!isGranted(modules.tournamentManagement, 'R')}
					className={`btn btn-sm ${
						isSettled ? 'btn-soft-success' : 'btn-soft-primary'
					}`}
					disabled={isSettled || isCancelled}
					onClick={() => {
						!isSettled &&
							setShowSettleModal((prev) => ({
								...prev,
								isOpen: true,
								selectedTournament: cell?.row?.original?.id,
							}));
					}}
				>
					<i className="fas fa-file-signature" />
					<UncontrolledTooltip
						placement="top"
						target={`settled-${cell?.row?.original?.id}`}
					>
						{isCancelled
							? 'Tournament Cancelled'
							: isSettled
							? 'Already Settled'
							: 'Settle'}
					</UncontrolledTooltip>
				</Button>
			</li>
		</ul>
	);
};

const Image = ({ value }) => <ImageCell imgSrc={value} />;

export {
	Id,
	Name,
	TournamentPeriod,
	Image,
	Date,
	NonSettled,
	Status,
	PoolPrize,
	StatusBadge,
};

Image.propTypes = {
	value: PropTypes.objectOf.isRequired,
};

NonSettled.propTypes = {
	cell: PropTypes.objectOf.isRequired,
	setShowSettleModal: PropTypes.func.isRequired,
};

Status.propTypes = {
	value: PropTypes.string.isRequired,
};
