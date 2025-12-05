import React from 'react';
import PropTypes from 'prop-types';

import 'react-image-lightbox/style.css';
import ImageCell from '../../components/Common/ImageCell';

const Pages = ({ value }) => {
	const formattedValue = value?.toUpperCase();

	switch (formattedValue) {
		case 'REFERRAL':
			return 'REFER A FRIEND';
		case 'STORE':
			return 'BUY PACKAGES';
		default:
			return formattedValue ?? '';
	}
};

const Id = ({ value }) => value ?? '';

const BannerPreview = ({ value }) => <ImageCell imgSrc={value} />;

BannerPreview.propTypes = {
	value: PropTypes.string.isRequired,
};

export { Pages, BannerPreview, Id };
