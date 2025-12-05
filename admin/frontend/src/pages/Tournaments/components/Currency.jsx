/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React, { useEffect, useMemo } from 'react';
import {
	Button,
	Card,
	CardBody,
	Col,
	FormFeedback,
	InputGroup,
	// InputGroupText,
	Label,
	Progress,
	Row,
	UncontrolledTooltip,
	// UncontrolledTooltip,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import {
	CustomInputField,
	CustomSelectField,
	// CustomSwitchButton,
} from '../../../helpers/customForms';
import { fetchCurrenciesStart } from '../../../store/actions';
import useForm from '../../../components/Common/Hooks/useFormModal';
import {
	currencyValidate,
	generalStepInitialValues,
	currencyFields,
	formatCurrencyDetails,
} from '../formDetails';
import { filterEmptyPayload } from '../../../network/networkUtils';
import Actions from './Actions';

const Currencies = ({
	setAllFields,
	tournamentDetail,
	activeTab,
	submitButtonLoading,
	tabsToShow,
	toggleTab,
}) => {
	const dispatch = useDispatch();
	const { currencies } = useSelector((state) => state.Currencies);

	const [allCurrencies, currencyOptions] = useMemo(() => {
		const allCurrencyObj = {};
		currencies?.currencies?.forEach((curr) => {
			if (curr.type !== 'point' && curr.isActive)
				allCurrencyObj[curr?.id] = curr;
		});

		const currOptions = Object.values(allCurrencyObj || {})?.map(
			({ code, name, id }) => (
				<option key={id} value={code} title={name} data-id={id}>
					{name}
				</option>
			)
		);

		return [allCurrencyObj, currOptions];
	}, [currencies]);

	const { validation } = useForm({
		initialValues: generalStepInitialValues()?.currencyDetails,
		validationSchema: currencyValidate(),
	});

	const handleSubmit = () =>
		new Promise((resolve) => {
			setAllFields((prev) => {
				const updateFields = {
					...prev,
					currencyDetails: Object.values(validation.values || {}),
				};
				resolve(updateFields);
				return updateFields;
			});
		});

	const updateWinnerAmount = (numberOfWinners, currencyCode) => {
		const updatedPrizes = {};
		for (let i = 1; i <= numberOfWinners; i += 1) {
			updatedPrizes[i] = {
				rank: i,
				type: 'cash',
				value: '',
			};
		}
		validation?.setFieldValue(`[${currencyCode}][prizes]`, updatedPrizes);
	};

	const updateRemainingAmount = (e, currencyCode, prizesRank) => {
		const prizes = Object.values(
			validation.values?.[currencyCode]?.prizes || {}
		);
		const remAmount =
			prizes?.reduce(
				(accu, { value, type, rank }) =>
					type === 'cash'
						? accu - Number(prizesRank === rank ? e.target.value : value)
						: 0,
				validation.values?.[currencyCode]?.prizeSettlementMethod === 'amount'
					? validation.values?.[currencyCode]?.poolPrize
					: 100
			) || 0;

		validation?.setFieldValue(
			`[${currencyCode}][remainingAmount]`,
			remAmount >= 0 ? remAmount : 0
		);
	};

	const handleChangeCustom = (e, name, currencyCode) => {
		switch (name) {
			case 'numberOfWinners':
				updateWinnerAmount(e.target.value, currencyCode);
				updateRemainingAmount(e, currencyCode);
				break;
			default:
				break;
		}
	};

	const handleDeleteCurrency = (code) => {
		if (validation.values?.[code]) {
			validation.setValues((prev) => {
				// eslint-disable-next-line no-param-reassign
				delete prev?.[code];
				return prev;
			});
		}
	};

	const handleCurrencyChange = (e) => {
		const selectedOption = e.target.selectedOptions[0];
		const id = selectedOption.getAttribute('data-id');
		const code = e.target.value;
		const name = selectedOption.text;
		if (validation.values[code]) return;

		const newCurrency = formatCurrencyDetails({
			[code]: {
				name,
				id,
				code,
			},
		});

		validation.setValues((prev) => ({
			...prev,
			...newCurrency,
		}));
	};
	const handleNextClick = async (nextTab) => {
		validation.submitForm();
		try {
			await currencyValidate().validate(validation.values, {
				abortEarly: false,
			});
			const updateFields = await handleSubmit();
			if (isEmpty(validation.errors)) {
				// condition for nested errors
				toggleTab(nextTab, updateFields);
			} else {
				throw new Error();
			}
		} catch (err) {
			console.log('Error in currency = ', err?.errors);
		}
	};

	useEffect(() => {
		dispatch(fetchCurrenciesStart({}));
	}, []);

	useEffect(() => {
		if (!isEmpty(tournamentDetail) && !isEmpty(allCurrencies)) {
			const currency = filterEmptyPayload(
				generalStepInitialValues(tournamentDetail, allCurrencies)
					?.currencyDetails
			);
			validation.setValues(currency);
		} else if (!isEmpty(allCurrencies)) {
			const currency = filterEmptyPayload(
				generalStepInitialValues({}, allCurrencies)?.currencyDetails
			);
			validation.setValues(currency);
		}
	}, [tournamentDetail, allCurrencies]);

	return (
		<div>
			<Card className="px-1 text-center">
				<Row>
					<Col sm={12} lg={3} className="mb-4 text-start">
						<label htmlFor="currencyId" style={{ fontSize: '14px' }}>
							Add Currency
						</label>
						<CustomSelectField
							type="select"
							isRequired
							onChange={handleCurrencyChange}
							options={
								<>
									<option value={null} selected disabled>
										Select currency
									</option>
									{currencyOptions}
								</>
							}
						/>
						<span className="text-danger">
							{/* {validation.errors.currencyId || ''} */}
						</span>
					</Col>
				</Row>
				{Object.entries(validation.values || {})?.map(
					([currencyCode, { currencyName }]) => (
						<>
							<Row>
								<Col sm={6} lg={3} className="my-2">
									<label
										htmlFor="currencyId"
										style={{ fontSize: '14px' }}
										className="d-flex align-items-left"
									>
										Currency
									</label>
									<CustomInputField
										value={currencyName}
										className="text-center font-weight-bold"
										disabled
									/>
								</Col>
								{currencyFields()?.map(({ name, label, placeholder, type }) => (
									<Col sm={6} lg={3} className="my-2 text-start" key={name}>
										<label htmlFor={name} style={{ fontSize: '14px' }}>
											{label}
										</label>
										<span className="text-danger"> *</span>
										<CustomInputField
											name={`[${currencyCode}][${name}]`}
											value={validation?.values?.[currencyCode]?.[name]}
											onBlur={validation.handleBlur}
											onChange={(e) => {
												validation?.handleChange(e);
												handleChangeCustom(e, name, currencyCode);
											}}
											placeholder={placeholder}
											type={type}
											required
										/>
										{validation.touched?.[currencyCode]?.[name] &&
										validation.errors?.[currencyCode]?.[name] ? (
											<span className="text-danger">
												{validation.errors?.[currencyCode]?.[name] || ''}
											</span>
										) : null}
									</Col>
								))}
							</Row>
							<Row>
								<Card>
									<CardBody>
										{validation?.values?.[currencyCode]?.tournamentPrizeType ===
											'cash' &&
										validation?.values?.[currencyCode]?.numberOfWinners ? (
											<div className="">
												<div className="square-switch d-flex align-items-center mb-5">
													<p className="m-0 pe-2 fs-5 me-5">
														<b>Settlement Method - Amount</b>
													</p>
													{/* {[
													// { label: 'Percentage', value: 'percentage' },
													{ label: 'Amount', value: 'amount' },
												].map((settlementType) => (
													<CustomSwitchButton
														labelClassName="form-check-label"
														label={settlementType?.label}
														htmlFor={`customRadioInline${settlementType?.label}`}
														type="radio"
														id={`customRadioInline${settlementType?.label}`}
														value={
															validation.values?.[currencyCode]
																?.prizeSettlementMethod
														}
														name={settlementType?.value}
														checked={
															validation.values?.[currencyCode]
																?.prizeSettlementMethod ===
															settlementType?.value
														}
														inputClassName="form-check-input"
														onClick={validation?.handleChange}
													/>
												))} */}
												</div>
												<div className="d-flex justify-content-between">
													<h5 className="fw-bold text-capitalize">
														Pool Prize -
														{` ${
															validation.values?.[currencyCode]
																?.prizeSettlementMethod === 'percentage'
																? 100
																: validation.values?.[currencyCode].poolPrize ||
																  0
														} ${
															validation.values?.[currencyCode]
																?.prizeSettlementMethod === 'percentage'
																? '%'
																: ''
														}`}
													</h5>
													<h5 className="fw-bold text-capitalize">
														Remaining Amount -
														{` ${
															validation.values?.[currencyCode].remainingAmount
														} ${
															validation.values?.[currencyCode]
																?.prizeSettlementMethod === 'percentage'
																? '%'
																: ''
														}`}
													</h5>
												</div>
												<Progress
													striped
													color="primary"
													max={
														validation.values?.[currencyCode]
															?.prizeSettlementMethod === 'amount'
															? validation.values?.[currencyCode]?.poolPrize ||
															  0
															: 100
													}
													value={
														validation.values?.[currencyCode]?.remainingAmount
													}
													className="animated-progess progress-xl font-size-18"
												>
													<div className="progress-value fw-bold fs-6">
														{validation.values?.[currencyCode].remainingAmount}
													</div>
												</Progress>
											</div>
										) : null}
										<Row>
											{Object.values(
												validation?.values?.[currencyCode]?.prizes || {}
											)?.map(({ value, rank }) => (
												<Col lg={4} className="pb-2">
													<Label className="form-label">
														Winner {rank}
														<span className="text-danger"> *</span>
													</Label>
													<InputGroup>
														{/* {$ ? ( */}
														{/* <InputGroupText className="password-btn btn btn-primary">
															{'$'}
														</InputGroupText> */}
														{/* ) : null} */}
														<CustomInputField
															name={`[${currencyCode}][prizes][${rank}][value]`}
															value={value}
															onBlur={validation?.handleBlur}
															onChange={(e) => {
																validation.handleChange(e);
																updateRemainingAmount(e, currencyCode, rank);
															}}
															type="number"
															min={0}
															required
														/>
													</InputGroup>
													{validation.touched?.[currencyCode]?.prizes?.[rank]
														?.value &&
													validation.errors?.[currencyCode]?.prizes?.[rank]
														?.value ? (
														<FormFeedback type="invalid" className="d-block">
															{
																validation.errors?.[currencyCode]?.prizes?.[
																	rank
																]?.value
															}
														</FormFeedback>
													) : null}
												</Col>
											))}
										</Row>
										<div className="d-flex justify-content-end">
											<Button
												id={`${currencyCode}-remove`}
												className="btn btn-sm btn-danger"
												onClick={() => handleDeleteCurrency(currencyCode)}
											>
												<i className="mdi mdi-delete-outline fs-4" />
												<UncontrolledTooltip
													placement="top"
													target={`${currencyCode}-remove`}
												>
													Remove Currency
												</UncontrolledTooltip>
											</Button>
										</div>
									</CardBody>
								</Card>
							</Row>
						</>
					)
				)}
			</Card>
			<Actions
				handleNextClick={handleNextClick}
				submitButtonLoading={submitButtonLoading}
				activeTab={activeTab}
				toggleTab={toggleTab}
				tabsToShow={tabsToShow}
			/>
		</div>
	);
};

Currencies.defaultProps = {};
export default Currencies;
