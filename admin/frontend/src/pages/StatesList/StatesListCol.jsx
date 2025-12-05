import React from 'react';
import { Badge } from 'reactstrap';
import PropTypes from 'prop-types';

const StateName = ({ value }) => value ?? '-';

const StateCode = ({ value }) => value ?? '-';

const Status = ({ value }) =>
	value ?? '' ? (
		<Badge className="bg-success">Active</Badge>
	) : (
		<Badge className="bg-danger">In Active</Badge>
	);

const Icon = ({ value }) =>
	value ? <img alt="sidebar_bg_image" width="20" src={value} /> : '-';

const Actions = () => <i className="dripicons-dots-3" />;

export { StateName, Icon, Status, Actions, StateCode };

Status.propTypes = {
	value: PropTypes.bool.isRequired,
};

Icon.propTypes = {
	value: PropTypes.string.isRequired,
};
