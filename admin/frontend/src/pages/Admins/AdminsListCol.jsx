/* eslint-disable no-script-url */
/* eslint-disable react/jsx-no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Badge } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const AdminUserID = ({ value }) => (
	<span className="fw-bold">{value ?? ''}</span>
);

const FullName = ({ value }) => value ?? '';

const Email = ({ value, adminData, handleView }) => (
	<Link to="javascript:void(0)" onClick={() => handleView(adminData)}>
		{value ?? ''}
	</Link>
);

const Role = ({ value }) => value ?? '';

const Group = ({ value }) => value ?? '';

const Status = ({ value }) =>
	value ?? '' ? (
		<Badge className="bg-success">Active</Badge>
	) : (
		<Badge className="bg-danger">In Active</Badge>
	);

AdminUserID.propTypes = {
	value: PropTypes.number.isRequired,
};

Status.propTypes = {
	value: PropTypes.bool.isRequired,
};

Email.propTypes = {
	value: PropTypes.bool.isRequired,
	adminData: PropTypes.objectOf({ id: PropTypes.string }).isRequired,
	handleView: PropTypes.func.isRequired,
};

export { AdminUserID, Email, FullName, Role, Group, Status };
