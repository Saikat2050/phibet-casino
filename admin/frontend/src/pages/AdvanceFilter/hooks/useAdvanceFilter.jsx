/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import {
	fetchCountriesStart,
	fetchSegmentationConstants,
	resetAdvanceFilter,
} from '../../../store/actions';
import {
	CustomInputField,
	CustomSelectField,
	CustomToggleButton,
} from '../../../helpers/customForms';
import {
	dateTypeFelid,
	DEVICE_TYPE_OPTIONS,
	FIELD_TYPES,
	GENDER_OPTIONS,
	getFieldType,
	KYC_STATUS_OPTIONS,
} from '../constants';

const renderSingleField = (
	groupIndex,
	fieldIndex,
	field,
	setFieldValue,
	inputType,
	touched,
	errors,
	countries,
	tooltipMessage
) => {
	const fieldDataType = inputType?.value;
	const isDate = dateTypeFelid[inputType?.lType];
	const isGender = field?.field === 'gender';
	const isKyc = field?.field === 'kycStatus'
	const isDeviceType = field?.field === 'deviceType';
	const isCountry = field?.field === 'country';
	const invalid = !!(
		touched.groups?.[groupIndex]?.fields?.[fieldIndex]?.value1 &&
		errors.groups?.[groupIndex]?.fields?.[fieldIndex]?.value1
	);
	const isError = !!(
		touched.groups?.[groupIndex]?.fields?.[fieldIndex]?.value1 &&
		errors.groups?.[groupIndex]?.fields?.[fieldIndex]?.value1
	);
	const errorMsg =
		touched.groups?.[groupIndex]?.fields?.[fieldIndex]?.value1 &&
		errors.groups?.[groupIndex]?.fields?.[fieldIndex]?.value1;

	if (isKyc) {
		return (
			<div style={{ flex: 1 }}>
				<CustomSelectField
					label="Value"
					type="select"
					id={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
					name={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
					isRequired
					onChange={(e) =>
						setFieldValue(
							`groups.${groupIndex}.fields.${fieldIndex}.value1`,
							e.target.value
						)
					}
					invalid={invalid}
					isError={isError}
					errorMsg={errorMsg}
					value={field.value1 || ''}
					tooltipMessage={tooltipMessage.replace(
						'value',
						field.value1 ?? 'value'
					)}
					options={
						<>
							<option value={null} disabled selected>
								Select Kyc Status
							</option>
							{KYC_STATUS_OPTIONS.map(({ value, label }) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
						</>
					}
				/>
			</div>
		);
	}

	if (isGender) {
		return (
			<div style={{ flex: 1 }}>
				<CustomSelectField
					label="Value"
					type="select"
					id={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
					name={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
					isRequired
					onChange={(e) =>
						setFieldValue(
							`groups.${groupIndex}.fields.${fieldIndex}.value1`,
							e.target.value
						)
					}
					invalid={invalid}
					isError={isError}
					errorMsg={errorMsg}
					value={field.value1 || ''}
					tooltipMessage={tooltipMessage.replace(
						'value',
						field.value1 ?? 'value'
					)}
					options={
						<>
							<option value={null} disabled selected>
								Select gender
							</option>
							{GENDER_OPTIONS.map(({ value, label }) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
						</>
					}
				/>
			</div>
		);
	}
	if (isCountry) {
		return (
			<div style={{ flex: 1 }}>
				<CustomSelectField
					label="Value"
					type="select"
					isRequired
					id={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
					name={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
					onChange={(e) =>
						setFieldValue(
							`groups.${groupIndex}.fields.${fieldIndex}.value1`,
							e.target.value
						)
					}
					invalid={invalid}
					isError={isError}
					errorMsg={errorMsg}
					tooltipMessage={tooltipMessage.replace(
						'value',
						field.value1 ?? 'value'
					)}
					value={field.value1 || ''}
					options={
						<>
							<option value={null} disabled selected>
								Select Country
							</option>
							{countries?.countries?.map(({ id, name }) => (
								<option key={id} value={id}>
									{name}
								</option>
							))}
						</>
					}
				/>
			</div>
			// <MultiSelectOption
			//  placeholder="Select Countries"
			//  options={countrySelectOptions}
			//  value={selectedCountries}
			//  isSearchable
			//  setOption={(sel) => {
			//  	setSelectedCountries(sel);
			// }}
			// />
		);
	}
	if (isDeviceType) {
		return (
			<div style={{ flex: 1 }}>
				<CustomSelectField
					label="Value"
					type="select"
					id={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
					name={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
					isRequired
					tooltipMessage={tooltipMessage.replace(
						'value',
						field.value1 ?? 'value'
					)}
					onChange={(e) =>
						setFieldValue(
							`groups.${groupIndex}.fields.${fieldIndex}.value1`,
							e.target.value
						)
					}
					invalid={invalid}
					isError={isError}
					errorMsg={errorMsg}
					value={field.value1 || ''}
					options={
						<>
							<option value={null} disabled selected>
								Select DeviceType
							</option>
							{DEVICE_TYPE_OPTIONS.map(({ value, label }) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
						</>
					}
				/>
			</div>
		);
	}
	switch (fieldDataType) {
		case 'INT':
		case 'FLOAT':
			return (
				<div style={{ flex: 1 }}>
					<CustomInputField
						label="Value"
						isRequired
						id={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
						tooltipMessage={
							isDate
								? tooltipMessage.replace(
									'value',
									field.value1 && field.value1 !== ''
										? moment()
											.subtract(field.value1, 'days')
											.format('Do MMM YYYY')
										: 'value'
								)
								: tooltipMessage.replace('value', field.value1 ?? 'value')
						}
						name={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
						onChange={(e) =>
							setFieldValue(
								`groups.${groupIndex}.fields.${fieldIndex}.value1`,
								e.target.value
							)
						}
						value={field.value1 || ''}
						placeholder="Enter a number"
						type="number"
						invalid={invalid}
						isError={isError}
						errorMsg={errorMsg}
					/>
				</div>
			);
		case 'BOOLEAN': {
			return (
				<div style={{ flex: 1, marginTop: '22px' }}>
					<CustomToggleButton
						labelClassName="form-check-label"
						label="Status"
						htmlFor="Value1"
						required
						tooltipMessage={tooltipMessage.replace(
							'value',
							field.value1 ? 'Active' : 'Inactive'
						)}
						id={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
						type="switch"
						name={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
						inputClassName="form-check-input"
						// value={!!field.value1?.toString() === 'true'}
						checked={field.value1?.toString() === 'true'}
						onClick={(e) => {
							setFieldValue(
								`groups.${groupIndex}.fields.${fieldIndex}.value1`,
								!e.target.checked
							);
						}}
						switchSizeClass="d-flex justify-content-between form-switch-md px-0 pt-1 mt-2 min-w-100"
						invalid={invalid}
						isError={isError}
						errorMsg={errorMsg}
					/>
				</div>
			);
		}
		case 'DATE':
			return (
				<div style={{ flex: 1 }}>
					<CustomInputField
						label="Value"
						isRequired
						tooltipMessage={tooltipMessage.replace(
							'value',
							field.value1 ?? 'value'
						)}
						id={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
						name={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
						onChange={(e) =>
							setFieldValue(
								`groups.${groupIndex}.fields.${fieldIndex}.value1`,
								e.target.value
							)
						}
						value={field.value1 || ''}
						placeholder="Select a date"
						type="date"
						invalid={invalid}
						isError={isError}
						errorMsg={errorMsg}
						maxDate={new Date().toISOString().split('T')[0]}
					/>
				</div>
			);
		default:
			return (
				<div style={{ flex: 1 }}>
					<CustomInputField
						label="Value"
						tooltipMessage={tooltipMessage.replace(
							'value',
							field.value1 ?? 'value'
						)}
						isRequired
						id={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
						name={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
						onChange={(e) =>
							setFieldValue(
								`groups.${groupIndex}.fields.${fieldIndex}.value1`,
								e.target.value
							)
						}
						value={field.value1 || ''}
						placeholder="Enter text"
						type="text"
						invalid={invalid}
						isError={isError}
						errorMsg={errorMsg}
					/>
				</div>
			);
	}
};

const renderDoubleField = (
	groupIndex,
	fieldIndex,
	field,
	setFieldValue,
	inputType,
	touched,
	errors,
	tooltipMessage
) => {
	const fieldDataType = inputType?.value;
	const isGender = field?.field === 'gender';
	const isSignUp = field?.field === 'signup'
	const isDeviceType = field?.field === 'deviceType';
	const isDate = dateTypeFelid[inputType?.lType];
	const invalid = !!(
		touched.groups?.[groupIndex]?.fields?.[fieldIndex]?.value1 &&
		errors.groups?.[groupIndex]?.fields?.[fieldIndex]?.value1
	);
	const isError = !!(
		touched.groups?.[groupIndex]?.fields?.[fieldIndex]?.value1 &&
		errors.groups?.[groupIndex]?.fields?.[fieldIndex]?.value1
	);
	const errorMsg =
		touched.groups?.[groupIndex]?.fields?.[fieldIndex]?.value1 &&
		errors.groups?.[groupIndex]?.fields?.[fieldIndex]?.value1;

	const invalid2 = !!(
		touched.groups?.[groupIndex]?.fields?.[fieldIndex]?.value2 &&
		errors.groups?.[groupIndex]?.fields?.[fieldIndex]?.value2
	);
	const isError2 = !!(
		touched.groups?.[groupIndex]?.fields?.[fieldIndex]?.value2 &&
		errors.groups?.[groupIndex]?.fields?.[fieldIndex]?.value2
	);
	const errorMsg2 =
		touched.groups?.[groupIndex]?.fields?.[fieldIndex]?.value2 &&
		errors.groups?.[groupIndex]?.fields?.[fieldIndex]?.value2

	if (isDeviceType) {
		return (
			<div style={{ flex: 1 }}>
				<CustomSelectField
					label="Value"
					tooltipMessage={tooltipMessage.replace(
						'value',
						field.value1 ?? 'value'
					)}
					type="select"
					isRequired
					id={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
					name={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
					onChange={(e) =>
						setFieldValue(
							`groups.${groupIndex}.fields.${fieldIndex}.value1`,
							e.target.value
						)
					}
					invalid={invalid}
					isError={isError}
					errorMsg={errorMsg}
					value={field.value1 || ''}
					options={
						<>
							<option value={null} disabled selected>
								Select Device Type
							</option>
							{DEVICE_TYPE_OPTIONS.map(({ value, label }) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
						</>
					}
				/>
			</div>
		);
	}

	if (isGender) {
		return (
			<div style={{ flex: 1 }}>
				<CustomSelectField
					label="Value"
					tooltipMessage={tooltipMessage.replace(
						'value',
						field.value1 ?? 'value'
					)}
					isRequired
					type="select"
					id={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
					name={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
					onChange={(e) =>
						setFieldValue(
							`groups.${groupIndex}.fields.${fieldIndex}.value1`,
							e.target.value
						)
					}
					value={field.value1 || ''}
					invalid={invalid}
					isError={isError}
					errorMsg={errorMsg}
					options={
						<>
							<option value={null} selected disabled>
								Select gender
							</option>
							{GENDER_OPTIONS.map(({ value, label }) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
						</>
					}
				/>
			</div>
		);
	}

	switch (fieldDataType) {
		case 'INT':
		case 'FLOAT':
			return (
				<>
					<div style={{ flex: 1 }}>
						<CustomInputField
							label="Value1"
							isRequired
							tooltipMessage={
								isDate
									? tooltipMessage
										?.replace(
											'value1',
											field.value1 && field.value1 !== ''
												? moment()
													.subtract(field.value1, 'days')
													.format('Do MMM YYYY')
												: 'value1'
										)
										.replace(
											'value2',
											field.value2 && field.value2 !== ''
												? moment()
													.subtract(field.value2, 'days')
													.format('Do MMM YYYY')
												: 'value2'
										)
									: tooltipMessage
										?.replace('value1', field.value1 ?? 'value1')
										.replace('value2', field.value2 ?? 'value2')
							}
							id={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
							name={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
							onChange={(e) =>
								setFieldValue(
									`groups.${groupIndex}.fields.${fieldIndex}.value1`,
									e.target.value
								)
							}
							value={field.value1 || ''}
							placeholder="Enter a number"
							type="number"
							invalid={invalid}
							isError={isError}
							errorMsg={errorMsg}
						/>
					</div>
					<div style={{ flex: 1 }}>
						<CustomInputField
							label="Value2"
							id={`groups-${groupIndex}-fields-${fieldIndex}-value2`}
							name={`groups-${groupIndex}-fields-${fieldIndex}-value2`}
							isRequired
							tooltipMessage={
								isDate
									? tooltipMessage
										?.replace(
											'value1',
											field.value1 && field.value1 !== ''
												? moment()
													.subtract(field.value1, 'days')
													.format('Do MMM YYYY')
												: 'value1'
										)
										.replace(
											'value2',
											field.value2 && field.value2 !== ''
												? moment()
													.subtract(field.value2, 'days')
													.format('Do MMM YYYY')
												: 'value2'
										)
									: tooltipMessage
										?.replace('value1', field.value1 ?? 'value1')
										.replace('value2', field.value2 ?? 'value2')
							}
							onChange={(e) =>
								setFieldValue(
									`groups.${groupIndex}.fields.${fieldIndex}.value2`,
									e.target.value
								)
							}
							value={field.value2 || ''}
							placeholder="Enter a number"
							type="number"
							invalid={invalid2}
							isError={isError2}
							errorMsg={errorMsg2}
						/>
					</div>
				</>
			);

		case 'BOOLEAN': {
			return (
				<div style={{ flex: 1, marginTop: '22px' }}>
					<CustomToggleButton
						labelClassName="form-check-label"
						isRequired
						label="Status"
						htmlFor="Value"
						tooltipMessage={tooltipMessage.replace(
							'value',
							field.value1 ? 'Active' : 'Inactive'
						)}
						id={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
						type="switch"
						name={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
						inputClassName="form-check-input"
						value={!field.value1}
						// checked={field.value1}
						onClick={(e) => {
							setFieldValue(
								`groups.${groupIndex}.fields.${fieldIndex}.value1`,
								!e.target.checked
							);
						}}
						switchSizeClass="d-flex justify-content-between form-switch-md px-0 pt-2 mt-4"
						invalid={invalid}
						isError={isError}
						errorMsg={errorMsg}
					/>
				</div>
			);
		}
		case 'DATE':
			return (
				<>
					<div style={{ flex: 1 }}>
						<CustomInputField
							label="Value1"
							tooltipMessage={tooltipMessage
								?.replace('value1', field.value1 ?? 'value1')
								.replace('value2', field.value2 ?? 'value2')}
							id={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
							name={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
							isRequired
							onChange={(e) =>
								setFieldValue(
									`groups.${groupIndex}.fields.${fieldIndex}.value1`,
									e.target.value
								)
							}
							value={field.value1 || ''}
							placeholder="Select a date"
							type="date"
							invalid={invalid}
							isError={isError}
							errorMsg={errorMsg}
							maxDate={new Date().toISOString().split('T')[0]}
						/>
					</div>
					<div style={{ flex: 1 }}>
						<CustomInputField
							label="Value2"
							id={`groups-${groupIndex}-fields-${fieldIndex}-value2`}
							name={`groups-${groupIndex}-fields-${fieldIndex}-value2`}
							isRequired
							tooltipMessage={tooltipMessage
								?.replace('value1', field.value1 ?? 'value1')
								.replace('value2', field.value2 ?? 'value2')}
							onChange={(e) =>
								setFieldValue(
									`groups.${groupIndex}.fields.${fieldIndex}.value2`,
									e.target.value
								)
							}
							value={field.value2 || ''}
							placeholder="Select a date"
							type="date"
							invalid={invalid2}
							isError={isError2}
							errorMsg={errorMsg2}
							maxDate={new Date().toISOString().split('T')[0]}
						/>
					</div>
				</>
			);
		default:
			return (
				<>
					<CustomInputField
						label="Value1"
						tooltipMessage={tooltipMessage
							?.replace('value1', field.value1 ?? 'value1')
							.replace('value2', field.value2 ?? 'value2')}
						id={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
						name={`groups-${groupIndex}-fields-${fieldIndex}-value1`}
						onChange={(e) =>
							setFieldValue(
								`groups.${groupIndex}.fields.${fieldIndex}.value1`,
								e.target.value
							)
						}
						value={field.value1 || ''}
						placeholder="Enter text"
						type="text"
						isRequired
						invalid={invalid}
						isError={isError}
						errorMsg={errorMsg}
					/>
					<CustomInputField
						label="Value2"
						tooltipMessage={tooltipMessage
							?.replace('value1', field.value1 ?? 'value1')
							.replace('value2', field.value2 ?? 'value2')}
						id={`groups-${groupIndex}-fields-${fieldIndex}-value2`}
						name={`groups-${groupIndex}-fields-${fieldIndex}-value2`}
						onChange={(e) =>
							setFieldValue(
								`groups.${groupIndex}.fields.${fieldIndex}.value2`,
								e.target.value
							)
						}
						value={field.value2 || ''}
						placeholder="Enter text"
						type="text"
						isRequired
						invalid={invalid2}
						isError={isError2}
						errorMsg={errorMsg2}
					/>
				</>
			);
	}
};

const renderFields = (
	operator,
	groupIndex,
	fieldIndex,
	field,
	setFieldValue,
	inputType,
	touched,
	errors,
	countries,
	tooltipMessage
) => {
	const fieldType = getFieldType(operator);
	switch (fieldType) {
		case FIELD_TYPES.SINGLE:
			return renderSingleField(
				groupIndex,
				fieldIndex,
				field,
				setFieldValue,
				inputType,
				touched,
				errors,
				countries,
				tooltipMessage
			);
		case FIELD_TYPES.DOUBLE:
			return renderDoubleField(
				groupIndex,
				fieldIndex,
				field,
				setFieldValue,
				inputType,
				touched,
				errors,
				tooltipMessage
			);
		default:
			return null;
	}
};

const useAdvanceFilter = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {
		filterData,
		loading,
		storeFilterData: filteredData,
	} = useSelector((state) => state.advancedFilterReducer);
	const { segmentationConstants } = useSelector(
		(state) => state.Segmentation
	);
	const { countries } = useSelector((state) => state.Countries);

	const [options, setOptions] = useState([]);

	useEffect(() => {
		dispatch(fetchSegmentationConstants());
		dispatch(fetchCountriesStart());
	}, []);

	const transformSubmittedData = (data) => ({
		condition: (data?.groups || []).map((group) => {
			const groupCondition = {};
			group.fields.forEach((field) => {
				groupCondition[field.field] = {
					op: field.operator,
					value1: field.value1,
					value2: field.value2,
				};
			});
			return groupCondition;
		}),
	});

	const handleView = () => {
		navigate('/advance-filter/view');
	};
	const handleResetAdvanceFilter = () => {
		dispatch(resetAdvanceFilter());
	};

	const computedOptions = useMemo(() => {
		if (
			!segmentationConstants?.segments ||
			Object.keys(segmentationConstants.segments).length === 0
		) {
			return [{ option: 'No data available', value: '' }];
		}
		return Object.keys(segmentationConstants.segments).map((key) => {
			const option = key
				.replace(/([A-Z])/g, ' $1')
				.replace(/^./, (str) => str.toUpperCase())
				.trim();
			return { option, value: key };
		});
	}, [segmentationConstants]);

	useEffect(() => {
		setOptions(computedOptions);
	}, [computedOptions]);

	const tooltipMessageHandler = useMemo(
		() => (field, operators) =>
			segmentationConstants?.segments?.[field]?.description?.[operators],
		[segmentationConstants]
	);

	return {
		initialValues: filteredData?.groups?.length
			? filteredData
			: {
				groups: [
					{
						fields: [{ field: null, operator: null, value1: '', value2: '' }],
					},
				],
			},
		transformSubmittedData,
		handleView,
		options,
		loading,
		dispatch,
		renderFields,
		segmentationConstants,
		filteredData,
		totalCount: filterData ? filterData?.totalPages : 0,
		countries,
		handleResetAdvanceFilter,
		tooltipMessageHandler,
	};
};

export default useAdvanceFilter;
