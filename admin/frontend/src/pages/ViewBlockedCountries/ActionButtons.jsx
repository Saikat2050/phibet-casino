/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ActionButtons = ({ row: { original }, handleStatus, type }) => {
	const id = original?.id;

	return (
		<ul className="list-unstyled hstack gap-1 mb-0">
			<li>
				<Link
					to="#"
					className={
						type === 'remove'
							? 'btn btn-sm btn-soft-danger'
							: 'btn btn-sm btn-soft-success'
					}
					onClick={(e) => {
						e.preventDefault();
						handleStatus(original);
					}}
				>
					<i
						className={
							type === 'remove' ? 'mdi mdi-minus-thick' : 'mdi mdi-plus-thick'
						}
						id={`inactivetooltip-${id}`}
					/>
					<UncontrolledTooltip placement="top" target={`inactivetooltip-${id}`}>
						Add This Country
					</UncontrolledTooltip>
				</Link>
			</li>
		</ul>
	);
};

ActionButtons.defaultProps = {
	type: '',
};

ActionButtons.propTypes = {
	handleStatus: PropTypes.func.isRequired,
	type: PropTypes.string,
	row: PropTypes.shape({
		original: PropTypes.shape({
			isActive: PropTypes.bool,
			id: PropTypes.number,
		}),
	}).isRequired,
};

export default ActionButtons;
