/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types */
import React from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import usePermission from './Hooks/usePermission';

const ButtonList = ({ buttonList }) => {
	const { isGranted } = usePermission();

	return buttonList.map(
		({
			handleClick,
			label,
			module,
			operation,
			tooltip,
			icon,
			isHide,
			disabled,
		}) =>
			!isHide && (
				<div className="flex-shrink-0" key={label}>
					<Button
						hidden={!isGranted(module, operation)}
						onClick={disabled ? null : handleClick}
						className={`${
							disabled ? 'disabled' : ''
						} btn btn-light btn-outline-primary ${
							icon ? 'icon-button-padding' : ''
						}`}
						id={`id-${label}`}
					>
						{icon}
						{label}
					</Button>
					{tooltip && (
						<UncontrolledTooltip placement="top" target={`id-${label}`}>
							{tooltip}
						</UncontrolledTooltip>
					)}
				</div>
			)
	);
};

export default ButtonList;
