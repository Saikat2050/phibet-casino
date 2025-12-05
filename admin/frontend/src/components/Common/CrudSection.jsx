/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Button, CardBody, Spinner, UncontrolledTooltip } from 'reactstrap';
import PropTypes from 'prop-types';
import usePermission from './Hooks/usePermission';

const CrudSection = ({ title, buttonList, exportComponent }) => {
	const { isGranted } = usePermission();

	return (
		<CardBody className="">
			<div className="d-flex align-items-center">
				<h5 className="mb-0 card-title flex-grow-1">{title}</h5>
				<div className="flex-shrink-0">
					{buttonList.map(
						({
							link,
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
								<Fragment key={link}>
									<Link
										hidden={
											module && operation && !isGranted(module, operation)
										}
										to={disabled ? null : link}
										onClick={disabled ? null : handleClick}
										className={`${
											disabled ? 'disabled' : ''
										} btn btn-primary me-1 ${
											icon ? 'icon-button-padding' : ''
										}`}
										id={`id-${label}`}
									>
										{label}
										{icon}
									</Link>
									{tooltip && (
										<UncontrolledTooltip placement="top" target={`id-${label}`}>
											{tooltip}
										</UncontrolledTooltip>
									)}
								</Fragment>
							)
					)}
				</div>
				<div className="flex-shrink-0">
					{exportComponent?.map(
						({
							label,
							tooltip,
							icon,
							isCsv,
							handleDownload,
							type,
							buttonColor,
							isDownloading,
						}) => (
							<Fragment key={label}>
								{isCsv && (
									<Button
										onClick={() => handleDownload({ type })}
										className="btn btn-primary me-1 icon-button-padding"
										color={buttonColor || 'primary'}
										id={`id-csv-${label}`}
									>
										{isDownloading ? <Spinner size="sm" /> : icon}
									</Button>
								)}
								{tooltip && (
									<UncontrolledTooltip
										placement="top"
										target={`id-csv-${label}`}
									>
										{isDownloading ? 'Download In Progress' : tooltip}
									</UncontrolledTooltip>
								)}
							</Fragment>
						)
					)}
				</div>
			</div>
		</CardBody>
	);
};

CrudSection.defaultProps = {
	exportComponent: [],
	buttonList: [],
};

CrudSection.propTypes = {
	title: PropTypes.string.isRequired,
	buttonList: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			handleClick: PropTypes.func,
			link: PropTypes.string,
			module: PropTypes.string,
			operation: PropTypes.string,
			tooltip: PropTypes.string,
			icon: PropTypes.element,
		})
	),
	exportComponent: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			tooltip: PropTypes.string,
			icon: PropTypes.element,
			isCsv: PropTypes.bool,
			isXml: PropTypes.bool,
			handleDownload: PropTypes.func,
			type: PropTypes.string,
			buttonColor: PropTypes.string,
			isDownloading: PropTypes.bool,
		})
	),
};

export default CrudSection;
