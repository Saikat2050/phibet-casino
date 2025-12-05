import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
	Col,
	Row,
	Modal,
	ModalHeader,
	ModalBody,
	Form,
	Spinner,
	Button,
	FormGroup,
	Label,
	Input,
	FormFeedback,
	UncontrolledTooltip,
} from 'reactstrap';

const BannerForm = ({
	isOpen,
	setIsOpen,
	header,
	validation,
	submitLabel,
	isLoading,
	isSubmitLoading,
	disableSubmit,
	modalSize,
	minWidth,
	minHeight,
	maxWidth,
	maxHeight,
}) => {
	const toggleFormModal = () => {
		setIsOpen((prev) => !prev);
	};

	const [images, setImages] = useState(
		validation.values.file ? [...validation.values.file] : []
	);

	useEffect(() => {
		if (!isOpen) {
			setImages([]);
			validation.resetForm();
		}
	}, [isOpen]);
	const handleAddImage = () => {
		if (images.length >= 5) {
			return;
		}
		setImages([...images, null]);
		validation.setFieldValue('file', [...validation.values.file, null]);
	};

	const handleRemoveImage = (index) => {
		const updatedImages = images.filter((_, i) => i !== index);
		setImages(updatedImages);
		validation.setFieldValue('file', updatedImages);
	};

	const handleFileChange = (event, index) => {
		const file = event.target.files[0];
		validation.setFieldError(`file[${index}]`, '');

		if (file) {
			const img = new Image();
			img.src = URL.createObjectURL(file);
			img.onload = () => {
				if (
					img.width >= minWidth &&
					img.height >= minHeight &&
					img.width <= maxWidth &&
					img.height <= maxHeight
				) {
					const updatedImages = [...images];
					updatedImages[index] = file;
					setImages(updatedImages);
					validation.setFieldValue('file', updatedImages);
				} else {
					validation.setFieldError(
						`file[${index}]`,
						`Image dimensions must be between ${minWidth}x${minHeight} and ${maxWidth}x${maxHeight} pixels.`
					);
				}
			};
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			toggle={toggleFormModal}
			backdrop="static"
			size={modalSize}
		>
			<ModalHeader toggle={toggleFormModal} tag="h4">
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
								{images.map((image, index) => (
									// eslint-disable-next-line react/no-array-index-key
									<Col md={12} key={index} className="mb-3">
										<FormGroup>
											<Row className="align-items-center">
												<Col md={6}>
													<Label>Banner {index + 1}</Label>
													<Input
														type="file"
														accept="image/*"
														onChange={(e) => handleFileChange(e, index)}
														invalid={!!validation.errors.file?.[index]}
													/>
													{validation.errors.file?.[index] && (
														<FormFeedback>
															{validation.errors.file?.[index]}
														</FormFeedback>
													)}
												</Col>

												<Col md={4}>
													{image && (
														<img
															src={
																typeof image === 'string'
																	? image
																	: URL.createObjectURL(image)
															}
															alt={`Preview ${index + 1}`}
															className="img-thumbnail"
															style={{
																width: '100px',
																height: '100px',
																objectFit: 'cover',
															}}
														/>
													)}
												</Col>

												<Col md={2} className="text-end mt-4">
													<Button
														color="danger"
														size="sm"
														id={`id-image-${index}`}
														onClick={() => handleRemoveImage(index)}
													>
														<i
															className="mdi mdi-trash-can-outline"
															style={{ fontSize: '15px' }}
														/>
													</Button>
													<UncontrolledTooltip
														placement="top"
														target={`id-image-${index}`}
													>
														Delete
													</UncontrolledTooltip>
												</Col>
											</Row>
										</FormGroup>
									</Col>
								))}

								<Col md={12}>
									<Button
										color="primary"
										onClick={handleAddImage}
										id="id-addButton-images"
										disabled={images.length >= 5}
									>
										Add Images
									</Button>
									<UncontrolledTooltip
										placement="top"
										target="id-addButton-images"
									>
										Max Limit 5 images!
									</UncontrolledTooltip>
								</Col>
							</Row>

							<Row>
								<Col>
									<div className="text-end">
										<Button
											type="submit"
											disabled={isSubmitLoading || disableSubmit}
											color="primary"
										>
											{isSubmitLoading && (
												<i className="bx bx-hourglass bx-spin font-size-16 align-middle me-2" />
											)}
											{submitLabel}
										</Button>
									</div>
								</Col>
							</Row>
						</>
					)}
				</Form>
			</ModalBody>
		</Modal>
	);
};

BannerForm.propTypes = {
	isOpen: PropTypes.bool,
	setIsOpen: PropTypes.func,
	header: PropTypes.string,
	validation: PropTypes.instanceOf,
	submitLabel: PropTypes.string,
	isLoading: PropTypes.bool,
	isSubmitLoading: PropTypes.bool,
	disableSubmit: PropTypes.bool,
	modalSize: PropTypes.string,
	minWidth: PropTypes.number,
	minHeight: PropTypes.number,
	maxWidth: PropTypes.number,
	maxHeight: PropTypes.number,
};

BannerForm.defaultProps = {
	isOpen: false,
	setIsOpen: () => {},
	header: '',
	validation: {},
	submitLabel: 'Save',
	isLoading: false,
	isSubmitLoading: false,
	disableSubmit: false,
	modalSize: 'md',
	minWidth: 100,
	minHeight: 100,
	maxWidth: 2000,
	maxHeight: 2000,
};

export default BannerForm;
