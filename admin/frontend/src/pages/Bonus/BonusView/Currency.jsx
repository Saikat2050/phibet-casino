/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { Card, Col } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
	CustomInputField,
	CustomSelectField,
} from '../../../helpers/customForms';
import { BONUS_TYPES, commonCurrencyFields } from '../constants';
import { fetchCurrenciesStart } from '../../../store/actions';

const Currencies = ({ bonusDetails }) => {
	const dispatch = useDispatch();
	const [currencyFields, setCurrencyFields] = useState(commonCurrencyFields);
	const { currencies } = useSelector((state) => state.Currencies);

	useEffect(() => {
		if (!currencies) dispatch(fetchCurrenciesStart({}));
	}, []);

	useEffect(() => {
		switch (bonusDetails.bonusType) {
			case BONUS_TYPES.JOINING: {
				setCurrencyFields([
					// ...commonCurrencyFields,
					{ label: 'Joining Amount', key: 'joiningAmount' },
				]);
				break;
			}
			case BONUS_TYPES.DEPOSIT: {
				setCurrencyFields([
					...commonCurrencyFields,
					{ label: 'Min Purchase Amount', key: 'minDepositAmount' },
				]);
				break;
			}
			case BONUS_TYPES.BET: {
				setCurrencyFields([
					...commonCurrencyFields,
					{ label: 'Min Bet Amount', key: 'minBetAmount' },
				]);
				break;
			}
			case BONUS_TYPES.FREESPINS: {
				setCurrencyFields([...commonCurrencyFields]);
				break;
			}
			default:
				break;
		}
	}, [bonusDetails?.bonusType]);

	return (
		<Card className="p-3">
			{bonusDetails?.bonusCurrencies?.map((currency, idx) => (
				<Col className="px-1 text-center d-flex my-3">
					<Col sm={12} lg={2} className="mx-1">
						{idx === 0 && (
							<label htmlFor="currencyId" style={{ fontSize: '14px' }}>
								Coins
							</label>
						)}
						<CustomSelectField
							id="currencyId"
							type="select"
							name="currencyId"
							disabled
							options={
								<option value={null} selected disabled>
									{currencies?.currencies?.find(
										(cur) => cur.id === currency.currencyId
									)?.name || ''}
								</option>
							}
						/>
					</Col>
					{currencyFields?.map((key) => (
						<Col sm={12} lg={3} className="mx-1">
							{idx === 0 && (
								<label htmlFor={key?.label} style={{ fontSize: '14px' }}>
									{key?.label}
								</label>
							)}
							<CustomInputField
								name={key?.label}
								value={currency?.[key?.name]}
								type="number"
								disabled
							/>
						</Col>
					))}
				</Col>
			))}
		</Card>
	);
};

Currencies.defaultProps = {
	bonusDetails: {},
};

Currencies.propTypes = {
	bonusDetails: PropTypes.objectOf,
};

export default Currencies;
