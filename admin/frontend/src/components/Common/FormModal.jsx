/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-expressions */
import PropTypes from 'prop-types';
import React from 'react';
import {
	Col,
	Row,
	Modal,
	ModalHeader,
	ModalBody,
	Form,
	Spinner,
	UncontrolledTooltip,
	Button,
} from 'reactstrap';
import { isEmpty } from 'lodash';
import { getField } from '../../helpers/customForms';

const FormModal = ({
	isOpen,
	setIsOpen,
	isEditOpen,
	showConfirmationModal,
	setShowConfirmationModal,
	toggle,
	header,
	validation,
	formFields,
	submitLabel,
	isLoading,
	customColClasses,
	customComponent,
	isSubmitLoading,
	colOptions,
	responsiveFormFields,
	className,
	disableSubmit,
	isSubmit,
	modalSize,
}) => {
	const toggleFormModal = () => {
		if (!isEditOpen) {
			const hasFilledValues = Object.values(validation.values).some((value) =>
				value instanceof File ? value.size > 0 : !isEmpty(value)
			);
			hasFilledValues && setShowConfirmationModal(!showConfirmationModal);
		}
		setIsOpen((prev) => !prev);
	};

	return (
		<Modal
			isOpen={isOpen}
			toggle={toggle ?? toggleFormModal}
			className={className}
			backdrop="static"
			size={modalSize}
		>
			<ModalHeader toggle={toggle ?? toggleFormModal} tag="h4">
				{header}
			</ModalHeader>
			<ModalBody>
				<Form
					onSubmit={(e) => {
						e.preventDefault();
						validation.handleSubmit(e);
						return false;
					}}
				>
					{isLoading ? (
						<Spinner
							color="primary"
							className="position-absolute top-50 start-50"
						/>
					) : (
						<>
							<Row>
								{formFields?.map((field) => {
									let hideInput = true;
									if (field?.hideId && validation?.values?.id === '1')
										hideInput = false;
									return (
										!field?.isHide &&
										hideInput && (
											<Col className={`col-12 mb-3 ${customColClasses}`}>
												{getField(field, validation)}
											</Col>
										)
									);
								})}
							</Row>
							{/* Responsive/customizable column forms */}
							<Row className="justify-content-start">
								{responsiveFormFields?.map((field) => {
									let hideInput = true;
									if (field?.hideId && validation?.values?.id === '1')
										hideInput = false;
									return (
										!field?.isHide &&
										hideInput && (
											<>
												{field?.isNewRow && <div className="row" />}
												<Col
													id={`field-${field.name}`}
													{...(field?.fieldColOptions || colOptions)}
													className="mb-3"
												>
													{getField(field, validation)}
												</Col>
												{!!field.tooltipContent && (
													<UncontrolledTooltip
														placement="bottom"
														target={`field-${field.name}`}
													>
														{field.tooltipContent}
													</UncontrolledTooltip>
												)}
											</>
										)
									);
								})}
							</Row>
							<Row>{customComponent}</Row>
							{isSubmit ? (
								<Row>
									<Col>
										<div className="text-end">
											<Button
												type="submit"
												disabled={isSubmitLoading || disableSubmit}
												className="save-user"
												color="primary"
											>
												{isSubmitLoading && !disableSubmit && (
													<i className="bx bx-hourglass bx-spin font-size-16 align-middle me-2" />
												)}
												{/* {isSubmitLoading && <i className="bx bx-loader bx-spin font-size-16 align-middle me-2" /> } */}{' '}
												{submitLabel}
											</Button>
										</div>
									</Col>
								</Row>
							) : null}
						</>
					)}
				</Form>
			</ModalBody>
		</Modal>
	);
};

FormModal.defaultProps = {
	isOpen: false,
	toggle: null,
	header: '',
	validation: {},
	formFields: [],
	submitLabel: 'Save',
	isLoading: false,
	customColClasses: '',
	customComponent: <div />,
	isSubmitLoading: false,
	className: '',
	colOptions: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 },
	responsiveFormFields: [],
	setIsOpen: () => {},
	isEditOpen: false,
	showConfirmationModal: false,
	setShowConfirmationModal: () => {},
	disableSubmit: false,
	isSubmit: true,
	modalSize: 'md',
};

FormModal.propTypes = {
	isOpen: PropTypes.bool,
	toggle: PropTypes.func,
	header: PropTypes.string,
	validation: PropTypes.objectOf({
		values: PropTypes.objectOf({
			key: PropTypes.string,
		}),
	}),
	formFields: PropTypes.arrayOf({
		name: PropTypes.string,
		label: PropTypes.string,
	}),
	submitLabel: PropTypes.string,
	isLoading: PropTypes.bool,
	customColClasses: PropTypes.string,
	customComponent: PropTypes.element,
	isSubmitLoading: PropTypes.bool,
	colOptions: PropTypes.objectOf({
		xl: PropTypes.number,
	}),
	responsiveFormFields: PropTypes.arrayOf(
		PropTypes.objectOf({
			label: PropTypes.string,
		})
	),
	className: PropTypes.string,
	setIsOpen: PropTypes.func,
	isEditOpen: PropTypes.bool,
	showConfirmationModal: PropTypes.bool,
	setShowConfirmationModal: PropTypes.func,
	disableSubmit: PropTypes.bool,
	isSubmit: PropTypes.bool,
	modalSize: PropTypes.string,
};

export default FormModal;
