/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Badge } from 'reactstrap';

const KeyValueCell = ({ value }) => value ?? '0';
const KeyValueCellNA = ({ value }) => value ?? '-';
const Id = ({ value }) => value ?? '-';
const Email = ({ value }) => value ?? '';
const ActionTypes = ({ value }) => value ?? '';
const Purpose = ({ value }) => value ?? '';

const GameName = ({ value }) => value ?? '-';

const WalletAmount = ({ value, type }) =>
	value ? (
		<div
			className={`font-weight-bold ${type ? 'text-danger' : 'text-success'}`}
		>{`${value}`}</div>
	) : (
		'-'
	);

const Amount = ({ value }) =>
	value ? <div className="text-success">{value}</div> : '-';

const BonusMoney = ({ value }) =>
	value ? <div className="text-danger">{value}</div> : '-';

const StatusData = ({ value }) => value ?? 'Pending';

const Status = ({ value }) => value ?? '';

const CreatedAt = ({ value }) => value ?? '';

const NonCashAmount = ({ value }) =>
	value ? (
		<div className={value >= 0 ? 'text-success' : 'text-danger'}>{value}</div>
	) : (
		'-'
	);

const CurrencyCode = ({ value }) =>
	value ? <div className="text-primary">{value}</div> : '';

const PromotionTitle = ({ value }) => value ?? '';

const Action = (cell) => (cell.value ? cell.value : '');

const Comment = ({ value }) =>
	value ? <div className="comment-term-text">{value}</div> : '';

const UserName = ({ cell }) =>
	cell.value ? (
		<Link to={`/player-details/${cell?.row?.original?.id}`}>{cell.value}</Link>
	) : (
		''
	);

const IsActive = ({ value }) => {
	switch (value) {
		case true:
			return <Badge className="bg-success">Active</Badge>;
		case false:
			return <Badge className="bg-danger">Inactive</Badge>;
		default:
			return '';
	}
};
const KycStatus = ({ value }) => {
	switch (value) {
		case 'COMPLETE':
			return <Badge color="primary">Approved</Badge>;
		case 'PENDING':
			return <Badge color="warning">Pending</Badge>;
		case 'CREATED':
			return <Badge color="warning">Pending</Badge>;
		case 'ARCHIVED':
			return <Badge color="warning">Failed</Badge>;
		case 'PROCESSING':
			return <Badge color="secondary">In progress</Badge>;
		case 'IN_PROGRESS':
			return <Badge color="secondary">In progress</Badge>;
		case 'FAILED':
			return <Badge color="danger">Failed</Badge>;
		default:
			return '-';
	}
};

Amount.propTypes = {
	value: PropTypes.number.isRequired,
};

BonusMoney.propTypes = {
	value: PropTypes.number.isRequired,
};

Status.propTypes = {
	value: PropTypes.number.isRequired,
};

NonCashAmount.propTypes = {
	value: PropTypes.number.isRequired,
};

Comment.propTypes = {
	value: PropTypes.string.isRequired,
};

CurrencyCode.propTypes = {
	value: PropTypes.string.isRequired,
};

export {
	KeyValueCell,
	Id,
	Email,
	GameName,
	ActionTypes,
	Amount,
	BonusMoney,
	Status,
	CreatedAt,
	NonCashAmount,
	CurrencyCode,
	PromotionTitle,
	Action,
	Comment,
	KeyValueCellNA,
	StatusData,
	Purpose,
	UserName,
	IsActive,
	KycStatus,
	WalletAmount,
};
