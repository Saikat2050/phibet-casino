/* eslint-disable jsx-a11y/anchor-is-valid */
import PropTypes from 'prop-types';
import React from 'react';
import { Badge, UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';

const PlayerId = ({ value }) => value ?? '';

const UserName = ({ cell }) => (
	<>
		<div className="text-ellipsis" id={`username-${cell?.row?.original?.id}`}>
			{cell.value ? (
				<Link to={`/player-details/${cell?.row?.original?.id}`}>
					{cell.value}
				</Link>
			) : (
				''
			)}
		</div>
		<UncontrolledTooltip
			placement="top"
			target={`username-${cell?.row?.original?.id}`}
		>
			{cell.value || '-'}
		</UncontrolledTooltip>
	</>
);

const Email = ({ cell }) => {
	const userId = cell?.row?.original?.id;
	return (
		<>
			<Link to={`/player-details/${userId}`} id={`email-${userId}`}>
				{cell?.value}
			</Link>
			<UncontrolledTooltip placement="top" target={`email-${userId}`}>
				{cell?.value}
			</UncontrolledTooltip>
		</>
	);
};

const CountryName = ({ value }) => {
	const userId = value?.row?.original?.id;
	return (
		<>
			<div className="text-ellipsis" id={`country-${userId}`}>
				{value?.value?.name || '-'}
			</div>
			<UncontrolledTooltip placement="top" target={`country-${userId}`}>
				{value?.value?.name}
			</UncontrolledTooltip>
		</>
	);
};

const PhoneNumber = ({ value }) => value ?? '-';

const UniqueId = ({ value }) => value ?? '-';

// const KycStatus = ({ value }) => value ?? '-';

const RegistrationDate = ({ value }) => value ?? '-';

const IsInternal = ({ value }) => value ?? '-';

const Name = ({ cell }) => cell?.row?.original?.firstName
		? cell.row.original.firstName + cell.row.original.lastName
		: '-';

const Tags = ({ value }) => (
	<div className="text-ellipsis">
		{value?.length
			? value?.map((tag) => (
					<Badge className="badge-soft-secondary me-1">{tag}</Badge>
			  ))
			: '-'}
	</div>
);

const KycStatus = ({ value }) => {
	switch (value) {
		case 'COMPLETED':
			return <Badge color="primary">Approved</Badge>;
		case 'PENDING':
			return <Badge color="warning">Pending</Badge>;
		case 'IN_PROGRESS':
			return <Badge color="secondary">In progress</Badge>;
		case 'FAILED':
			return <Badge color="danger">Failed</Badge>;
		default:
			return '-';
	}
};

const Status = ({ value }) => {
	switch (value) {
		case 'Active':
			return <Badge className="bg-success">Active</Badge>;
		case 'Inactive':
			return <Badge className="bg-danger">Inactive</Badge>;
		default:
			return '-';
	}
};

UserName.propTypes = {
	cell: PropTypes.shape({
		value: PropTypes.string.isRequired,
		row: PropTypes.shape({
			original: PropTypes.shape({
				id: PropTypes.string.isRequired,
			}).isRequired,
		}).isRequired,
	}).isRequired,
};

Status.propTypes = {
	value: PropTypes.string.isRequired,
};

KycStatus.propTypes = {
	value: PropTypes.string.isRequired,
};

Tags.propTypes = {
	value: PropTypes.arrayOf().isRequired,
};

Name.propTypes = {
	cell: PropTypes.arrayOf().isRequired,
};

CountryName.propTypes = {
	value: PropTypes.shape({
		value: PropTypes.string.isRequired,
		row: PropTypes.shape({
			original: PropTypes.shape({
				id: PropTypes.string.isRequired,
				isActive: PropTypes.bool.isRequired,
			}).isRequired,
		}).isRequired,
	}).isRequired,
};

Email.propTypes = {
	cell: PropTypes.shape({
		value: PropTypes.string.isRequired,
		row: PropTypes.shape({
			original: PropTypes.shape({
				id: PropTypes.string.isRequired,
			}).isRequired,
		}).isRequired,
	}).isRequired,
};

export {
	IsInternal,
	KycStatus,
	PhoneNumber,
	UserName,
	PlayerId,
	Email,
	Status,
	CountryName,
	Tags,
	Name,
	RegistrationDate,
	UniqueId
};
