/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import { useParams } from 'react-router-dom';
import {
	CustomInputField,
	CustomSwitchButton,
} from '../../../helpers/customForms';
import {
	// getAllBonus,
	getUserBonusDetails,
	issueBonus,
} from '../../../store/actions';
// import { safeStringify } from '../../../utils/helpers';
import TableContainer from '../../../components/Common/Table';
import { KeyValueCell } from '../TableCol';
import { bonusKeyArray } from '../constants';
import { formatDateYMD } from '../../../utils/dateFormatter';

const GiveBonusModal = ({ show, toggle, header }) => {
	const { playerId } = useParams();
	const dispatch = useDispatch();
	const [bonusAmount, setBonusAmount] = useState('');
	const [selectedBonus, setSelectedBonus] = useState('');
	const { bonusList, bonusDetails, getBonusDetailsLoading } = useSelector(
		(state) => state.UserDetails
	);

	useEffect(() => {
		// dispatch(
		// 	getAllBonus({
		// 		adminId: '',
		// 		tenantId: '',
		// 		perPage: '',
		// 		page: '',
		// 		search: '',
		// 		bonusType: safeStringify(['deposit']),
		// 		isActive: '',
		// 	})
		// );
	}, []);

	useEffect(() => {
		if (bonusList?.length) {
			setSelectedBonus(bonusList?.[0]?.bonusId);
		}
	}, [bonusList]);

	useEffect(() => {
		if (selectedBonus) {
			dispatch(
				getUserBonusDetails({
					bonusId: selectedBonus,
				})
			);
		}
	}, [selectedBonus]);

	const handleAmountAdd = () => {
		toggle();
		dispatch(
			issueBonus({
				userId: parseInt(playerId, 10),
				bonusId: selectedBonus,
				amount: bonusAmount,
			})
		);
		setBonusAmount('');
	};

	const formattedBonusDetails = useMemo(() => {
		const arrayToReturn = [];
		if (bonusDetails) {
			const copyArray = {
				...bonusDetails,
				title: bonusDetails?.promotionTitle?.EN,
				bonusPercentage: `${bonusDetails?.depositBonusPercent}%`,
				isSticky: bonusDetails?.isSticky ? 'YES' : 'NO',
				bonusBetOnly: bonusDetails?.bonusBetOnly ? 'YES' : 'NO',
				validFrom: formatDateYMD(bonusDetails?.validFrom),
				validTo: formatDateYMD(bonusDetails?.validTo),
			};
			bonusKeyArray?.map((key) =>
				arrayToReturn.push({ key: key.label, value: copyArray[key.accessor] })
			);
		}

		return arrayToReturn;
	}, [bonusDetails]);

	const columns = useMemo(
		() => [
			{
				Header: 'Key',
				accessor: 'key',
				// filterable: true,
				Cell: (cellProps) => <KeyValueCell {...cellProps} />,
			},
			{
				Header: 'Value',
				accessor: 'value',
				// filterable: true,
				Cell: (cellProps) => <KeyValueCell {...cellProps} />,
			},
		],
		[]
	);

	return (
		<Modal isOpen={show} toggle={toggle} size="lg" backdrop="static">
			<ModalHeader toggle={toggle} tag="h4">
				{header}
			</ModalHeader>
			<ModalBody>
				<Row>
					<Col md={4}>
						<h6 className="text-center">AVAILABLE BONUSES</h6>
						{bonusList?.length ? (
							bonusList?.map((bonus) => (
								<div key={bonus.bonusId} className="p-2">
									<CustomSwitchButton
										labelClassName="form-check-label"
										htmlFor={bonus?.bonusId}
										id={bonus?.bonusId}
										label={bonus?.promotionTitle?.EN}
										type="switch"
										checked={!!(selectedBonus === bonus?.bonusId)}
										inputClassName="form-check-input"
										onClick={() => setSelectedBonus(bonus?.bonusId)}
									/>
								</div>
							))
						) : (
							<div className="p-2">No Bonuses Available</div>
						)}
					</Col>
					<Col md={8}>
						<h6 className="text-center">BONUS DETAILS</h6>
						<TableContainer
							columns={columns}
							data={formattedBonusDetails}
							paginationDiv="justify-content-center"
							pagination="pagination justify-content-start pagination-rounded"
							customPageSize={20}
							hideHeader
							isLoading={getBonusDetailsLoading}
							isShowColSettings={false}
						/>
						{bonusDetails &&
							['deposit', 'wagering'].includes(bonusDetails?.bonusType) && (
								<div className="d-flex justify-content-start align-items-center">
									<CustomInputField
										label="Amount (Optional)"
										type="number"
										min={0}
										value={bonusAmount}
										onChange={(e) => setBonusAmount(e.target.value)}
										placeholder="Enter Amount"
									/>
								</div>
							)}
					</Col>
				</Row>
				{bonusDetails && (
					<div className="d-flex justify-content-end">
						<Button onClick={() => handleAmountAdd()} className="ml-auto">
							Add
						</Button>
					</div>
				)}
			</ModalBody>
		</Modal>
	);
};

export default GiveBonusModal;
