/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const KYCActionButtons = ({ cell, handleStatus }) => {
	const status = cell?.row?.original?.status;
	const userDocumentId = cell?.row?.original?.userDocumentId;
	const documentLabelId = cell?.row?.original?.documentLabelId;

	return (
		status !== 1 && (
			<ul className="list-unstyled hstack gap-1 mb-0">
				<li>
					<Link
						to="#"
						className="btn btn-sm btn-soft-success"
						onClick={(e) => {
							e.preventDefault();
							handleStatus({ userDocumentId, status: 'approved' });
						}}
					>
						<i
							className="mdi mdi-check-circle"
							id={`inactivetooltip-${documentLabelId}`}
						/>
						<UncontrolledTooltip
							placement="top"
							target={`inactivetooltip-${documentLabelId}`}
						>
							Accept
						</UncontrolledTooltip>
					</Link>
				</li>
				<li>
					<Link
						to="#"
						className="btn btn-sm btn-soft-danger"
						onClick={(e) => {
							e.preventDefault();
							handleStatus({ userDocumentId, status: 'rejected' });
						}}
					>
						<i
							className="mdi mdi-close-thick"
							id={`activetooltip-${documentLabelId}`}
						/>
						<UncontrolledTooltip
							placement="top"
							target={`activetooltip-${documentLabelId}`}
						>
							Reject
						</UncontrolledTooltip>
					</Link>
				</li>
			</ul>
		)
	);
};

KYCActionButtons.propTypes = {
	handleStatus: PropTypes.func.isRequired,
	cell: PropTypes.objectOf.isRequired,
};

export default KYCActionButtons;
