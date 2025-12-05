/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, BreadcrumbItem } from 'reactstrap';

const Breadcrumb = ({
	titleLink,
	itemLink,
	title,
	breadcrumbItem,
	leftTitle,
	showRightInfo = true,
	showBackButton,
	values,
	setShowModal,
	callBack,
	isNotFormModal,
	showElementControl,
	paddingBottom,
	toggleElementControl,
	customActions,
}) => {
	const navigate = useNavigate();
	const onBackClick = () => {
		if (!titleLink && !values && !callBack && (breadcrumbItem || leftTitle))
			return;
		const hasFilledValues = Object?.values(values || {}).some(
			(value) => !isEmpty(value)
		);
		if (hasFilledValues) {
			setShowModal(true);
			if (isNotFormModal) {
				navigate(-1);
			}
		} else {
			navigate(-1);
		}
	};

	const onBackArrowClick = () => navigate(-1);

	return (
		<Row>
			<Col xs="12">
				<div
					className="d-flex align-items-center justify-content-between"
					style={{ paddingBottom }}
				>
					<div className="d-flex align-items-center">
						{showBackButton && (
							<h4
								className="mb-0 ms-2 font-size-16"
								role="presentation"
								style={{ cursor: 'pointer' }}
								onClick={onBackArrowClick}
							>
								<>
									<i className="fas fa-angle-left" />{' '}
									{leftTitle || breadcrumbItem ? '' : 'Back'}
								</>
							</h4>
						)}
						<h4
							className="mb-0 ms-2 font-size-18"
							role="presentation"
							style={{
								cursor: `${titleLink || values || callBack ? 'pointer' : ''}`,
							}}
							onClick={
								titleLink ? () => navigate(titleLink) : callBack || onBackClick
							}
						>
							{leftTitle || breadcrumbItem}
						</h4>
					</div>
					{showRightInfo && (
						<div className="page-title-right">
							<ol className="breadcrumb m-0 p-0">
								<BreadcrumbItem>
									<Link to={titleLink || '#'}>{title}</Link>
								</BreadcrumbItem>
								<BreadcrumbItem active>
									<Link to={itemLink || '#'}>{breadcrumbItem}</Link>
								</BreadcrumbItem>
							</ol>
						</div>
					)}
					{showElementControl && (
						<i
							className="bx bx-customize bx-tada dash-element-icon fs-2 me-4 p-2"
							onClick={toggleElementControl}
						/>
					)}
					{customActions}
				</div>
			</Col>
		</Row>
	);
};

Breadcrumb.defaultProps = {
	titleLink: '',
	itemLink: '',
	leftTitle: '',
	showRightInfo: true,
	showBackButton: false,
	setShowModal: () => {},
	values: null,
	callBack: undefined,
	isNotFormModal: true,
	showElementControl: false,
	paddingBottom: '15px',
	toggleElementControl: () => {},
	customActions: null,
};

Breadcrumb.propTypes = {
	breadcrumbItem: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	titleLink: PropTypes.string,
	itemLink: PropTypes.string,
	leftTitle: PropTypes.string,
	showRightInfo: PropTypes.bool,
	showBackButton: PropTypes.bool,
	setShowModal: PropTypes.func,
	values: PropTypes.objectOf(),
	callBack: PropTypes.func,
	isNotFormModal: PropTypes.bool,
	showElementControl: PropTypes.bool,
	paddingBottom: PropTypes.string,
	toggleElementControl: PropTypes.func,
	customActions: PropTypes.element,
};

export default Breadcrumb;
