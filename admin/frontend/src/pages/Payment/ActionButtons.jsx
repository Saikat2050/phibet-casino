import React from 'react';
import { UncontrolledTooltip, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import usePermission from '../../components/Common/Hooks/usePermission';
import { modules } from '../../constants/permissions';

const ActionButtons = ({ row, handleView, handleEdit }) => {
	// const active = row?.original?.isActive;
	const paymentId = row?.original?.id;
	// const isSuperAdmin = row?.original?.adminRole?.level === 1;
	const { isGranted } = usePermission();

	return (
		<ul className="list-unstyled hstack gap-1 mb-0">
			{isGranted(modules.paymentManagement, 'R') && (
				<li data-bs-toggle="tooltip" data-bs-placement="top">
					<Button
						className="btn btn-sm btn-soft-primary"
						onClick={(e) => handleView(e, row?.original)}
					>
						<i
							className="mdi mdi-eye-outline"
							id={`view-tooltip-${paymentId}`}
						/>
						<UncontrolledTooltip
							placement="top"
							target={`view-tooltip-${paymentId}`}
						>
							View Details
						</UncontrolledTooltip>
					</Button>
				</li>
			)}
			{/* {isGranted(modules.paymentManagement, 'TS') && (
				<li>
					{active ? (
						<Button
							className="btn btn-sm btn-soft-danger"
							onClick={(e) =>
								handleStatus(e, {
									active,
									paymentId,
								})
							}
						>
							<i
								className="mdi mdi-close-thick"
								id={`active-tooltip-${paymentId}`}
							/>
							<UncontrolledTooltip
								placement="top"
								target={`active-tooltip-${paymentId}`}
							>
								Set Inactive
							</UncontrolledTooltip>
						</Button>
					) : (
						<Button
							className="btn btn-sm btn-soft-success"
							onClick={(e) =>
								handleStatus(e, {
									active,
									paymentId,
								})
							}
						>
							<i
								className="mdi mdi-check-circle"
								id={`active-tooltip-${paymentId}`}
							/>
							<UncontrolledTooltip
								placement="top"
								target={`active-tooltip-${paymentId}`}
							>
								Set Active
							</UncontrolledTooltip>
						</Button>
					)}
				</li>
			)} */}

			{isGranted(modules.paymentManagement, 'U') && (
				<li>
					<Button
						className="btn btn-sm btn-soft-info"
						onClick={(e) => handleEdit(e, row?.original)}
					>
						<i
							className="mdi mdi-pencil-outline"
							id={`edit-tooltip-${paymentId}`}
						/>
						<UncontrolledTooltip
							placement="top"
							target={`edit-tooltip-${paymentId}`}
						>
							Edit Details
						</UncontrolledTooltip>
					</Button>
				</li>
			)}
		</ul>
	);
};

ActionButtons.propTypes = {
	handleEdit: PropTypes.func.isRequired,
	// handleStatus: PropTypes.func.isRequired,
	row: PropTypes.objectOf.isRequired,
	handleView: PropTypes.func.isRequired,
};

export default ActionButtons;
