/* eslint-disable react/prop-types */
import React from 'react';
import { Offcanvas, OffcanvasHeader, OffcanvasBody } from 'reactstrap';

const Drawer = ({ isOpen, toggle, title, children }) => (
	<Offcanvas
		direction="end"
		fade={false}
		scrollable
		isOpen={isOpen}
		toggle={toggle}
	>
		<OffcanvasHeader toggle={toggle}>{title}</OffcanvasHeader>
		<OffcanvasBody>{children}</OffcanvasBody>
	</Offcanvas>
);

export default Drawer;
