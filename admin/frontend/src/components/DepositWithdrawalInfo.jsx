/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { addCommasToNumber } from '../utils/helpers';

const DepositWithdrawalInfo = ({ values }) => (
	<div className="d-flex">
		{values?.map(({ label, value, type }) => {
			const numericValue = Number(value || 0);
			const isNegative = numericValue < 0;
			return (
				<div
					className={`badge ${
						type === 'in' ? 'bg-success-subtle' : 'bg-danger-subtle'
					} text-dark p-3 fs-4 rounded-4 me-3`}
				>
					<h6 className="mb-0 font-weight-bold">
						<span
							className={`${
								isNegative
									? 'text-danger'
									: type === 'in'
									? 'text-success'
									: 'text-danger'
							}`}
							// className={`${type === 'in' ? 'text-success' : 'text-danger'}`}
						>
							{label} :{' '}
						</span>{' '}
						{addCommasToNumber(Number(value || 0)?.toFixed(2))}
					</h6>
				</div>
			);
		})}
	</div>
);

export default DepositWithdrawalInfo;

DepositWithdrawalInfo.propTypes = {
	values: PropTypes.arrayOf(PropTypes.string).isRequired,
};
