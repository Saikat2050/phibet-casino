import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ImageCell from '../../components/Common/ImageCell';

const KeyValueCell = ({ value }) => value ?? '';

const CasinoGameId = ({ value }) => (
	<Link to="/#" className="text-body">
		{value ?? ''}
	</Link>
);

const DeviceType = ({ value }) => value ?? '';

const GameCategoryId = ({ value }) => (
	<Link to="/#" className="text-body fw-bold">
		{value ?? ''}
	</Link>
);

const Status = ({ value }) =>
	value ?? '' ? (
		<span className="text-success">Active</span>
	) : (
		<span className="text-danger">In Active</span>
	);

const Name = ({ value }) => value ?? '';

const GameCategory = ({ value }) => value ?? '';

const ImageUrl = ({ value }) => <ImageCell imgSrc={value} />;

GameCategoryId.propTypes = {
	value: PropTypes.string.isRequired,
};

Status.propTypes = {
	value: PropTypes.bool.isRequired,
};

ImageUrl.propTypes = {
	value: PropTypes.string.isRequired,
};

GameCategory.propTypes = {
	value: PropTypes.string.isRequired,
};

Name.propTypes = {
	value: PropTypes.string.isRequired,
};

DeviceType.propTypes = {
	value: PropTypes.string.isRequired,
};

CasinoGameId.propTypes = {
	value: PropTypes.string.isRequired,
};

Status.propTypes = {
	value: PropTypes.bool.isRequired,
};

export {
	KeyValueCell,
	Status,
	ImageUrl,
	GameCategory,
	Name,
	DeviceType,
	CasinoGameId,
	GameCategoryId,
};
