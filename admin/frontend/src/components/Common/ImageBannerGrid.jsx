/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Col, UncontrolledTooltip, Button } from 'reactstrap';
import { modules } from '../../constants/permissions';

const ImageBannerGrid = ({
	bannersList,
	imageColClass,
	onCopyClipboard,
	handleDelete,
	isGranted,
	isView = false,
}) =>
	bannersList.length ? (
		bannersList?.map((f) => (
			<div
				key={f}
				className={imageColClass}
				onClick={() => isView && window.open(f, '_blank')}
			>
				<div
					key={`${f}-file`}
					className="bg-transparent h-100 align-items-center dz-processing dz-image-preview dz-success dz-complete"
				>
					<div className="img-parent h-100 position-relative ">
						<CopyToClipboard text={f} onCopy={onCopyClipboard}>
							<img
								data-dz-thumbnail=""
								className="rounded bg-light h-100"
								alt={f}
								src={f}
							/>
						</CopyToClipboard>
						{!isView && (
							<Col className="trash-btn position-absolute top-0 end-0">
								<Button
									hidden={!isGranted(modules.banner, 'D')}
									className="btn btn-sm btn-soft-danger"
									onClick={() => handleDelete({ f })}
								>
									<i className="mdi mdi-delete-outline" id="deletetooltip" />
									<UncontrolledTooltip placement="top" target="deletetooltip">
										Delete
									</UncontrolledTooltip>
								</Button>
							</Col>
						)}
					</div>
				</div>
			</div>
		))
	) : (
		<div className="text-center mb-3">No Images Available</div>
	);

ImageBannerGrid.defaultProps = {
	bannersList: [],
	imageColClass: '',
	onCopyClipboard: () => null,
	isGranted: () => false, // Default to false for safety
	handleDelete: () => null, // Default empty handler,
	isView: false,
};

ImageBannerGrid.propTypes = {
	bannersList: PropTypes.arrayOf(
		PropTypes.objectOf(
			PropTypes.oneOfType([
				PropTypes.object,
				PropTypes.func,
				PropTypes.bool,
				PropTypes.number,
				PropTypes.string,
			])
		)
	),
	isGranted: PropTypes.func, // your code uses `isGranted(...)` as a function, not a boolean
	handleDelete: PropTypes.func,
	imageColClass: PropTypes.string,
	onCopyClipboard: PropTypes.func,
	isView: PropTypes.bool,
};

export default ImageBannerGrid;
