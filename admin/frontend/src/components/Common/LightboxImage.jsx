import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

const { VITE_APP_AWS_GALLERY_URL } = import.meta.env;

const LightboxImage = ({ imgSrc, cellImageCustomWidth }) => {
	const [isLightboxOpen, setIsLightboxOpen] = useState(false);
	const [imageHasError, setImageHasError] = useState(false);

	// eslint-disable-next-line no-nested-ternary
	const imgSource = imgSrc
		? imgSrc?.includes('https')
			? imgSrc
			: `${VITE_APP_AWS_GALLERY_URL}${imgSrc}`
		: '-';

	useEffect(() => {
		if (!imgSrc) {
			setImageHasError(true);
		}
	}, [imgSrc]);

	return (
		<div
			tabIndex={0}
			role="button"
			onClick={!imageHasError ? () => setIsLightboxOpen(true) : undefined}
			onKeyDown={!imageHasError ? () => setIsLightboxOpen(true) : undefined}
			className={!imageHasError ? 'lightboxImageContent' : ''}
			style={{ cursor: !imageHasError ? 'pointer' : 'default' }}
		>
			{!imageHasError ? (
				<img
					src={imgSource}
					onError={() => setImageHasError(true)}
					alt="thumbnail"
					style={{ maxWidth: cellImageCustomWidth }}
				/>
			) : (
				'-'
			)}
			{isLightboxOpen && (
				<Lightbox
					mainSrc={imgSource}
					onCloseRequest={() => setIsLightboxOpen(false)}
					enableZoom
				/>
			)}
		</div>
	);
};

LightboxImage.defaultProps = {
	cellImageCustomWidth: 50,
};

LightboxImage.propTypes = {
	imgSrc: PropTypes.string.isRequired,
	cellImageCustomWidth: PropTypes.number,
};

export default LightboxImage;
