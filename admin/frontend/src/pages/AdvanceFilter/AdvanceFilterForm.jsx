/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Formik, Form, FieldArray } from 'formik';
import { Button, UncontrolledTooltip } from 'reactstrap';

import useCreateSegmentation from './hooks/useAdvanceFilter';
import { CustomSelectField } from '../../helpers/customForms';
import { applyAdvanceFilter, storeFilterData } from '../../store/actions';
import { operators } from './constants';
import { validationSchema } from './formDetails';

// eslint-disable-next-line react/prop-types
const AdvanceFilterForm = () => {
	const {
		initialValues,
		transformSubmittedData,
		options,
		renderFields,
		loading,
		dispatch,
		segmentationConstants,
		// totalCount,
		handleView,
		countries,
		handleResetAdvanceFilter,
		tooltipMessageHandler,
	} = useCreateSegmentation();

	return (
		<Formik
			initialValues={initialValues}
			enableReinitialize
			validationSchema={validationSchema}
			onSubmit={(values) => {
				const transformedValues = transformSubmittedData(values);
				dispatch(applyAdvanceFilter(transformedValues));
				dispatch(storeFilterData(values));
				handleView();
			}}
		>
			{({ values, setFieldValue, errors, touched, resetForm }) => (
				<Form>
					<FieldArray name="groups">
						{({ remove, push }) => (
							<div className="mt-2 px-3 pb-3">
								{values.groups.map((group, groupIndex) => (
									<div key={groupIndex}>
										<div
											style={{
												padding: '2rem',
												borderRadius: '8px',
												boxShadow:
													'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(117, 117, 117, 0.22) 0px 10px 10px',
												position: 'relative',
											}}
										>
											{values.groups?.length !== 1 && (
												<div className="w-100 d-flex justify-content-end mb-3">
													<Button
														type="button"
														disabled={loading}
														id={`plus-${groupIndex + 1}`}
														onClick={() => remove(groupIndex)}
														style={{
															width: '2rem',
															height: '2rem',
															color: 'rgba(7, 7, 7, 0.79)',
															borderRadius: '30px',
															border: '1px solid #534c4cc9',
															padding: '0.5rem',
															cursor: 'pointer',
															background: 'transparent',
															display: 'flex',
															justifyContent: 'center',
															alignItems: 'center',
															marginTop: '1px',
															position: 'absolute',
															top: '0.5rem',
															right: '0.5rem',
														}}
													>
														<i className="mdi mdi-close fs-5" />
														<UncontrolledTooltip
															placement="top"
															target={`plus-${groupIndex + 1}`}
														>
															Remove condition
														</UncontrolledTooltip>
													</Button>
												</div>
											)}
											<FieldArray name={`groups.${groupIndex}.fields`}>
												{({ remove: removeField, push: pushField }) => (
													<div>
														<div className="d-flex flex-column gap-3">
															{group.fields?.length === 0 && (
																<div
																	key={groupIndex}
																	className="d-flex align-items-center gap-3 mb-3"
																>
																	<Button
																		color="success"
																		disabled={loading}
																		type="button"
																		id={`plus-${groupIndex}`}
																		onClick={() =>
																			pushField({
																				field: '',
																				operator: '',
																				value1: '',
																				value2: '',
																			})
																		}
																	>
																		<i className="mdi mdi-plus-box" />
																		<UncontrolledTooltip
																			placement="top"
																			target={`plus-${groupIndex}`}
																		>
																			Add OR condition
																		</UncontrolledTooltip>
																	</Button>
																</div>
															)}

															{group.fields.map((field, fieldIndex) => (
																<div>
																	<div
																		key={fieldIndex}
																		className="d-flex align-items-center gap-3 mb-3"
																	>
																		<div style={{ flex: 1 }}>
																			<CustomSelectField
																				type="select"
																				label="Field"
																				isRequired
																				id={`groups-${groupIndex}-fields-${fieldIndex}-field`}
																				name={`groups-${groupIndex}-fields-${fieldIndex}-field`}
																				onChange={(e) => {
																					setFieldValue(
																						`groups.${groupIndex}.fields.${fieldIndex}.operator`,
																						null
																					);
																					setFieldValue(
																						`groups.${groupIndex}.fields.${fieldIndex}.field`,
																						e.target.value
																					);
																					setFieldValue(
																						`groups.${groupIndex}.fields.${fieldIndex}.value1`,
																						null
																					);
																					setFieldValue(
																						`groups.${groupIndex}.fields.${fieldIndex}.value2`,
																						null
																					);
																				}}
																				value={field.field || ''}
																				options={
																					<>
																						<option value="" disabled selected>
																							Select field
																						</option>
																						{options?.map(
																							({ value, option }) => (
																								<option
																									key={value}
																									value={value}
																								>
																									{option}
																								</option>
																							)
																						)}
																					</>
																				}
																				invalid={
																					!!(
																						touched.groups?.[groupIndex]
																							?.fields?.[fieldIndex]?.field &&
																						errors.groups?.[groupIndex]
																							?.fields?.[fieldIndex]?.field
																					)
																				}
																				isError={
																					!!(
																						touched.groups?.[groupIndex]
																							?.fields?.[fieldIndex]?.field &&
																						errors.groups?.[groupIndex]
																							?.fields?.[fieldIndex]?.field
																					)
																				}
																				errorMsg={
																					touched.groups?.[groupIndex]
																						?.fields?.[fieldIndex]?.field &&
																					errors.groups?.[groupIndex]?.fields?.[
																						fieldIndex
																					]?.field
																				}
																			/>
																		</div>
																		<div style={{ flex: 1 }}>
																			<CustomSelectField
																				label="Operator"
																				type="select"
																				isRequired
																				id={`groups-${groupIndex}-fields-${fieldIndex}-operator`}
																				name={`groups-${groupIndex}-fields-${fieldIndex}-operator`}
																				onChange={(e) => {
																					if (
																						Object.keys(
																							segmentationConstants?.segments ??
																								{}
																						)?.find(
																							(key) => key === field.field
																						) &&
																						segmentationConstants?.segments[
																							field.field
																						]?.value === 'BOOLEAN'
																					) {
																						setFieldValue(
																							`groups.${groupIndex}.fields.${fieldIndex}.operator`,
																							e.target.value
																						);
																						setFieldValue(
																							`groups.${groupIndex}.fields.${fieldIndex}.value1`,
																							false
																						);
																						setFieldValue(
																							`groups.${groupIndex}.fields.${fieldIndex}.value2`,
																							null
																						);
																					} else {
																						setFieldValue(
																							`groups.${groupIndex}.fields.${fieldIndex}.operator`,
																							e.target.value
																						);
																						setFieldValue(
																							`groups.${groupIndex}.fields.${fieldIndex}.value1`,
																							null
																						);
																						setFieldValue(
																							`groups.${groupIndex}.fields.${fieldIndex}.value2`,
																							null
																						);
																					}
																				}}
																				value={field.operator || ''}
																				options={
																					<>
																						<option
																							value=""
																							key="default"
																							disabled
																							selected
																						>
																							Select operator
																						</option>
																						{segmentationConstants?.segments[
																							field.field
																						]?.operators?.map((value) => (
																							<option key={value} value={value}>
																								{operators[value] ?? value}
																							</option>
																						))}
																					</>
																				}
																				invalid={
																					!!(
																						touched.groups?.[groupIndex]
																							?.fields?.[fieldIndex]
																							?.operator &&
																						errors.groups?.[groupIndex]
																							?.fields?.[fieldIndex]?.operator
																					)
																				}
																				isError={
																					!!(
																						touched.groups?.[groupIndex]
																							?.fields?.[fieldIndex]
																							?.operator &&
																						errors.groups?.[groupIndex]
																							?.fields?.[fieldIndex]?.operator
																					)
																				}
																				errorMsg={
																					touched.groups?.[groupIndex]
																						?.fields?.[fieldIndex]?.operator &&
																					errors.groups?.[groupIndex]?.fields?.[
																						fieldIndex
																					]?.operator
																				}
																			/>
																		</div>
																		{renderFields(
																			field.operator,
																			groupIndex,
																			fieldIndex,
																			field,
																			setFieldValue,
																			Object.keys(
																				segmentationConstants?.segments ?? {}
																			)?.find((key) => {
																				return key === field.field
																			}) &&
																				segmentationConstants?.segments[
																					field.field
																				],
																			touched,
																			errors,
																			countries,
																			tooltipMessageHandler(
																				group.fields[fieldIndex]?.field,
																				group.fields[fieldIndex]?.operator
																			)
																		)}
																		<div className="mt-4 flex gap-3">
																			{group.fields?.length !== 1 && (
																				<Button
																					type="button"
																					className="btn-danger me-2"
																					disabled={loading}
																					onClick={() =>
																						removeField(fieldIndex)
																					}
																					id={`remove-${groupIndex}-${fieldIndex}`}
																				>
																					<i className="mdi mdi-trash-can-outline" />
																					<UncontrolledTooltip
																						placement="top"
																						target={`remove-${groupIndex}-${fieldIndex}`}
																					>
																						Remove OR condition
																					</UncontrolledTooltip>
																				</Button>
																			)}
																			{fieldIndex ===
																				group.fields.length - 1 && (
																				<Button
																					disabled={loading}
																					color="success"
																					type="button"
																					id={`add-${groupIndex}-${fieldIndex}`}
																					onClick={() =>
																						pushField({
																							field: '',
																							operator: '',
																							value1: '',
																							value2: '',
																						})
																					}
																				>
																					<i className="mdi mdi-plus-box" />
																					<UncontrolledTooltip
																						placement="top"
																						target={`add-${groupIndex}-${fieldIndex}`}
																					>
																						Add or condition
																					</UncontrolledTooltip>
																				</Button>
																			)}
																		</div>
																	</div>
																	{fieldIndex < group.fields.length - 1 && (
																		<div className="or-text-box">
																			<div className="or-line bg-primary" />
																			<span className="badge rounded-pill bg-primary text">
																				OR
																			</span>
																			<div className="or-line bg-primary" />
																		</div>
																	)}
																</div>
															))}
														</div>
													</div>
												)}
											</FieldArray>
											{touched.groups?.[groupIndex]?.fields &&
											errors.groups?.[groupIndex]?.fields ? (
												<div
													style={{
														width: '100%',
														marginTop: '.25rem',
														fontSize: '.875em',
														color: 'var(--bs-form-invalid-color)',
													}}
													type="invalid"
												>
													{typeof errors.groups?.[groupIndex]?.fields ===
													'string'
														? errors.groups?.[groupIndex]?.fields
														: ''}
												</div>
											) : null}
										</div>
										{groupIndex < values.groups.length - 1 && (
											<div className="and-text-box">
												<div className="or-line bg-success" />
												<span className="badge rounded-pill bg-success text">
													AND
												</span>
												<div className="or-line bg-success" />
											</div>
										)}
									</div>
								))}
								{errors?.groups && touched?.groups ? (
									<div
										style={{
											width: 'max-content',
											height: '2.00rem',
											marginTop: '1.00rem',
											fontSize: '.975em',
											padding: '0 1rem',
											borderRadius: '5px',
											color: 'var(--bs-form-invalid-color)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											textAlign: '',
										}}
										type="invalid"
									>
										{typeof errors.groups === 'string' ? errors.groups : ''}
									</div>
								) : null}
								<div className="text-end d-flex justify-content-between mt-4 ">
									<Button
										className="waves-effect waves-light"
										disabled={loading}
										color="success"
										style={{
											color: 'white',
											borderRadius: '4px',
											border: 'none',
											padding: '8px 10px',
											cursor: 'pointer',
										}}
										onClick={() =>
											push({
												fields: [
													{ field: '', operator: '', value1: '', value2: '' },
												],
											})
										}
									>
										Add Condition
									</Button>
									<div style={{ display: 'flex', gap: '10px' }}>
										<Button
											disabled={loading}
											className="waves-effect waves-light"
											color="warning"
											onClick={() => {
												handleResetAdvanceFilter();
												resetForm();
											}}
										>
											Reset
										</Button>
										<Button
											color="primary"
											disabled={loading}
											className="waves-effect waves-light"
										>
											Filter
										</Button>
										{/* <Button
											disabled={totalCount === 0 || loading}
											className="save-user"
											color="primary"
											onClick={	.filter((key) => key !== 'total_count')}
										>
											<span style={{ marginRight: '5px' }}>Show result</span>
											{!loading && (
												<span>
													{`${totalCount * 9}${totalCount > 0 ? '+' : ''}`}
												</span>
											)}{' '}
										</Button> */}
									</div>
								</div>
							</div>
						)}
					</FieldArray>
				</Form>
			)}
		</Formik>
	);
};

export default AdvanceFilterForm;
