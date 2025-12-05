/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import Select, { components } from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';

const customStyles = {
	multiValueLabel: (base) => ({
		...base,
		color: '#fff',
		backgroundColor: '#c48e48',
	}),
	multiValueRemove: (base) => ({
		...base,
		color: '#fff',
		backgroundColor: '#c48e48',
	}),
};

const options = [
	{ value: 'casino', label: 'Casino' },
	// { value: 'sportsbook', label: 'SportsBook' },
];

const CheckboxOption = (props) => (
	<components.Option {...props}>
		<div style={{ display: 'flex', alignItems: 'start' }}>
			<input
				type="checkbox"
				checked={props.isSelected}
				onChange={() => null}
				className="custom-checkbox"
			/>
			<label>{props.label}</label>
		</div>
	</components.Option>
);
const MultiSelect = ({ label, filters, setFilters }) => {
	const handleChange = (selected) => {
		setFilters((prev) => ({ ...prev, categories: selected }));
	};

	return (
		<div className="container">
			{label ? <h5>{label}</h5> : null}
			<Select
				options={options}
				isMulti
				closeMenuOnSelect={false}
				hideSelectedOptions={false}
				components={{ Option: CheckboxOption }}
				onChange={handleChange}
				value={filters?.categories || []}
				styles={customStyles}
			/>
		</div>
	);
};

export default MultiSelect;
