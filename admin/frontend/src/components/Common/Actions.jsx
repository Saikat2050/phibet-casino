import React from 'react';
import PropTypes from 'prop-types';
import {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	UncontrolledDropdown,
} from 'reactstrap';

const Actions = ({
	cell,
	actionsList,
	label = 'Actions',
	disabled = false,
}) => (
	<UncontrolledDropdown className="me-2" direction="end">
		<DropdownToggle
			className={`btn btn-primary ${disabled ? 'disabled-actions' : ''}`}
			color=""
			type="button"
			style={{
				width: '95px',
				pointerEvents: disabled ? 'none' : 'auto',
				opacity: disabled ? 0.5 : 1,
			}}
		>
			{label} <i className="mdi mdi-chevron-down" />
		</DropdownToggle>
		{!disabled && (
			<DropdownMenu style={{ right: '-100% !important' }}>
				{actionsList?.map(
					({
						actionName,
						actionHandler,
						isHidden,
						icon,
						iconColor,
						isDisabled = () => null,
					}) =>
						!isHidden && (
							<DropdownItem
								disabled={isDisabled(cell?.row?.original)}
								onClick={() => actionHandler(cell?.row?.original)}
							>
								{icon && <i className={`${icon} ${iconColor} me-2`} />}
								{actionName}
							</DropdownItem>
						)
				)}
			</DropdownMenu>
		)}
	</UncontrolledDropdown>
);

Actions.propTypes = {
	cell: PropTypes.shape({
		value: PropTypes.string.isRequired,
		row: PropTypes.shape({
			original: PropTypes.shape({
				id: PropTypes.string.isRequired,
				isActive: PropTypes.bool.isRequired,
			}).isRequired,
		}).isRequired,
	}).isRequired,
	actionsList: PropTypes.arrayOf().isRequired,
	label: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
};

Actions.defaultProps = {
	disabled: false,
};

export default Actions;
