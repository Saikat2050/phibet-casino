/* eslint-disable react/prop-types */
import React from 'react';
import { Button } from 'reactstrap';

const ActionButton = ({ onClick, iconClass, children, className, disabled }) => (
	<Button className={`fancy-btn ${className}`} onClick={onClick} disabled={disabled} >
		<i className={`${iconClass}`} /> {children}
	</Button>
);

export default ActionButton;
