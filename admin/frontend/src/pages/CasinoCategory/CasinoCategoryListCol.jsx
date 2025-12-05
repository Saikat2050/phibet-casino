/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Badge } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ImageCell from '../../components/Common/ImageCell';

const GameCategoryId = ({ value }) => (
	<Link to="#" className="text-body fw-bold">
		{value ?? ''}
	</Link>
);
const Name = ({ value }) => value ?? '';

const Slug = ({ value }) => value ?? '';

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

GameCategoryId.propTypes = {
	value: PropTypes.string.isRequired,
};

Status.propTypes = {
	value: PropTypes.bool.isRequired,
};

ThumbnailUrl.propTypes = {
	value: PropTypes.bool.isRequired,
};

export { GameCategoryId, Name, Status, ThumbnailUrl, Slug };
