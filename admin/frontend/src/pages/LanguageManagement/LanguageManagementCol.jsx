import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap';

const Keys = ({ value }) => value ?? '';

const Action = ({ value }) => value ?? '';

const English = ({ cell }) => {
	const [tooltipOpen, setTooltipOpen] = useState(false);
	const toggle = () => setTooltipOpen(!tooltipOpen);

	return cell.value ? (
		<>
			<div id={`text-${cell?.row?.id}`} className="english-text">
				{cell.value}
			</div>
			<Tooltip
				target={`text-${cell?.row?.id}`}
				toggle={toggle}
				isOpen={tooltipOpen}
			>
				{cell.value}
			</Tooltip>
		</>
	) : (
		''
	);
};

English.propTypes = {
	cell: PropTypes.shape({
		value: PropTypes.string.isRequired,
		row: PropTypes.shape({
			id: PropTypes.number.isRequired,
		}).isRequired,
	}).isRequired,
};

export { Action, Keys, English };
