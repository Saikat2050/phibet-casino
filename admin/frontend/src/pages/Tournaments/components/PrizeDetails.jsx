/* eslint-disable react/prop-types */
import React from 'react';
import { Col, Row } from 'reactstrap';

const PrizeDetails = ({ currencyWise }) => {
	let prizesObj = {};

	currencyWise?.prizes?.map((prize) => {
		prizesObj = {
			...prizesObj,
			[prize?.rank]: prize?.type === 'cash' ? prize?.amount : prize?.item,
		};
		return '';
	});

	return (
		<Row className="px-5 py-3">
			<Row lg={12} className="p-2 border-bottom">
				<Col
					lg={4}
					className="fw-semibold py-2 d-flex justify-content-center font-size-16"
				>
					Position
				</Col>
				<Col
					lg={8}
					className="fw-semibold py-2 d-flex justify-content-center font-size-16"
				>
					Prize
				</Col>
			</Row>
			{Object.entries(prizesObj || {})?.map(([winner, prize]) => (
				<Row lg={12} key={winner} className="py-2 border-bottom">
					<Col
						lg={4}
						className="fw-semibold d-flex justify-content-center font-size-16"
					>
						{winner}
					</Col>
					<Col
						lg={8}
						className="py-2 d-flex justify-content-center font-size-16"
					>
						{currencyWise?.symbol || ''} {prize}
					</Col>
				</Row>
			)) || 'No data found'}
		</Row>
	);
};

export default PrizeDetails;
