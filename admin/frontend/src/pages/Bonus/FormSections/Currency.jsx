/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { Card, Col, Row } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import {
	CustomInputField,
	// CustomSelectField,
} from '../../../helpers/customForms';
import { fetchCurrenciesStart } from '../../../store/actions';
import { commonCurrencyFields } from '../constants';
import useForm from '../../../components/Common/Hooks/useFormModal';
import {
	// formatBonusCurrency,
	getBonusInitialValues,
} from '../formDetails';
import { currencyValidate } from '../Validation/schema';
import { filterEmptyPayload } from '../../../network/networkUtils';
import Actions from './Actions';
import { showToastr } from '../../../utils/helpers';

const BONUS_COINS = { GC: true, BSC: true };

const Currencies = ({
	setAllFields,
	bonusDetails,
	activeTab,
	submitButtonLoading,
	tabsToShow,
	toggleTab,
}) => {
	const dispatch = useDispatch();
	const { currencies } = useSelector((state) => state.Currencies);
	const [currencyFields] = useState(commonCurrencyFields);

	const { validation } = useForm({
		initialValues: getBonusInitialValues()?.currencyDetails,
		validationSchema: currencyValidate(),
	});

	const [
		allCurrencies,
		// currencyOptions
	] = useMemo(() => {
		const allCurrencyObj = {};
		currencies?.currencies?.forEach((curr) => {
			if (BONUS_COINS?.[curr?.code] && curr.isActive)
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

	const handleSubmit = () =>
		new Promise((resolve) => {
			setAllFields((prev) => {
				const updateFields = {
					...prev,
					currencyDetails: filterEmptyPayload(validation.values),
				};
				resolve(updateFields);
				return updateFields;
			});
		});

	useEffect(() => {
		if (!isEmpty(allCurrencies)) {
			const currency = filterEmptyPayload(
				getBonusInitialValues(bonusDetails, [], allCurrencies)?.currencyDetails
			);
			validation.setValues(currency);
		}
	}, [bonusDetails, allCurrencies]);

	useEffect(() => {
		dispatch(fetchCurrenciesStart({}));
	}, []);

	const handleNextClick = (nextTab) => {
		validation.submitForm();
		currencyValidate()
			.validate(validation.values)
			.then(() => {
				const callNext = async () => {
					const updateFields = await handleSubmit();
					if (isEmpty(updateFields.currencyDetails)) {
						showToastr({
							message: 'Please add details of at least one coin.',
							type: 'error',
						});
						return;
					}
					const values = Object.values(updateFields?.currencyDetails || {});
					toggleTab(nextTab, { ...updateFields, currencyDetails: values });
				};
				callNext();
			})
			.catch((err) => {
				console.log('Error in currency = ', err.message);
			});
	};

	// const handleCurrencyChange = (e) => {
	// 	const selectedOption = e.target.selectedOptions[0];
	// 	const id = selectedOption.getAttribute('data-id');
	// 	const code = e.target.value;
	// 	const name = selectedOption.text;
	// 	if (validation.values[code]) return;

	// 	const newCurrency = formatBonusCurrency({
	// 		[code]: {
	// 			name,
	// 			id,
	// 			code,
	// 		},
	// 	});

	// 	validation.setValues((prev) => ({
	// 		...prev,
	// 		...newCurrency,
	// 	}));
	// };

	// const handleDeleteCurrency = (code) => {
	// 	if (validation.values?.[code]) {
	// 		validation.setValues((prev) => {
	// 			// eslint-disable-next-line no-param-reassign
	// 			delete prev?.[code];
	// 			return prev;
	// 		});
	// 	}
	// };

	return (
		<div>
			<Card className="px-1 text-center">
				{/* <Row>
					<Col sm={12} lg={3} className="mb-4 text-start">
						<label htmlFor="currencyId" style={{ fontSize: '14px' }}>
							Add Coin
						</label>
						<CustomSelectField
							type="select"
							isRequired
							onChange={handleCurrencyChange}
							options={
								<>
									<option value={null} selected disabled>
										Select Coin
									</option>
									{currencyOptions}
								</>
							}
						/>
						<span className="text-danger">
						</span>
					</Col>
				</Row> */}
				{Object.entries(validation.values || {})?.map(
					([currencyCode, { currencyName }]) => (
						<Row>
							<Col sm={6} lg={3} className="my-2">
								<label
									htmlFor="currencyId"
									style={{ fontSize: '14px' }}
									className="d-flex align-items-left"
								>
									Coin
								</label>
								<CustomInputField
									value={currencyName}
									className="text-center font-weight-bold"
									disabled
								/>
							</Col>
							{currencyFields?.map(({ name, label, placeholder, type }) => (
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
							{/* <Col className="d-flex align-items-end justify-content-end p-2">
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
										Remove Coin
									</UncontrolledTooltip>
								</Button>
							</Col> */}
						</Row>
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
