/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Input } from 'reactstrap';

const TableSearchInput = ({
	validation,
	placeholder,
	searchInputName = 'searchString',
}) => (
	<div className="filter-search me-2">
		<div className="position-relative">
			<Input
				type="text"
				value={validation.values[searchInputName]}
				className="form-control border-0"
				placeholder={placeholder || 'Search...'}
				onChange={(e) =>
					validation.setFieldValue(searchInputName, e.target.value)
				}
			/>
			<i
				className="bx bx-search-alt search-icon"
				style={{
					position: 'absolute',
					left: '10px',
					top: '50%',
					transform: 'translateY(-50%)',
				}}
			/>

			{validation.values[searchInputName] && (
				<i
					className="mdi mdi-close clear-icon"
					style={{
						position: 'absolute',
						right: '10px',
						top: '50%',
						transform: 'translateY(-50%)',
						cursor: 'pointer',
					}}
					onClick={() => validation.setFieldValue(searchInputName, '')}
				/>
			)}
		</div>
	</div>
);

export default TableSearchInput;
