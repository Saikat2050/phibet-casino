/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Badge, Button } from 'reactstrap';

const SelectedFilters = ({
	validation,
	filterFormatter,
	handleResetCallback,
}) => {
	const clearFilter = (filterName) => {
		validation.setFieldValue(filterName, '');
	};
	const hasFilters = Object.keys(validation.values || {}).some(
		(value) => validation.values[value]
	);

	return (
		<div
			className={`${
				hasFilters ? 'm-2' : 'm-0'
			} w-full d-flex align-items-center flex-wrap gap-1`}
		>
			{Object.keys(validation.values || {}).map((filterName) => {
				if (validation.values[filterName]) {
					return (
						<Badge
							key={filterName}
							className="me-2 p-2 fs-6 d-flex align-items-center"
							style={{ cursor: 'pointer', maxWidth: '250px' }}
						>
							<span
								style={{
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									flex: '1',
								}}
							>
								{filterFormatter
									? filterFormatter(filterName, validation.values[filterName])
									: `${filterName}: ${validation.values[filterName]}`}
							</span>
							<i
								className="mdi mdi-close ms-1"
								onClick={() => clearFilter(filterName)}
								style={{ flexShrink: 0 }}
							/>
						</Badge>
					);
				}
				return null;
			})}
			{hasFilters ? (
				<Button
					color="link"
					className="btn btn-link waves-effect"
					onClick={() => {
						if (handleResetCallback) {
							handleResetCallback();
						} else {
							validation.resetForm();
						}
					}}
				>
					Clear all
				</Button>
			) : null}
		</div>
	);
};

export default SelectedFilters;
