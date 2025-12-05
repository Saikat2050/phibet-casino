/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Spinners from '../Spinner';

const ModalView = (props) => {
	const {
		openModal,
		submitHandler,
		handleSubmit,
		firstBtnName,
		secondBtnName,
		children,
		headerTitle,
		toggleModal,
		className,
		size,
		footerClass,
		headerClass,
		center,
		hideFooter,
		handleClick,
		hideHeader,
		titleHeaderIcon,
		firstBtnClass,
		secondBtnClass,
		isLoading = false,
		isHandleSubmit,
		isDisabled = false,
	} = props;
	return (
		<Modal
			zIndex="9999"
			backdropClassName="bakc"
			isOpen={openModal}
			toggle={toggleModal}
			className={className}
			size={size}
			centered={center}
			backdrop="static"
		>
			{isLoading ? (
				<Spinners />
			) : (
				!hideHeader && (
					<ModalHeader toggle={toggleModal} className={headerClass}>
						{titleHeaderIcon && <img src={titleHeaderIcon} alt="" />}
						{headerTitle}
					</ModalHeader>
				)
			)}
			<ModalBody>{children}</ModalBody>
			{!hideFooter && (
				<ModalFooter className={footerClass}>
					<div>
						{firstBtnName && firstBtnName !== '' && (
							<Button
								className={`${firstBtnClass} mr-2`}
								color="secondary"
								onClick={toggleModal}
							>
								{firstBtnName}
							</Button>
						)}
						<Button
							className={secondBtnClass || 'btn-primary'}
							type="submit"
							disabled={isDisabled}
							onClick={
								isHandleSubmit ? handleSubmit(submitHandler) : handleClick
							}
						>
							{secondBtnName}
						</Button>
					</div>
				</ModalFooter>
			)}
		</Modal>
	);
};

ModalView.defaultProps = {
	openModal: false,
	handleSubmit: () => {},
	submitHandler: () => {},
	firstBtnName: '',
	secondBtnName: '',
	children: <div />,
	size: '',
	headerTitle: '',
	toggleModal: () => {},
	className: '',
	footerClass: '',
	headerClass: '',
	center: false,
	hideFooter: false,
	handleClick: () => {},
	hideHeader: false,
	titleHeaderIcon: '',
	firstBtnClass: '',
	secondBtnClass: '',
	isLoading: false,
	isHandleSubmit: false,
	isDisabled: false,
};

ModalView.propTypes = {
	openModal: PropTypes.bool,
	handleSubmit: PropTypes.func,
	submitHandler: PropTypes.func,
	firstBtnName: PropTypes.string,
	secondBtnName: PropTypes.string,
	children: PropTypes.element,
	size: PropTypes.string,
	headerTitle: PropTypes.string,
	toggleModal: PropTypes.func,
	className: PropTypes.string,
	footerClass: PropTypes.string,
	headerClass: PropTypes.string,
	center: PropTypes.bool,
	hideFooter: PropTypes.bool,
	handleClick: PropTypes.func,
	hideHeader: PropTypes.bool,
	titleHeaderIcon: PropTypes.string,
	firstBtnClass: PropTypes.string,
	secondBtnClass: PropTypes.string,
	isLoading: PropTypes.bool,
	isHandleSubmit: PropTypes.bool,
	isDisabled: PropTypes.bool,
};
export default ModalView;
