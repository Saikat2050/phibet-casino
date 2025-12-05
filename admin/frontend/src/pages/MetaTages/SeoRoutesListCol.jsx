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

const ThumbnailUrl = ({ value }) => <ImageCell imgSrc={value} />;

const Status = ({ value }) =>
	!(value ?? '') ? (
		<Badge className="bg-success">Index</Badge>
	) : (
		<Badge className="bg-danger">No Index</Badge>
	);

const Slug = ({ value }) => value;

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
