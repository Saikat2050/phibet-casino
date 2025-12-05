/* eslint-disable react/prop-types */
import React from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';

const YesNoModal = ({ show, content, handleYes, handleClose }) => {
	const toggle = () => {
		handleClose();
	};

	return (
		<Modal isOpen={show} toggle={toggle} backdrop="static">
			<ModalHeader toggle={toggle} tag="h4">
				{content}
			</ModalHeader>
			<ModalBody>
				<Button
					color="success"
					onClick={() => {
						handleYes();
						handleClose();
					}}
				>
					Yes
				</Button>
				<Button className="mx-2" color="warning" onClick={toggle}>
					No
				</Button>
			</ModalBody>
		</Modal>
	);
};

export default YesNoModal;
