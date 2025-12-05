import React from 'react';
import { Badge } from 'reactstrap';
import PropTypes from 'prop-types';
import LightboxImage from '../../../components/Common/LightboxImage';

const statusMapper = (value) => {
	switch (value) {
		case 0:
			return 'Pending';
		case 1:
			return 'Approved';
		case 4:
			return 'Re-requested';
		default:
			return 'Rejected';
	}
};

const Id = ({ value }) => value ?? '';

const Name = ({ value }) => {
	const isRequired = value?.required;
	return (
		<>
			{value?.name}
			<Badge className="ms-2 p-1" color={isRequired ? 'success' : 'warning'}>
				{isRequired ? 'Required' : 'Not Required'}
			</Badge>
		</>
	);
};
const Reason = ({ value }) => value ?? '-';
const UpdatedAt = ({ value }) => value ?? '';
const Actionee = ({ value }) => value ?? '-';
const ActionAt = ({ value }) => value ?? '';
const Status = ({ value }) => (value ? statusMapper(value) : '-');
const Action = ({ value }) => (value ? statusMapper(value) : '-');

const ThumbnailUrl = ({ value }) => <LightboxImage imgSrc={value} />;

ThumbnailUrl.propTypes = {
	value: PropTypes.string.isRequired,
};

Name.propTypes = {
	value: PropTypes.objectOf().isRequired,
};

export {
	Id,
	Name,
	Reason,
	UpdatedAt,
	Actionee,
	ActionAt,
	Status,
	Action,
	ThumbnailUrl,
};
