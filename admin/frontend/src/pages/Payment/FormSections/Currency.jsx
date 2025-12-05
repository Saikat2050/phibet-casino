/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { Card, Col, Row } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { CustomInputField } from '../../../helpers/customForms';
import { fetchCurrenciesStart } from '../../../store/actions';
import { currencyFields } from '../constants';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { getInitialValues } from '../formDetails';
import { currencyValidate } from '../Validation/schema';
import { filterEmptyPayload } from '../../../network/networkUtils';
import Actions from './Actions';

const Currencies = ({
	setAllFields,
	paymentDetails,
	allFields,
	activeTab,
	submitButtonLoading,
	tabsToShow,
	toggleTab,
}) => {
	const dispatch = useDispatch();

	const { validation } = useForm({
		initialValues: getInitialValues(paymentDetails)?.providerLimit,
		validationSchema: currencyValidate(),
	});

	const handleSubmit = () =>
		new Promise((resolve) => {
			setAllFields((prev) => {
				const updateFields = {
					...prev,
					providerLimit: [
						// eslint-disable-next-line no-unsafe-optional-chaining
						...Object.values(validation.values)?.map(
							(remCurr) =>
								filterEmptyPayload({
									...remCurr,
									currency: null,
									providerId: null,
									id: null,
									currencyName: null,
								}) // empty extra payload
						),
					],
				};
				resolve(updateFields);
				return updateFields;
			});
		});

	const validateCurrency = async (nextTab) => {
		const currencyArr = Object.values(validation.values);
		if (currencyArr?.length) {
			const updateFields = await handleSubmit();
			toggleTab(nextTab, updateFields);
		} else {
			setAllFields({
				...allFields,
				providerLimit: [],
			});
			toggleTab(nextTab);
		}
	};

	const handleCurrencyChange = ({ currId, currName }) => {
		if (validation?.values?.[currId]) return;

		const remCur = {
			[currId]: {
				currencyName: currName,
				currencyId: currId,
				minDeposit: null,
				maxDeposit: null,
				minWithdraw: null,
				maxWithdraw: null,
			},
		};

		validation.setValues((prev) => ({
			...prev,
			...remCur,
		}));
	};

	useEffect(() => {
		handleCurrencyChange({ currId: 4, currName: 'Redeemable Sweeps Coins' });
	}, [handleCurrencyChange]);

	// const handleDeleteCurrency = (id) => {
	// 	if (validation.values?.[id]) {
	// 		validation.setValues((prev) => {
	// 			// eslint-disable-next-line
	// 			delete prev?.[id];
	// 			return prev;
	// 		});
	// 	}
	// };

	useEffect(() => {
		if (!isEmpty(paymentDetails)) {
			const currency = filterEmptyPayload(
				getInitialValues(paymentDetails)?.providerLimit
			);
			validation.setValues(currency);
		}
	}, [paymentDetails]);

	useEffect(() => {
		dispatch(fetchCurrenciesStart({}));
	}, []);

	const handleNextClick = (nextTab) => {
		currencyValidate()
			.validate(validation.values, {
				context: { options: { context: validation.values } },
				abortEarly: false,
			})
			.then(() => {
				validateCurrency(nextTab);
			})
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.log('Error in currency', err);
			});
	};

	return (
		<div>
			<Card className="px-1 text-center">
				{/* <Row> */}
				{/* <Col sm={12} lg={3} className="mb-4"> */}
				{/* <label htmlFor="currencyId" style={{ fontSize: '14px' }}>
							Select currency
						</label> */}
				{/* <CustomSelectField
							id="currencyId"
							type="select"
							// name="currencyId"
							onChange={(e) => {
								// validation.handleChange(e)
								handleCurrencyChange({
									currId: e?.target?.value,
									currName: e.target.options[e.target.selectedIndex].text,
								});
							}}
							options={
								<>
									<option value={null} selected disabled>
										Select currency
									</option>
									{currencies?.currencies
										?.filter((curr) => curr.type !== 'point')
										?.map(({ id, name }) => (
											<option key={id} value={id} title={name}>
												{name}
											</option>
										))}
								</>
							}
						/> */}
				{/* <span className="text-danger">
							{validation.errors.currencyId || ''}
						</span> */}
				{/* </Col> */}
				{/* </Row> */}
				<Row>
					{validation?.values &&
						Object.entries(validation?.values)?.map(([key, value]) => (
							<>
								<Row className="mb-2 mt-4">
									<Col sm={12} lg={3} className="d-flex ml-2">
										<CustomInputField
											value={value?.currencyName}
											className="text-center font-weight-bold"
											disabled
										/>
										{/* <Button
											id="deleteToolTip"
											className="btn btn-sm btn-danger"
											onClick={() => handleDeleteCurrency(key)}
										>
											<i className="mdi mdi-delete-outline" />
											<UncontrolledTooltip
												placement="top"
												target="deleteToolTip"
											>
												Remove Currency
											</UncontrolledTooltip>
										</Button> */}
									</Col>
									<Col sm={12} lg={1} className="mt-2 align-self-center" />
								</Row>
								{currencyFields?.map(({ key: currencyKey, label }) => (
									<Col sm={12} lg={3}>
										<label htmlFor={currencyKey} style={{ fontSize: '14px' }}>
											{label}
										</label>
										<CustomInputField
											// name={`[providerLimit][${key}][${currencyKey}]`}
											value={
												validation?.values?.[key]?.[currencyKey] === null
													? ''
													: validation?.values?.[key]?.[currencyKey]
											}
											onChange={(e) => {
												validation.handleChange(e);
												validation.setValues((prev) => ({
													...prev,
													[key]: {
														...validation?.values?.[key],
														[currencyKey]: parseFloat(e.target.value),
													},
												}));
											}}
											isError
											errorMsg={validation?.errors?.[key]?.[currencyKey]}
											type="number"
											required
										/>
										<span className="text-danger">
											{validation?.errors?.[key]?.[currencyKey] || ''}
										</span>
									</Col>
								))}
							</>
						))}
				</Row>
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
