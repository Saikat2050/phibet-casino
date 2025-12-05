import React from 'react';
import { Badge } from 'reactstrap';
import PropTypes from 'prop-types';

const Id = ({ value }) => value ?? '-';

const CountryName = ({ value }) => value ?? '-';

const CountryCode = ({ value }) => value ?? '-';

const Language = ({ value }) => value ?? '-';

const Status = ({ value }) =>
	value ?? '' ? (
		<Badge className="bg-success">Active</Badge>
	) : (
		<Badge className="bg-danger">In Active</Badge>
	);

const Icon = ({ value }) =>
	value ? <img alt="sidebar_bg_image" width="20" src={value} /> : '-';

const Actions = () => <i className="dripicons-dots-3" />;

export { Id, CountryName, Icon, Status, Actions, CountryCode, Language };

Status.propTypes = {
	value: PropTypes.bool.isRequired,
};

Icon.propTypes = {
	value: PropTypes.string.isRequired,
};
