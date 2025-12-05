import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
	Accordion,
	AccordionBody,
	AccordionHeader,
	AccordionItem,
	Button,
	Card,
	Container,
	FormGroup,
} from 'reactstrap';
import FormPage from '../../components/Common/FormPage';
import useBulkUpdatePlayer from './hooks/useBulkUpdatePlayer';
import { CustomSwitchButton } from '../../helpers/customForms';

const BulkUpdatePlayers = ({ selectedPlayers, onSuccess }) => {
	const [open, setOpen] = useState('');
	const [isActive, setIsActive] = useState(true);
	const toggle = (id) => {
		if (open === id) {
			setOpen();
		} else {
			setOpen(id);
		}
	};

	const {
		validation,
		formFields,
		//    handleVerifyEmail,
		updateUserStatus,
	} = useBulkUpdatePlayer(selectedPlayers, onSuccess);

	const handleStatusChange = (value) => {
		setIsActive(value === 'active');
	};

	const handleUpdateUserStatus = () => {
		updateUserStatus(isActive);
	};

	return (
		<Container fluid>
			<Accordion open={open} toggle={toggle}>
				<AccordionItem>
					<AccordionHeader targetId="1" className="accordion-header-custom">
						Update status
					</AccordionHeader>
					<AccordionBody accordionId="1" className="accordion-body-custom">
						<Card className="p-3">
							<div className="update-status-container">
								<FormGroup>
									<CustomSwitchButton
										labelClassName="form-check-label"
										htmlFor="customSwitchActive"
										label="Set Active"
										type="switch"
										id="customSwitchActive"
										name="select"
										inputClassName="form-check-input"
										checked={isActive}
										value="active"
										onClick={() => handleStatusChange('active')}
									/>
									<CustomSwitchButton
										labelClassName="form-check-label"
										htmlFor="customSwitchInactive"
										label="Set Inactive"
										type="switch"
										id="customSwitchInactive"
										name="select"
										inputClassName="form-check-input"
										checked={!isActive}
										value="inactive"
										onClick={() => handleStatusChange('inactive')}
									/>
								</FormGroup>
								<Button
									className="text-end"
									color="primary"
									onClick={handleUpdateUserStatus}
								>
									Set
								</Button>
							</div>
						</Card>
					</AccordionBody>
				</AccordionItem>
				{/* <AccordionItem>
					<AccordionHeader targetId="2" className="accordion-header-custom">
						Verify Email
					</AccordionHeader>
					<AccordionBody accordionId="2" className="accordion-body-custom">
						<Card className="p-3">
							<div className="email-verified-container">
								<div htmlFor="statusInput" style={{ marginRight: '10px' }}>
									Verify Email
								</div>
								<Button
									className="text-end"
									color="primary"
									onClick={handleVerifyEmail}
								>
									Verify
								</Button>
							</div>
						</Card>
					</AccordionBody>
				</AccordionItem> */}
				<AccordionItem>
					<AccordionHeader targetId="3" className="accordion-header-custom">
						Manage Segment
					</AccordionHeader>
					<AccordionBody accordionId="3" className="accordion-body-custom">
						<Container fluid>
							<FormPage
								validation={validation}
								responsiveFormFields={formFields}
								submitLabel="Submit"
								customColClasses="mb-0"
								isSubmitLoading={false}
							/>
						</Container>
					</AccordionBody>
				</AccordionItem>
			</Accordion>
		</Container>
	);
};

BulkUpdatePlayers.defaultProps = {
	selectedPlayers: [],
	onSuccess: () => {},
};

BulkUpdatePlayers.propTypes = {
	selectedPlayers: PropTypes.arrayOf(PropTypes.string),
	onSuccess: PropTypes.func,
};

export default BulkUpdatePlayers;
