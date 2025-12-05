import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'reactstrap';

const Id = ({ value }) => value ?? '';
const Title = ({ value }) => value ?? '';
const Status = ({ value }) =>
	value ? (
		<Badge className="bg-success">Yes</Badge>
	) : (
		<Badge className="bg-danger">No</Badge>
	);

// Define PropTypes
Id.propTypes = {
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
Id.defaultProps = {
	value: '',
};

Title.propTypes = {
	value: PropTypes.string,
};
Title.defaultProps = {
	value: '',
};

Status.propTypes = {
	value: PropTypes.bool,
};
Status.defaultProps = {
	value: false, // Default to false
};

export { Id, Title, Status };
