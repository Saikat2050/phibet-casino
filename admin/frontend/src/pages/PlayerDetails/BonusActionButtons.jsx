/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const BonusActionButtons = ({ cell, onViewClick, onCancelClick }) => (
	<ul className="list-unstyled hstack gap-1 mb-0">
		<li>
			<Link
				to="#"
				className="btn btn-sm btn-soft-primary"
				onClick={(e) => {
					e.preventDefault();
					onViewClick({
						bonusDetails: cell?.row?.original,
					});
				}}
			>
				<i className="mdi mdi-eye-outline" id="inactivetooltip" />
				<UncontrolledTooltip placement="top" target="inactivetooltip">
					View
				</UncontrolledTooltip>
			</Link>
		</li>
		<li>
			<Link
				to="#"
				className="btn btn-sm btn-soft-danger"
				onClick={(e) => {
					e.preventDefault();
					onCancelClick({
						userBonusId: cell?.row?.original?.userBonusId,
					});
				}}
			>
				<i className="mdi mdi-close-thick" id="activetooltip" />
				<UncontrolledTooltip placement="top" target="activetooltip">
					Cancel Bonus
				</UncontrolledTooltip>
			</Link>
		</li>
	</ul>
);

BonusActionButtons.propTypes = {
	onViewClick: PropTypes.func.isRequired,
	onCancelClick: PropTypes.func.isRequired,
	cell: PropTypes.objectOf.isRequired,
};

export default BonusActionButtons;
