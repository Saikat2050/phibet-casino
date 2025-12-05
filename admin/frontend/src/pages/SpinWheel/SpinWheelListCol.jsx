import React from 'react';
import { Badge } from 'reactstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { SPIN_WHEEL_PRIORITY } from './formDetails';

const KeyValueCell = ({ value }) => value ?? '-';

const Status = ({ value }) =>
	value ?? '' ? (
		<Badge className="bg-success">Active</Badge>
	) : (
		<Badge className="bg-danger">In Active</Badge>
	);

const Icon = ({ value }) =>
	value ? <img alt="sidebar_bg_image" width="20" src={value} /> : '-';

const Priority = (value) => {
	const priority = _.find(SPIN_WHEEL_PRIORITY, { id: value?.value });
	return priority?.label ?? '-';
};

const Actions = () => <i className="dripicons-dots-3" />;

export { KeyValueCell, Icon, Status, Actions, Priority };

Status.propTypes = {
	value: PropTypes.bool.isRequired,
};

Icon.propTypes = {
	value: PropTypes.string.isRequired,
};
