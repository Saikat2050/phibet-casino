/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// Form Editor
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw, ContentState, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import Select, { components } from 'react-select';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import {
	Label,
	Input,
	FormFeedback,
	Col,
	InputGroup,
	Button,
	InputGroupText,
	Tooltip,
} from 'reactstrap';

// import FlatPickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import moment from 'moment';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
// import { flatPickerFormat } from '../constants/config';

const { VITE_APP_AWS_GALLERY_URL } = import.meta.env;

export const CustomInputField = ({
	type,
	name,
	placeholder,
	value,
	onChange,
	onBlur,
	disabled,
	label,
	isError,
	invalid,
	validation,
	errorMsg,
	validate,
	min,
	max,
	description,
	isRequired,
	onDelete,
	maxDate,
	...props
}) => (
	<>
		{label && <Label className="form-label">{label}</Label>}
		{isRequired && label && <span className="text-danger"> *</span>}
		<Input
			name={name}
			type={type}
			label={label}
			value={value}
			disabled={disabled}
			validate={validate}
			onChange={onChange}
			onBlur={onBlur}
			invalid={invalid}
			placeholder={placeholder}
			minlength={min}
			maxlength={max}
			autoComplete="new-password"
			maxDate={maxDate}
			max={maxDate}
			{...props}
		/>

		{description && <span className="text-muted">{description}</span>}
		{isError && errorMsg ? (
			<FormFeedback type="invalid">{errorMsg}</FormFeedback>
		) : null}
	</>
);

export const CustomSelectField = ({
	type,
	name,
	placeholder,
	value,
	onChange,
	onBlur,
	disabled,
	label,
	options,
	handleBlur,
	multiple = false,
	isMulti = false,
	id,
	isError = false,
	errorMsg,
	description,
	dynamicDescription,
	validation,
	isRequired,
	...props
}) => (
	<>
		{label && <Label for={name}>{label}</Label>}
		{isRequired && label && <span className="text-danger"> *</span>}
		{isMulti ? (
			<Select
				name={name}
				value={value}
				isMulti
				onChange={onChange}
				className="select2-selection"
				options={options}
				placeholder={placeholder}
				isDisabled={disabled}
				{...props}
			/>
		) : (
			<Input
				id={id}
				type={type}
				name={name}
				value={value === '' ? '' : value} // To handle the select value null condition.
				onChange={onChange}
				disabled={disabled}
				multiple={multiple}
				placeholder={placeholder}
				onBlur={onBlur}
				{...props}
			>
				{options}
			</Input>
		)}
		{description && (
			<div>
				<span className="text-muted">{description}</span>{' '}
			</div>
		)}
		{dynamicDescription ? dynamicDescription(validation.values) : null}
		{isError && errorMsg ? (
			<FormFeedback type="invalid">{errorMsg}</FormFeedback>
		) : null}
	</>
);

const customStyles = {
	valueContainer: (base) => ({
		...base,
		display: 'flex',
		flexWrap: 'nowrap',
		overflow: 'hidden',
	}),
	multiValueLabel: (base) => ({
		...base,
		color: '#fff',
		backgroundColor: '#c48e48',
		borderRadius: '0px',
	}),
	multiValueRemove: (base) => ({
		...base,
		color: '#fff',
		backgroundColor: '#c48e48',
		padding: '4px 1px 4px 1px',
		borderRadius: '0px',
		':hover': {
			backgroundColor: '#FFBDAD',
			color: '#DE350B',
		},
	}),
};

const CheckboxOption = (props) => (
	<components.Option {...props}>
		<div style={{ display: 'flex', alignItems: 'start' }}>
			<input
				type="checkbox"
				checked={props?.isSelected}
				onChange={() => null}
				className="custom-checkbox"
			/>
			<label>{props?.label}</label>
		</div>
	</components.Option>
);

const MultiValue = (props) => {
	const { index, children, selectProps } = props;
	const visibleCount = 2; // Show 2 selected options
	const remainingCount = selectProps.value.length - visibleCount;

	if (index >= visibleCount) {
		return null;
	}

	return (
		<>
			<components.MultiValue {...props}>{children}</components.MultiValue>
			{index === visibleCount - 1 && remainingCount > 0 && (
				<span style={{ marginLeft: '5px' }}>+{remainingCount}</span>
			)}
		</>
	);
};

export const MultiSelectOption = ({
	options,
	label,
	value,
	setOption,
	isRequired,
}) => {
	const handleChange = (selected) => {
		setOption(selected);
	};

	return (
		<div className="container">
			{label && <label className="form-label">{label}</label>}
			{isRequired && label && <span className="text-danger"> *</span>}
			<Select
				options={options}
				isMulti
				hideSelectedOptions={false}
				closeMenuOnSelect={false}
				isSearchable={false}
				components={{
					Option: CheckboxOption,
					MultiValue,
					// MultiValueContainer,
					SingleValue: () => null,
				}}
				onChange={handleChange}
				value={value || []}
				styles={customStyles}
			/>
		</div>
	);
};

export const CustomDateField = ({
	name,
	label,
	placeholder,
	value,
	// eslint-disable-next-line no-unused-vars
	onChange = () => {}, // need for preventing code break
	isError,
	errorMsg,
	maxDate = 'today',
	minDate = moment().subtract(100, 'years').utc().toDate(),
	validation,
	isRequired,
}) => (
	<div id="datepicker1">
		{label && <Label for={name}>{label}</Label>}
		{isRequired && label && <span className="text-danger"> *</span>}
		<DatePicker
			className="form-control"
			selected={value ? new Date(value) : null}
			placeholderText={placeholder}
			dateFormat="yyyy-MM-dd"
			showMonthDropdown
			showYearDropdown
			dropdownMode="select"
			maxDate={maxDate === 'today' ? new Date() : maxDate}
			minDate={minDate}
			onChange={(date) => {
				validation.setFieldValue(
					name,
					date ? moment(date).startOf('day').format() : null
				);
			}}
		/>
		{/* <FlatPickr
			className="form-control"
			// name={name}
			date={value}
			value={value}
			placeholder={placeholder}
			options={{
				maxDate,
				dateFormat: flatPickerFormat,
			}}
			onChange={(date) => {
				validation.setFieldValue(
					name,
					new Date(date[0].getTime()) // end of selected date
				);
			}}
		/> */}
		{isError && errorMsg ? (
			<FormFeedback type="invalid" className="d-block">
				{errorMsg}
			</FormFeedback>
		) : null}
	</div>
);

export const CustomDateTime = ({
	name,
	label,
	placeholder,
	value,
	// eslint-disable-next-line no-unused-vars
	onChange = () => {}, // need for preventing code break
	onBlur,
	isError,
	errorMsg,
	maxDate = moment().utc().startOf('day').toDate(),
	minDate = moment().subtract(100, 'years').utc().toDate(),
	validation,
	minDateField,
	isRequired,
	dateFormat = 'MMMM d, yyyy h:mm aa',
	...rest
}) => (
	<div id="datepicker1">
		{label && <Label for={name}>{label}</Label>}
		{isRequired && label && <span className="text-danger"> *</span>}
		<DatePicker
			className="form-control"
			// name={name}
			selected={value}
			placeholderText={placeholder}
			showTimeSelect
			dateFormat={dateFormat}
			onChange={(date) => {
				validation.setFieldValue(name, date);
			}}
			monthsShown={1}
			maxDate={maxDate}
			minDate={minDate}
			{...rest}
		/>
		{isError && errorMsg ? (
			<FormFeedback type="invalid" className="d-block">
				{errorMsg}
			</FormFeedback>
		) : null}
	</div>
);

export const CustomTimePicker = ({
	name,
	label,
	placeholder,
	value,
	isError,
	errorMsg,
	validation,
	isRequired,
	dateFormat = 'HH:mm',
	timeFormat = 'HH:mm',
}) => {
	const selectedValue =
		value && typeof value === 'string'
			? new Date(`1970-01-01T${value}:00`)
			: null;

	return (
		<div id="timepicker1">
			{label && <Label for={name}>{label}</Label>}
			{isRequired && label && <span className="text-danger"> *</span>}
			<DatePicker
				className="form-control"
				selected={selectedValue}
				placeholderText={placeholder}
				showTimeSelect
				showTimeSelectOnly
				timeIntervals={15}
				timeFormat={timeFormat}
				dateFormat={dateFormat}
				onChange={(time) => {
					const formattedTime = time.toLocaleTimeString('en-GB', {
						hour: '2-digit',
						minute: '2-digit',
						hour24: true,
					});
					validation.setFieldValue(name, formattedTime);
				}}
			/>

			{isError && errorMsg ? (
				<FormFeedback type="invalid" className="d-block">
					{errorMsg}
				</FormFeedback>
			) : null}
		</div>
	);
};

export const CustomRangeSelector = ({
	name,
	label,
	placeholder,
	value = [],
	rangeKeys = ['fromDate', 'toDate'],
	// eslint-disable-next-line no-unused-vars
	onChange = () => {}, // need for preventing code break
	isError,
	errorMsg,
	maxDate = moment().utc().startOf('day').toDate(),
	minDate = moment().subtract(100, 'years').utc().toDate(),
	validation,
	customInputClass,
	isRequired,
	showTimeSelect = false,
	dateFormat = 'dd/MM/yyyy',
	...rest
}) => (
	<div id="datepicker1">
		{label && <Label for={name}>{label}</Label>}
		{isRequired && label && <span className="text-danger"> *</span>}
		<DatePicker
			selectsRange
			className={`form-control ${isError && errorMsg && 'border-danger'}`}
			selected={value[0]}
			placeholderText={placeholder}
			showTimeSelect={showTimeSelect}
			dateFormat={dateFormat}
			showMonthDropdown
			showYearDropdown
			dropdownMode="select"
			onChange={(dates) => {
				const [start, end] = dates;

				if (start && end) {
					const sortedDates = [start, end].sort((a, b) => a - b);
					validation.setFieldValue(
						rangeKeys[0],
						moment(sortedDates[0]).startOf('day').format()
					);
					validation.setFieldValue(
						rangeKeys[1],
						moment(sortedDates[1]).endOf('day').format()
					);
				} else if (!start && !end) {
					validation.setFieldValue(rangeKeys[0], null);
					validation.setFieldValue(rangeKeys[1], null);
				} else {
					validation.setFieldValue(
						rangeKeys[0],
						moment(start).startOf('day').format()
					);
					validation.setFieldValue(rangeKeys[1], null);
				}
			}}
			maxDate={maxDate}
			minDate={minDate}
			startDate={value[0]}
			endDate={value[1]}
			{...rest}
			ref={(el) => {
				if (el) {
					el.input.addEventListener('keydown', (e) => e.preventDefault()); // Block typing
				}
			}}
		/>
		{isError && errorMsg ? (
			<FormFeedback type="invalid" className="d-block">
				{errorMsg}
			</FormFeedback>
		) : null}
	</div>
);

export const KeyValueInput = ({ onChange, tooltipMessage }) => {
	const [showInputs, setShowInputs] = useState(false);
	const [key, setKey] = useState('');
	const [value, setValue] = useState('');
	const [error, setError] = useState('');
	const [tooltipOpen, setTooltipOpen] = useState(false);

	const handleAddClick = () => {
		setShowInputs(true);
	};

	const handleKeyChange = (e) => {
		setKey(e.target.value);
		setError(null);
	};

	const handleValueChange = (e) => {
		setValue(e.target.value);
		setError(null);
	};

	const handleSubmit = () => {
		if (key && value) {
			onChange({ key, value });
			setShowInputs(false);
			setKey(null);
			setValue(null);
			setError('');
		} else {
			setError('Key & Value are required.');
		}
	};

	const toggleTooltip = () => {
		setTooltipOpen(!tooltipOpen);
	};

	return (
		<>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				{showInputs ? (
					<>
						<Input
							type="text"
							placeholder="Enter key"
							value={key}
							onChange={handleKeyChange}
							style={{ marginRight: '8px' }}
						/>
						<Input
							type="text"
							placeholder="Enter value"
							value={value}
							onChange={handleValueChange}
							style={{ marginRight: '8px' }}
						/>
						<Button
							style={{ backgroundColor: '#c48e48' }}
							type="button"
							onClick={handleSubmit}
						>
							Add
						</Button>
					</>
				) : (
					<>
						<Button
							id="AddButton"
							className="add-button"
							type="button"
							onClick={handleAddClick}
						>
							{}
						</Button>
						<Tooltip
							placement="top"
							isOpen={tooltipOpen}
							target="AddButton"
							toggle={toggleTooltip}
						>
							{tooltipMessage ?? 'Create a new field'}
						</Tooltip>
					</>
				)}
			</div>
			{error && (
				<FormFeedback type="invalid" className="d-block">
					{error}
				</FormFeedback>
			)}
		</>
	);
};
export const CustomSwitchButton = ({
	label,
	labelClassName,
	htmlFor,
	type,
	id,
	name,
	inputClassName,
	value,
	onClick,
	onBlur,
	style,
	checked,
	isError,
	errorMsg,
	disabled,
	switchSpanClass,
	...rest
}) => (
	<span className={`form-check form-check-inline ${switchSpanClass || ''}`}>
		{label && (
			<Label
				htmlFor={htmlFor}
				className={labelClassName}
				style={{ paddingTop: 2 }}
			>
				{label}
			</Label>
		)}
		<Input
			type={type}
			id={id}
			name={name}
			className={inputClassName}
			value={value}
			onClick={onClick}
			onBlur={onBlur}
			style={{ padding: 8, marginRight: 16, ...(style || {}) }}
			checked={checked}
			disabled={disabled}
			{...rest}
		/>
		{isError && errorMsg ? (
			<FormFeedback type="invalid" className="d-block">
				{errorMsg}
			</FormFeedback>
		) : null}
	</span>
);

export const CustomRadioButton = ({
	label,
	labelClassName,
	htmlFor,
	type,
	id,
	name,
	inputClassName,
	value,
	onClick,
	onBlur,
	style,
	checked,
	isError,
	errorMsg,
	disabled,
	switchSpanClass,
	...rest
}) => (
	<span className={`form-check form-check-inline ${switchSpanClass || ''}`}>
		{label && (
			<Label
				htmlFor={htmlFor}
				className={labelClassName}
				style={{ paddingTop: 2 }}
			>
				{label}
			</Label>
		)}
		<Input
			type={type}
			id={id}
			name={name}
			className={inputClassName}
			value={value}
			onClick={onClick}
			onBlur={onBlur}
			style={{ padding: 8, marginRight: 16, ...(style || {}) }}
			checked={checked}
			disabled={disabled}
			{...rest}
		/>
		{isError && errorMsg ? (
			<FormFeedback type="invalid" className="d-block">
				{errorMsg}
			</FormFeedback>
		) : null}
	</span>
);
export const CustomButtonGroup = ({
	label,
	labelClassName,
	htmlFor,
	type,
	id,
	name,
	inputClassName,
	value,
	onClick,
	onBlur,
	style,
	checked,
	isError,
	errorMsg,
	disabled,
	outerDivClass,
	...rest
}) => (
	<>
		<Input
			type={type}
			id={id}
			name={name}
			className={inputClassName}
			value={value}
			onClick={onClick}
			onBlur={onBlur}
			style={style}
			checked={checked}
			disabled={disabled}
			{...rest}
		/>
		{label && (
			<Label htmlFor={htmlFor} className={labelClassName} onClick={onClick}>
				{label}
			</Label>
		)}
		{isError && errorMsg ? (
			<FormFeedback type="invalid">{errorMsg}</FormFeedback>
		) : null}
	</>
);

export const CustomToggleButton = ({
	label,
	labelClassName,
	htmlFor,
	type,
	id,
	name,
	inputClassName,
	value,
	onClick,
	onBlur,
	style,
	checked,
	isError,
	errorMsg,
	disabled,
	containerClass,
	switchSizeClass,
	required,
	description,
	topDescription,
	...rest
}) => (
	<>
		{topDescription && (
			<div>
				<span className="text-muted">{topDescription}</span>{' '}
			</div>
		)}
		<span
			style={{ pointerEvents: disabled ? 'none' : 'auto' }}
			className={`form-check form-switch ${
				switchSizeClass || 'form-switch-md'
			} ${containerClass || 'mb-3 mt-3'}`}
		>
			{required
				? label && (
						<div>
							<Label htmlFor={htmlFor} className={labelClassName}>
								{label}
							</Label>{' '}
							<span className="text-danger"> *</span>
						</div>
				  )
				: label && (
						<Label htmlFor={htmlFor} className={labelClassName}>
							{label}
						</Label>
				  )}
			<Input
				type={type}
				id={id}
				name={name}
				className={inputClassName}
				value={value}
				onClick={onClick}
				onBlur={onBlur}
				style={style}
				checked={checked}
				disabled={disabled}
				{...rest}
			/>
			{isError && errorMsg ? (
				<FormFeedback type="invalid">{errorMsg}</FormFeedback>
			) : null}
		</span>
		{description && (
			<div>
				<span className="text-muted">{description}</span>{' '}
			</div>
		)}
	</>
);

export const CustomTextEditor = ({
	name,
	label,
	isError,
	errorMsg,
	validation,
	placeholder,
	value,
	defaultValue,
	onValueChange = () => {},
	readOnly,
	isRequired,
}) => {
	const prepareDraft = (editorValue) => {
		const draft = htmlToDraft(editorValue);
		const contentState = ContentState.createFromBlockArray(draft.contentBlocks);
		const editorState = EditorState.createWithContent(contentState);
		return editorState;
	};

	const [editorState, setEditorState] = useState(
		value ? prepareDraft(value) : EditorState.createEmpty()
	);

	useEffect(() => {
		if (defaultValue) {
			setEditorState(prepareDraft(defaultValue));
		}
	}, [defaultValue]);

	const onEditorStateChange = (editorStateIns) => {
		setEditorState(editorStateIns);
		const forFormik = draftToHtml(
			convertToRaw(editorStateIns.getCurrentContent())
		);
		if (validation) {
			validation.setFieldValue(
				name,
				editorStateIns.getCurrentContent().hasText() ? forFormik : ''
			);
		}
		onValueChange(
			editorStateIns.getCurrentContent().hasText() ? forFormik : ''
		);
		setEditorState(editorStateIns);
	};

	return (
		<>
			{label && <Label className="form-label">{label}</Label>}
			{isRequired && <span className="text-danger"> *</span>}
			<Editor
				placeholder={placeholder}
				toolbarClassName="toolbarClassName"
				wrapperClassName="wrapperClassName"
				editorClassName="editorClassName"
				editorState={editorState}
				onEditorStateChange={onEditorStateChange}
				readOnly={readOnly}
			/>
			{isError && errorMsg ? (
				<FormFeedback type="invalid" className="d-block">
					{errorMsg}
				</FormFeedback>
			) : null}
		</>
	);
};

export const getField = (
	{
		fieldType,
		optionList,
		optionsLabel,
		multiSelectOption,
		name,
		placeholder,
		label,
		callBack,
		customBlurHandler,
		isDisabled,
		onDelete,
		type = 'text',
		minDate,
		minDateField,
		maxDate,
		showThumbnail,
		multiple = false,
		levelIndex,
		levelFieldName,
		minimum,
		maximum,
		adornmentText,
		namesArray,
		isRequired,
		icon,
		defaultValue,
		customThumbnailBackground,
		customPadding,
		description,
		countryCodes,
		rangeKeys,
		topDescription,
		labelClass,
		inputClassName,
		outerDivClass,
		customInputClass,
		dynamicDescription,
		onchange,
		tooltipMessage,
		switchSpanClass,
		...rest
	},
	validation
) => {
	switch (fieldType) {
		case 'textField':
			return (
				<CustomInputField
					label={label}
					name={name}
					type={type}
					onChange={(e) => {
						validation.handleChange(e);
						callBack ? callBack(e) : null;
					}}
					onBlur={(e) => {
						validation.handleBlur(e);
						customBlurHandler ? customBlurHandler(e) : null;
					}}
					placeholder={placeholder}
					validate={{ required: { value: true } }}
					value={validation.values[name]}
					invalid={!!(validation.touched[name] && validation.errors[name])}
					isError
					errorMsg={validation.touched[name] && validation.errors[name]}
					disabled={!!isDisabled}
					min={minimum}
					max={maximum}
					description={description}
					isRequired={isRequired}
					onDelete={onDelete}
				/>
			);
		case 'select':
			return (
				<CustomSelectField
					label={label}
					name={name}
					isMulti={multiple}
					isRequired={isRequired}
					type="select"
					onChange={(e) => {
						if (multiple) {
							callBack && callBack(e);
						} else {
							validation.handleChange(e);
							callBack && callBack(e);
						}
					}}
					onBlur={validation.handleBlur}
					placeholder={placeholder}
					validate={{ required: { value: true } }}
					value={validation.values[name]}
					key={`my_unique_select_key__${validation.values[name]}`}
					invalid={!!(validation.touched[name] && validation.errors[name])}
					isError
					errorMsg={validation.touched[name] && validation.errors[name]}
					options={
						multiSelectOption || (
							<>
								<option value={null} selected disabled>
									{optionsLabel || placeholder}
								</option>
								{optionList?.map(({ optionLabel, value }) => (
									<option key={value} value={value}>
										{optionLabel}
									</option>
								))}
							</>
						)
					}
					disabled={!!isDisabled}
					description={description}
					dynamicDescription={dynamicDescription}
					validation={validation}
				/>
			);
		case 'MultiSelectOptions':
			return (
				<MultiSelectOption
					label={label}
					options={multiSelectOption}
					value={validation.values[name]}
					setOption={(selected) => {
						validation.setFieldValue(name, selected);
					}}
				/>
			);
		case 'switch':
			return (
				<CustomSwitchButton
					labelClassName="form-check-label "
					label={label}
					htmlFor={`radio${name}`}
					type="switch"
					id={`radio${name}`}
					value={!!validation?.values?.[name]}
					name={name}
					checked={!!validation?.values?.[name]}
					inputClassName="form-check-input"
					onClick={() =>
						validation.setFieldValue(name, !validation.values[name])
					}
					onBlur={validation.handleBlur}
					disabled={!!isDisabled}
					switchSpanClass={switchSpanClass}
				/>
			);
		case 'toggle':
			return (
				<CustomToggleButton
					labelClassName="form-check-label"
					label={label}
					htmlFor={`switch${name}`}
					id={`switch${name}`}
					type="checkbox"
					name={name}
					checked={!!validation.values[name]}
					inputClassName="form-check-input"
					value={!!validation.values[name]}
					onClick={(e) => {
						callBack && callBack(e);

						validation.setFieldValue(name, !e.target.checked);
					}}
					onBlur={validation.handleBlur}
					disabled={!!isDisabled}
					required={isRequired}
					description={description}
					topDescription={topDescription}
					{...rest}
				/>
			);
		case 'datePicker':
			return (
				<CustomDateField
					name={name}
					label={label}
					placeholder={placeholder}
					value={validation.values[name]}
					onChange={validation.onChange}
					isError
					invalid={!!(validation.touched[name] && validation.errors[name])}
					errorMsg={validation.touched[name] && validation.errors[name]}
					disabled={!!isDisabled}
					maxDate={maxDate}
					minDate={minDate}
					validation={validation}
					minDateField={minDateField}
					isRequired={isRequired}
				/>
			);
		case 'dateTimePicker':
			return (
				<CustomDateTime
					name={name}
					label={label}
					placeholder={placeholder}
					value={validation.values[name]}
					onChange={validation.onChange}
					isError
					invalid={!!(validation.touched[name] && validation.errors[name])}
					errorMsg={validation.touched[name] && validation.errors[name]}
					disabled={!!isDisabled}
					maxDate={maxDate}
					minDate={minDate}
					validation={validation}
					minDateField={minDateField}
					isRequired={isRequired}
				/>
			);
		case 'timePicker':
			return (
				<CustomTimePicker
					name={name}
					label={label}
					placeholder={placeholder}
					value={validation.values[name]}
					onChange={validation.onChange}
					isError
					invalid={!!(validation.touched[name] && validation.errors[name])}
					errorMsg={validation.touched[name] && validation.errors[name]}
					disabled={!!isDisabled}
					validation={validation}
					isRequired={isRequired}
				/>
			);
		case 'dateRangeSelector': {
			const [starKey = 'fromDate', endKey = 'toDate'] = rangeKeys || [];

			const isError =
				validation.touched[starKey] && validation.errors[starKey]
					? validation.errors[starKey]
					: validation.touched[endKey] && validation.errors[endKey]
					? validation.errors[endKey]
					: null;

			return (
				<CustomRangeSelector
					name={name}
					label={label}
					placeholder={placeholder}
					value={[
						validation.values[rangeKeys?.[0] || 'fromDate']
							? new Date(validation.values[rangeKeys?.[0] || 'fromDate'])
							: '',
						validation.values[rangeKeys?.[1] || 'toDate']
							? new Date(validation.values[rangeKeys?.[1] || 'toDate'])
							: '',
					]}
					onChange={validation.onChange}
					isError
					invalid={!!isError}
					errorMsg={validation.touched[name] && validation.errors[name]}
					disabled={!!isDisabled}
					maxDate={maxDate}
					minDate={minDate}
					validation={validation}
					rangeKeys={rangeKeys}
					customInputClass={customInputClass}
					isRequired={isRequired}
				/>
			);
		}
		case 'file':
			return (
				<>
					<CustomInputField
						label={label}
						id="file"
						name={name}
						type="file"
						onChange={(event) => {
							validation.setFieldValue(name, event.currentTarget.files[0]);
							callBack && callBack(event);
						}}
						callBack
						onBlur={validation.handleBlur}
						placeholder={placeholder}
						validate={{ required: { value: true } }}
						invalid={!!(validation.touched[name] && validation.errors[name])}
						disabled={!!isDisabled}
						isError
						errorMsg={validation.touched[name] && validation.errors[name]}
						isRequired={isRequired}
					/>
					{showThumbnail && validation.values[name] && (
						<img
							style={{
								marginTop: 10,
								backgroundColor: '#c0c0c0',
								padding: customPadding,
								display: 'inline-block',
							}}
							width={100}
							src={
								// eslint-disable-next-line no-nested-ternary
								typeof validation.values[name] === 'string'
									? validation.values[name]?.includes('http')
										? validation.values[name]
										: `${VITE_APP_AWS_GALLERY_URL}${validation.values[name]}`
									: URL.createObjectURL(validation.values[name])
							}
							alt="Not found"
						/>
					)}
				</>
			);
		case 'textEditor':
			return (
				<CustomTextEditor
					defaultValue={defaultValue}
					label={label}
					name={name}
					placeholder={placeholder}
					isError
					errorMsg={validation.touched[name] && validation.errors[name]}
					validation={validation}
					value={validation.values[name]}
					isRequired={isRequired}
				/>
			);
		case 'loyaltyRangeField':
			return (
				<CustomInputField
					label={label}
					name={name}
					type={type}
					onChange={validation.handleChange}
					onBlur={validation.handleBlur}
					placeholder={placeholder}
					validate={{ required: { value: true } }}
					value={validation.values?.loyaltyLevel[levelIndex][levelFieldName]}
					invalid={
						!!(
							validation.touched?.loyaltyLevel &&
							validation.errors?.loyaltyLevel?.[levelIndex]?.[levelFieldName]
						)
					}
					isError
					errorMsg={
						validation.touched?.loyaltyLevel &&
						validation.errors?.loyaltyLevel?.[levelIndex]?.[levelFieldName]
					}
					disabled={!!isDisabled}
					min={minimum}
					max={maximum}
				/>
			);
		case 'buttonGroup':
			return (
				<>
					{label && (
						<Label for={name}>
							{label}
							<span className="text-danger"> *</span>
						</Label>
					)}
					<div className="btn-group">
						{!!optionList.length &&
							optionList.map((option) => (
								<CustomButtonGroup
									labelClassName={labelClass || 'form-check-label'}
									label={option.optionLabel}
									htmlFor={`customRadioInline${option.value}`}
									type="switch"
									id={`customRadioInline${option.value}`}
									value={!!validation?.values?.[name]}
									name={name}
									checked={validation.values[name] === option.value}
									inputClassName={inputClassName || 'form-check-input'}
									onClick={() => {
										validation.setFieldValue(name, option.value);
									}}
									onBlur={validation.handleBlur}
									disabled={!!isDisabled}
									outerDivClass={outerDivClass}
								/>
							))}
					</div>
				</>
			);
		case 'inputGroup':
			return Object.keys(validation?.values?.name || {}).map((item) => (
				<div className="d-flex align-items-center mt-1" key={item}>
					<Col>
						<Col className="d-flex">
							<InputGroup>
								<InputGroupText>{item}</InputGroupText>
								<CustomInputField
									name={`name[${item}]`}
									placeholder={placeholder}
									value={validation?.values?.name?.[item]}
									onChange={validation.handleChange}
									onBlur={validation.handleBlur}
									invalid={
										!!(
											validation.touched?.name?.[item] &&
											validation.errors?.name?.[item]
										)
									}
									isError
									errorMsg={
										validation.touched?.name?.[item] &&
										validation.errors?.name?.[item]
									}
								/>
							</InputGroup>
							<div>
								<Button
									className="btn-danger"
									disabled={item === 'EN'}
									onClick={() => onDelete(item)}
								>
									<i className="mdi mdi-trash-can-outline" />
								</Button>
							</div>
						</Col>
						{/* {validation?.touched?.name?.[item] && validation?.errors?.name?.[item] && <FormFeedback type="invalid">ERROR</FormFeedback>} */}
					</Col>
				</div>
			));
		case 'radioGroup':
			return (
				<>
					{label && <Label for={name}>{label}</Label>}
					{isRequired && label && <span className="text-danger"> *</span>}
					<div>
						{!!optionList.length &&
							optionList.map((option) => (
								<CustomRadioButton
									labelClassName="form-check-label"
									label={option.optionLabel}
									htmlFor={`customRadioInline${option.value}`}
									type="radio"
									id={`customRadioInline${option.value}`}
									value={!!validation.values[name]}
									name={name}
									checked={!!(validation.values[name] === option.value)}
									inputClassName="form-check-input"
									onClick={() => validation.setFieldValue(name, option.value)}
									onBlur={validation.handleBlur}
									disabled={!!isDisabled}
								/>
							))}
						{validation.touched[name] && validation.errors[name] ? (
							<FormFeedback type="invalid" className="d-block">
								{validation.errors[name]}
							</FormFeedback>
						) : null}
					</div>
				</>
			);
		case 'radioGroupMulti':
			return (
				<>
					{label && (
						<div className="d-flex align-items-center mb-2 gap-2">
							<Label className="my-0" for={name}>
								{label}
							</Label>
							{isRequired && label && <span className="text-danger"> *</span>}
							<CustomSwitchButton
								labelClassName="form-check-label"
								label=""
								htmlFor={label}
								type="switch"
								id={label}
								name="select-all"
								checked={
									!!(validation.values?.[name]?.length === optionList.length)
								}
								inputClassName="form-check-input"
								onClick={() => {
									validation.setFieldValue(
										name,
										validation.values?.[name]?.length === optionList.length
											? []
											: optionList.map((option) => option.value)
									);
								}}
								onBlur={validation.handleBlur}
								disabled={!!isDisabled}
							/>
						</div>
					)}
					<div>
						{!!optionList.length &&
							optionList.map((option) => (
								<CustomSwitchButton
									labelClassName="form-check-label"
									label={option.optionLabel}
									htmlFor={`customRadioInline${option.value}`}
									type="switch"
									id={`customRadioInline${option.value}`}
									name={option.value}
									checked={
										!!(
											validation.values?.[name] &&
											validation.values?.[name].includes(option.value)
										)
									}
									inputClassName="form-check-input"
									onClick={(e) => {
										if (!validation.values[name].includes(e.target.name)) {
											validation.values?.[name]?.length
												? validation.setFieldValue(name, [
														...validation.values[name],
														e.target.name,
												  ])
												: validation.setFieldValue(name, [e.target.name]);
										} else {
											validation.setFieldValue(
												name,
												validation.values[name].filter(
													(value) => value !== e.target.name
												)
											);
										}
									}}
									onBlur={validation.handleBlur}
									disabled={!!isDisabled}
								/>
							))}
					</div>
					{validation.touched[name] && validation.errors[name] ? (
						<FormFeedback type="invalid" className="d-block">
							{validation.errors[name]}
						</FormFeedback>
					) : null}
				</>
			);
		case 'textfieldWithAdornment':
			return (
				<>
					{label && <Label for={name}>{label}</Label>}
					{isRequired && label && <span className="text-danger"> *</span>}
					<CustomInputField
						type={type}
						name={name}
						placeholder={placeholder}
						value={validation?.values?.[name]}
						onChange={validation.handleChange}
						onBlur={validation.handleBlur}
						min={minimum}
						max={maximum}
						invalid={
							!!(validation.touched?.[name] && validation.errors?.[name])
						}
						isError
						errorMsg={validation.touched?.[name] && validation.errors?.[name]}
					/>
				</>
			);
		case 'password': {
			const [showPassword, setShowPassword] = useState(false);

			return (
				<>
					{label && <Label for={name}>{label}</Label>}
					<InputGroup>
						<Input
							type={showPassword ? 'text' : 'password'}
							name={name}
							placeholder={placeholder}
							value={validation?.values?.[name]}
							onChange={validation.handleChange}
							onBlur={validation.handleBlur}
							invalid={
								!!(validation.touched?.[name] && validation.errors?.[name])
							}
						/>
						<InputGroupText
							className="password-btn btn btn-primary font-size-14"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? (
								<i className="mdi mdi-eye-outline" />
							) : (
								<i className="mdi mdi-eye-off-outline" />
							)}
						</InputGroupText>
					</InputGroup>
					{validation.touched?.[name] && validation.errors?.[name] ? (
						<FormFeedback type="invalid" className="d-block">
							{validation.touched?.[name] && validation.errors?.[name]}
						</FormFeedback>
					) : null}
				</>
			);
		}

		case 'phone':
			return (
				<>
					{label && <Label for={name}>{label}</Label>}
					{isRequired && label && <span className="text-danger"> *</span>}
					<PhoneInput
						masks={countryCodes}
						name={namesArray?.[0]}
						type="text"
						alwaysDefaultMask={false}
						enableSearch
						placeholder={placeholder}
						enableLongNumbers
						value={`${validation?.values?.[namesArray?.[1]] || '+1'}${
							validation?.values?.[namesArray?.[0]] || ''
						}`}
						country="us"
						isValid={(value, country) => {
							if (
								validation?.touched?.[namesArray?.[0]] &&
								(value?.charAt(country?.dialCode.length) === '0' ||
									country?.format?.replace(/[+ ()-]/g, '').length !==
										value?.length)
							) {
								return '';
								// validation?.setFieldError(namesArray?.[0], 'Invalid Phone')
							}
							return true;
						}}
						onChange={(phone, code) => {
							const codeString = String(code?.dialCode);
							const newPhone = phone.substring(codeString.length);
							const newCode = `+${codeString}`;
							validation?.setFieldValue(namesArray?.[0], newPhone);
							validation?.setFieldValue(namesArray?.[1], newCode);
						}}
						onBlur={() => validation?.setFieldTouched(namesArray?.[0], true)}
						// buttonStyle={{ backgroundColor: '#22214b' }}
						inputStyle={{ width: '100%' }}
					/>
					{validation.touched?.[name] && validation.errors?.[name] ? (
						<FormFeedback type="invalid" className="d-block">
							{validation.touched?.[name] && validation.errors?.[name]}
						</FormFeedback>
					) : null}
				</>
			);
		case 'addKeyValue':
			return (
				<KeyValueInput onChange={callBack} tooltipMessage={tooltipMessage} />
			);

		default:
			return <div />;
	}
};
