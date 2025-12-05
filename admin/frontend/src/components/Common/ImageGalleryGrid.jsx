import React from 'react';
import PropTypes from 'prop-types';
import { Col, UncontrolledTooltip, Button } from 'reactstrap';
import CopyToClipboard from 'react-copy-to-clipboard';
import { modules } from '../../constants/permissions';

const ImageGalleryGrid = ({
	imageGalleryList,
	isGranted,
	setShowDeletePopup,
	imageColClass,
	onCopyClipboard,
}) =>
	imageGalleryList.length ? (
		imageGalleryList?.map((f) => (
			<div className={imageColClass}>
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
						{setShowDeletePopup && (
							<Col className="trash-btn position-absolute top-0 end-0">
								<Button
									hidden={!isGranted(modules.gallery, 'D')}
									className="btn btn-sm btn-soft-danger"
									onClick={() =>
										setShowDeletePopup({ showDelete: true, fileName: f })
									}
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

ImageGalleryGrid.defaultProps = {
	imageGalleryList: [],
	isGranted: true,
	setShowDeletePopup: () => null,
	imageColClass: '',
	onCopyClipboard: () => null,
};

ImageGalleryGrid.propTypes = {
	imageGalleryList: PropTypes.arrayOf(
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
	isGranted: PropTypes.bool,
	setShowDeletePopup: PropTypes.func,
	imageColClass: PropTypes.string,
	onCopyClipboard: PropTypes.func,
};

export default ImageGalleryGrid;
