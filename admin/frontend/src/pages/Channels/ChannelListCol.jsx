import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'reactstrap';

const Title = ({ value }) => value?.toUpperCase() ?? '';

const Description = ({ value }) => value ?? '';

const Status = ({ value }) =>
	value ? (
		<Badge className="bg-success">Active</Badge>
	) : (
		<Badge className="bg-danger">In Active</Badge>
	);

const GLobal = ({ value }) =>
	value ? (
		<Badge className="bg-success">Yes</Badge>
	) : (
		<Badge className="bg-danger">No</Badge>
	);

Status.propTypes = {
	value: PropTypes.bool.isRequired,
};

GLobal.propTypes = {
	value: PropTypes.bool.isRequired,
};

export { Title, Status, GLobal, Description };
