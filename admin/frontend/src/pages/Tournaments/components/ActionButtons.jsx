/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { modules } from '../../../constants/permissions';

const ActionButtons = ({
	cell,
	handleEdit,
	handleView,
	setShowStatusModal,
	handleStatus,
}) => {
	const { isGranted } = usePermission();
	const id = cell?.row?.original?.id;
	const status = cell?.row?.original?.status;
	const isSettled = status === 'settled';
	const isCancelled = status === 'cancelled';
	const isRegistrationEnded = cell?.row?.original?.registrationEndDate
		? new Date(cell?.row?.original?.registrationEndDate).getTime() <
		  new Date().getTime()
		: false;
	const isActive = status === 'active';
	return (
		<ul className="list-unstyled hstack gap-1 mb-0">
			<li>
				{isActive ? (
					<Button
						hidden={!isGranted(modules.tournamentManagement, 'TS')}
						className="btn btn-sm btn-soft-danger"
						disabled={isSettled || isCancelled || isRegistrationEnded}
						onClick={(e) => handleStatus(e, id)}
					>
						<i className="mdi mdi-close-thick" id={`active-${id}`} />
						<UncontrolledTooltip placement="top" target={`active-${id}`}>
							Set Inactive
						</UncontrolledTooltip>
					</Button>
				) : (
					<Button
						hidden={!isGranted(modules.tournamentManagement, 'TS')}
						className="btn btn-sm btn-soft-success"
						disabled={isSettled || isCancelled || isRegistrationEnded}
						onClick={(e) => handleStatus(e, id)}
					>
						<i className="mdi mdi-check-circle" id={`active-${id}`} />
						<UncontrolledTooltip placement="top" target={`active-${id}`}>
							Set Active
						</UncontrolledTooltip>
					</Button>
				)}
			</li>
			<li id={`view-${id}`}>
				<Button
					type="button"
					hidden={!isGranted(modules.tournamentManagement, 'R')}
					className="btn btn-sm btn-soft-primary"
					onClick={(e) => {
						e.preventDefault();
						handleView(id);
					}}
				>
					<i className="mdi mdi-eye-outline" />
					<UncontrolledTooltip placement="top" target={`view-${id}`}>
						View
					</UncontrolledTooltip>
				</Button>
			</li>

			<li id={`edittooltip-${id}`}>
				<Button
					hidden={!isGranted(modules.tournamentManagement, 'U')}
					type="button"
					className="btn btn-sm btn-soft-info"
					disabled={isSettled || isCancelled || isRegistrationEnded}
					onClick={(e) => {
						e.preventDefault();
						handleEdit(id);
					}}
				>
					<i className="mdi mdi-pencil-outline" />
					<UncontrolledTooltip placement="top" target={`edittooltip-${id}`}>
						{isSettled
							? 'Tournament Settled'
							: isCancelled
							? 'Tournament Cancelled'
							: 'Edit'}
					</UncontrolledTooltip>
				</Button>
			</li>

			<li id={`status-${id}`}>
				<Button
					type="button"
					hidden={!isGranted(modules.tournamentManagement, 'T')}
					className={`btn btn-sm ${
						!isActive ? 'btn-soft-success' : 'btn-soft-danger'
					}`}
					disabled={isSettled || isCancelled || isRegistrationEnded}
					onClick={() => {
						setShowStatusModal((prev) => ({
							...prev,
							isOpen: true,
							selectedTournament: cell?.row?.original,
							type: 'statusToggle',
						}));
					}}
				>
					<i
						className={
							!isActive ? 'mdi mdi-check-circle' : 'mdi mdi-close-thick'
						}
					/>
					<UncontrolledTooltip placement="top" target={`status-${id}`}>
						{isSettled
							? 'Tournament Settled'
							: isCancelled
							? 'Tournament Cancelled'
							: !isActive
							? 'Set Visible'
							: 'Set Invisible'}
					</UncontrolledTooltip>
				</Button>
			</li>

			<li id={`cancel-${id}`}>
				<Button
					type="button"
					hidden={!isGranted(modules.tournamentManagement, 'U')}
					className="btn btn-sm btn-soft-danger"
					disabled={isSettled || isCancelled}
					onClick={() => {
						setShowStatusModal((prev) => ({
							...prev,
							isOpen: true,
							selectedTournament: cell?.row?.original,
						}));
					}}
				>
					<i className="mdi mdi-cancel" />
					<UncontrolledTooltip placement="top" target={`cancel-${id}`}>
						{isSettled
							? 'Tournament Settled'
							: isCancelled
							? 'Tournament Already Cancelled'
							: 'Cancel Tournament'}
					</UncontrolledTooltip>
				</Button>
			</li>
		</ul>
	);
};

export default ActionButtons;
