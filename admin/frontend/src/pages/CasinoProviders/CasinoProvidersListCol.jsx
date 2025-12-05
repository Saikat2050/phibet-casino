import React from 'react';
import { Badge } from 'reactstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import 'react-image-lightbox/style.css';
import ImageCell from '../../components/Common/ImageCell';
import { selectedLanguage } from '../../constants/config';

const CasinoProviderId = ({ value }) => (
	<Link to="/#" className="text-body fw-bold">
		{value ?? ''}
	</Link>
);
const Name = ({ value }) => value[selectedLanguage] ?? '';

const ThumbnailUrl = ({ value }) => {
	if (!value) return '-'; // No image, no background.

	return (
		<div
			style={{
				backgroundColor: '#c0c0c0',
				padding: '8px',
				display: 'inline-block',
			}}
		>
			<ImageCell imgSrc={value} />
		</div>
	);
};

const Status = ({ value }) =>
	value ?? '' ? (
		<Badge className="bg-success">Active</Badge>
	) : (
		<Badge className="bg-danger">In Active</Badge>
	);

CasinoProviderId.propTypes = {
	value: PropTypes.number.isRequired,
};

ThumbnailUrl.propTypes = {
	value: PropTypes.string.isRequired,
};

Status.propTypes = {
	value: PropTypes.bool.isRequired,
};

export { CasinoProviderId, Name, ThumbnailUrl, Status };
