/* eslint-disable no-else-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable react/prop-types */

import React from 'react';
import uuid from 'react-uuid';
import { UncontrolledTooltip } from 'reactstrap';
import { isObject } from '../../utils/helpers';

const TextField = ({ value }) => value ?? '-';

const Name = ({ val }) => {
	const uKey = uuid();
	return (
		<div className="text-ellipsis">
			{Object.keys(val).length === 0 ? (
				<div>-</div>
			) : (
				Object.entries(val).map(([key, value], idx) => {
					const tooltipId = `tooltip-${uKey}-${key}-${idx}`;

					const isEmptyObject =
						isObject(value) && Object.keys(value).length === 0;
					const isEmptyArray = Array.isArray(value) && value.length === 0;
					const isNullish = value === null || value === undefined;
					const shouldShowNull = isNullish || isEmptyObject || isEmptyArray;

					if ((isObject(value) || Array.isArray(value)) && !shouldShowNull) {
						return (
							<div
								key={tooltipId}
								className="relative group inline-block cursor-pointer"
							>
								<div className="d-flex align-items-center">
									<div>{key}</div>
									<span id={tooltipId} style={{ marginLeft: '5px' }}>
										<i className="fa fa-info-circle" />
									</span>
								</div>
								<UncontrolledTooltip placement="right" target={tooltipId}>
									{shouldShowNull ? '-' : JSON.stringify(value)}
								</UncontrolledTooltip>
							</div>
						);
					} else {
						return (
							<div key={tooltipId}>{`${key}: ${
								shouldShowNull ? '-' : value
							}`}</div>
						);
					}
				})
			)}
		</div>
	);
};
export { TextField, Name };
