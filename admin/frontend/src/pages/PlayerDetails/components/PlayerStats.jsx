/* eslint-disable react/prop-types */
import React from 'react';
import { Row, Col, Card } from 'reactstrap';
import getChartColorsArray from '../../../components/Common/ChartsDynamicColor';
import SingleChart from './SingleChart';

const PlayerStats = ({ data = {} }) => {
	const purchaseRedeem = [
		{ category: 'SC Rewarded', value: Number(data.scRewards || 0) },
		{ category: 'GC Purchased', value: Number(data.gcPurchases || 0) },
		{ category: 'Redeemed', value: Number(data.redeemAmount || 0) },
	];

	const winBetData = [
		{ category: 'GC Wagered', value: Number(data.gcStakedAmount || 0) },
		{ category: 'GC Payout', value: Number(data.gcCasinoWins || 0) },
	];

	const countData = [
		{ category: 'SC Wagered Count', value: Number(data.scBetCount || 0) },
		{ category: 'GC Wagered Count', value: Number(data.gcBetCount || 0) },
		{ category: 'Purchase Count', value: Number(data.purchaseCount || 0) },
	];

	const PnLData = [
		{ category: 'Net SC', value: Number(data.netProfit || 0) },
		{ category: 'SC Wagered', value: Number(data.scStakedAmount || 0) },
		{ category: 'SC Payout', value: Number(data.scCasinoWins || 0) },
	];

	const chartColors = getChartColorsArray(
		'["--bs-success","--bs-primary", "--bs-danger","--bs-info", "--bs-warning"]'
	); // 2 sets of colors for two data points in each chart

	return (
		<Row>
			<Col xl={3} md={6} sm={6}>
				<Card>
					<SingleChart
						data={PnLData}
						colors={chartColors}
						isAmount
						chartTitle="P&L Report"
					/>
				</Card>
			</Col>

			<Col xl={3} md={6} sm={6}>
				<Card>
					<SingleChart
						data={purchaseRedeem}
						colors={chartColors}
						isAmount
						chartTitle="Purchase & Redeem"
					/>
				</Card>
			</Col>

			<Col xl={3} md={6} sm={6}>
				<Card>
					<SingleChart
						data={countData}
						colors={chartColors}
						chartTitle="Transaction Counts"
					/>
				</Card>
			</Col>

			<Col xl={3} md={6} sm={6}>
				<Card>
					<SingleChart
						data={winBetData}
						colors={chartColors}
						isAmount
						chartTitle="GC Game Transactions"
					/>
				</Card>
			</Col>

			{/* <Col xl={2} md={6} sm={6}>
                <Card>
                    <div className="p-3">
                        <h5>Profit: <span className="h5 text-success">{defaultCurrency?.symbol || ''}{data.profit}</span></h5>
                    </div>
                    <div className="p-3">
                        <h5>Wagered: <span className="h5 text-success">{data.wagered}</span></h5>
                    </div>
                    <div className="p-3">
                        <h5>Payout: <span className="h5 text-danger">{data.payout}</span></h5>
                    </div>
                </Card>
            </Col> */}
		</Row>
	);
};

export default PlayerStats;
