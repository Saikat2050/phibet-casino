/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';

const { VITE_APP_AWS_GALLERY_URL } = import.meta.env;

const ImageCell = ({ imgSrc, cellImageCustomWidth }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [imageHasError, setImageHasError] = useState(false);
	const toggle = () => setIsModalOpen((prev) => !prev);

	const imgSource = imgSrc
		? imgSrc.includes('https')
			? imgSrc
			: `${VITE_APP_AWS_GALLERY_URL}${imgSrc}`
		: null;

	useEffect(() => {
		if (!imgSrc) {
			setImageHasError(true);
		}
	}, [imgSrc]);

	const isSvg = imgSource?.endsWith('svg') || imgSource?.endsWith('xml');

	return (
		<span
			tabIndex={0}
			role="button"
			onClick={!imageHasError && toggle}
			onKeyDown={(e) => e.key === 'Enter' && !imageHasError && toggle()}
			className={!imageHasError ? 'imageCellContent' : ''}
		>
			{isModalOpen && (
				<Modal isOpen={isModalOpen} toggle={toggle}>
					<ModalHeader toggle={toggle} tag="h4">
						Image Preview
					</ModalHeader>
					<ModalBody
						style={{
							padding: '50px',
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						{isSvg ? (
							<embed
								src={imgSource}
								type="image/svg+xml"
								style={{ maxWidth: '100%', height: 'auto' }}
								// onError={() => setImageHasError(true)}
							/>
						) : (
							<img
								src={imgSource}
								alt="thumbnail"
								style={{ maxWidth: '100%' }}
								onError={() => setImageHasError(true)}
							/>
						)}
					</ModalBody>
				</Modal>
			)}

			{!imageHasError ? (
				isSvg ? (
					<embed
						src={imgSource}
						type="image/svg+xml"
						style={{ maxWidth: cellImageCustomWidth, height: 'auto' }}
						// onError={() => setImageHasError(true)}
					/>
				) : (
					<img
						src={imgSource}
						onError={() => setImageHasError(true)}
						alt="thumbnail"
						style={{ maxWidth: cellImageCustomWidth }}
					/>
				)
			) : (
				'-'
			)}
		</span>
	);
};

ImageCell.defaultProps = {
	cellImageCustomWidth: 50,
};

ImageCell.propTypes = {
	imgSrc: PropTypes.string.isRequired,
	cellImageCustomWidth: PropTypes.number,
};

export default ImageCell;
