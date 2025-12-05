/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import moment from 'moment';
import React, { useMemo } from 'react';
import ApexCharts from 'react-apexcharts';
import { addCommasToNumber } from '../../../utils/helpers';
import Spinners from '../../../components/Common/Spinner';

const CarbonLineBarChart = ({
	chartData,
	// layoutModeType,
	statsDataLoading,
}) => {
	const { dateSeries, series } = useMemo(() => {
		if (!chartData?.dates) {
			return { dateSeries: [], series: [], totals: { amount: 0, count: 0 } };
		}

		return {
			dateSeries: chartData.dates.map((date) => moment(date).format('ll')),
			series: [
				{
					name: 'Success Count',
					data: chartData.redeemStats.successCount,
				},
				{
					name: 'Success Amount',
					data: chartData.redeemStats.successAmount,
				},
				{
					name: 'Failed Count',
					data: chartData.redeemStats.failedCount,
				},
				{
					name: 'Failed Amount',
					data: chartData.redeemStats.failedAmount,
				},
				// {
				// 	name: 'Pending Count',
				// 	data: chartData.redeemStats.pendingCount,
				// },
				// {
				// 	name: 'Pending Amount',
				// 	data: chartData.redeemStats.pendingAmount,
				// },
			],
		};
	}, [chartData]);

	const baseChartOptions = {
		chart: {
			type: 'line',
			height: 350,
			stacked: true,
			toolbar: { show: false },
			zoom: { enabled: true },
		},
		plotOptions: {
			bar: {
				horizontal: false,
				borderRadius: 6,
				borderRadiusApplication: 'end',
				borderRadiusWhenStacked: 'last',
				borderWidth: 2,
				borderColor: '#000',
			},
		},
		dataLabels: { enabled: false },
		legend: { position: 'bottom', offsetY: 10 },
		fill: { opacity: 0.7 },
		tooltip: {
			y: {
				formatter: (val, { seriesIndex }) =>
					seriesIndex === 0 ? Math.floor(val) : val,
			},
		},
	};

	const chartOptions = {
		...baseChartOptions,
		colors: ['#28a745', '#34c759', '#dc3545', '#ff3b30', '#ffc107', '#ffcc00'],
		xaxis: { categories: dateSeries },
	};

	return (
		<div id="chart">
			<div className="d-flex justify-content-start flex-wrap gap-3">
				<div className="badge bg-success-subtle text-dark p-3 fs-4 rounded-4">
					<h6 className="mb-0 font-weight-bold">
						<span className="text-success">Success Amount:</span>{' '}
						{addCommasToNumber(
							chartData.redeemStats.successAmount.reduce(
								(acc, val) => acc + val,
								0
							),
							2
						)}
					</h6>
				</div>
				<div className="badge bg-success-subtle text-dark p-3 fs-4 rounded-4">
					<h6 className="mb-0 font-weight-bold">
						<span className="text-success">Success Count:</span>{' '}
						{addCommasToNumber(
							chartData.redeemStats.successCount.reduce(
								(acc, val) => acc + val,
								0
							)
						)}
					</h6>
				</div>
				<div className="badge bg-danger-subtle text-dark p-3 fs-4 rounded-4">
					<h6 className="mb-0 font-weight-bold">
						<span className="text-danger">Failed Amount:</span>{' '}
						{addCommasToNumber(
							chartData.redeemStats.failedAmount.reduce(
								(acc, val) => acc + val,
								0
							),
							2
						)}
					</h6>
				</div>
				<div className="badge bg-danger-subtle text-dark p-3 fs-4 rounded-4">
					<h6 className="mb-0 font-weight-bold">
						<span className="text-danger">Failed Count:</span>{' '}
						{addCommasToNumber(
							chartData.redeemStats.failedCount.reduce(
								(acc, val) => acc + val,
								0
							)
						)}
					</h6>
				</div>
				{/* <div className="badge bg-warning-subtle text-dark p-3 fs-4 rounded-4">
					<h6 className="mb-0 font-weight-bold">
						<span className="text-warning">Pending Amount:</span>{' '}
						{addCommasToNumber(
							chartData.redeemStats.pendingAmount.reduce(
								(acc, val) => acc + val,
								0
							)
						)}
					</h6>
				</div>
				<div className="badge bg-warning-subtle text-dark p-3 fs-4 rounded-4">
					<h6 className="mb-0 font-weight-bold">
						<span className="text-warning">Pending Count:</span>{' '}
						{addCommasToNumber(
							chartData.redeemStats.pendingCount.reduce(
								(acc, val) => acc + val,
								0
							)
						)}
					</h6>
				</div> */}
			</div>
			{statsDataLoading ? (
				<div style={{ height: '350px' }}>
					<Spinners />
				</div>
			) : (
				<ApexCharts
					options={chartOptions}
					series={series}
					type="bar"
					height={350}
				/>
			)}
		</div>
	);
};

export default CarbonLineBarChart;
