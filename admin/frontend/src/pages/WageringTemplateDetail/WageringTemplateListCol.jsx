/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { CustomSwitchButton } from '../../helpers/customForms';
import { selectedLanguage } from '../../constants/config';

const WageringTemplateId = ({ cell }) => cell.value ?? '';

const TemplateName = ({ cell }) => cell.value?.[selectedLanguage] ?? '-';

const RTP = ({ cell }) => (cell?.value ? ` ${cell?.value} %` : '-');

const WageringContribution = ({ cell }) =>
	`${cell?.value ? cell?.value : 100} %`;

const CustomValues = ({ cell }) => (cell?.value ? `${cell?.value}` : '-');

const WagerMultiplier = ({ cell }) => (cell?.value ? `${cell?.value}` : '-');

const Select = ({ cell, handleChange, selectedId }) => {
	const value = selectedId[cell.row.original.id] || false;
	return (
		<CustomSwitchButton
			labelClassName="form-check-label"
			htmlFor="customRadioInline1"
			type="switch"
			id="customRadioInline1"
			name="select"
			inputClassName="form-check-input"
			checked={value}
			value={value}
			onClick={(e) => handleChange(e, cell)}
		/>
	);
};

WageringTemplateId.propTypes = {
	cell: PropTypes.shape({
		value: PropTypes.number.isRequired,
	}).isRequired,
};

export {
	WageringTemplateId,
	TemplateName,
	RTP,
	WageringContribution,
	CustomValues,
	Select,
	WagerMultiplier,
};
