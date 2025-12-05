/* eslint-disable react/prop-types */
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import { getUserBonusDetails } from '../../../store/actions';

export const wageringRequirementType = [
	{ label: 'BONUS', value: 'bonus', id: 1 },
	{ label: 'BONUS+DEPOSIT', value: 'bonusdeposit', id: 2 },
];

const BonusDetails = ({ show, toggle, bonusId, bonusTitle, userBonusId }) => {
	const dispatch = useDispatch();
	const { bonusDetails, userDetails } = useSelector(
		(state) => state.UserDetails
	);
	const dataArray = [
		{
			id: 1,
			label: 'Days To Clear',
			accessor: 'daysToClear',
		},
		{
			id: 2,
			label: 'Wagering Type',
			accessor: 'wageringType',
		},
		{
			id: 3,
			label: 'Wagering Multiplier',
			accessor: 'wageringMultiplier',
		},
		{
			id: 4,
			label: 'Bonus Percentage',
			accessor: 'depositBonusPercent',
			delimiter: '%',
		},
		{
			id: 5,
			label: 'Min Purchase',
			accessor: 'minDeposit',
		},
	];

	const formattedBonusDetails = useMemo(() => {
		let objectToReturn = {};
		if (bonusDetails) {
			objectToReturn = {
				...bonusDetails,
				wageringType: wageringRequirementType?.find(
					(val) => val.value === bonusDetails?.wageringRequirementType
				)?.label,
				minDeposit:
					bonusDetails?.currency?.[userDetails?.currencyCode]?.minDeposit,
			};
		}
		return objectToReturn;
	}, []);

	useEffect(() => {
		if (bonusId) {
			dispatch(
				getUserBonusDetails({
					bonusId,
					userBonusId,
				})
			);
		}
	}, [bonusId]);

	return (
		<Modal isOpen={show} toggle={toggle} size="md">
			<ModalHeader toggle={toggle} tag="h4">
				{`Title: ${bonusTitle} (Bonus Id: ${bonusId})`}
			</ModalHeader>
			<ModalBody>
				{dataArray.map((data) => (
					<Row id={data.id} className="mb-2">
						<Col sm={6}>
							<h6>{data.label}</h6>
						</Col>
						<Col sm={6}>
							<h6>
								{formattedBonusDetails?.[data.accessor]} {data?.delimiter}
							</h6>
						</Col>
					</Row>
				))}
			</ModalBody>
		</Modal>
	);
};

export default BonusDetails;
