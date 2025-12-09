/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import moment from 'moment';
import React, { useMemo } from 'react';
import ApexCharts from 'react-apexcharts';
// import { addCommasToNumber } from '../../../utils/helpers';
import Spinners from '../../../components/Common/Spinner';

const CarbonLineBarChart = ({
	chartData,
	// layoutModeType,
	statsDataLoading,
}) => {
	const { dateSeries, series } = useMemo(() => {
		if (!chartData?.dates) {
			return { dateSeries: [], series: [] };
		}

		return {
			dateSeries: chartData.dates.map((date) => moment(date).format('ll')),
			series: [
				{
					name: 'Payout Count',
					data: chartData.payoutStats.gcCount,
				},
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
		colors: ['#57392b', '#8a5444', '#9b654c', '#9b734c'],
		xaxis: { categories: dateSeries },
	};

	return (
		<div id="chart">
			<div className="d-flex justify-content-start flex-wrap gap-3">
				{/* <div className="badge bg-info-subtle text-dark p-3 fs-4 rounded-4">
					<h6 className="mb-0 font-weight-bold">
						<span style={{ color: '#57392b' }}>GC Coins:</span>{' '}
						{addCommasToNumber(
							chartData.payoutStats.gcAmount.reduce((acc, val) => acc + val, 0),
							2
						)}
					</h6>
				</div>
				<div className="badge bg-info-subtle text-dark p-3 fs-4 rounded-4">
					<h6 className="mb-0 font-weight-bold">
						<span style={{ color: '#8a5444' }}>GC Count:</span>{' '}
						{addCommasToNumber(
							chartData.payoutStats.gcCount.reduce((acc, val) => acc + val, 0)
						)}
					</h6>
				</div>
				<div className="badge bg-info-subtle text-dark p-3 fs-4 rounded-4">
					<h6 className="mb-0 font-weight-bold">
						<span style={{ color: '#9b654c' }}>SC Coins:</span>{' '}
						{addCommasToNumber(
							chartData.payoutStats.scAmount.reduce((acc, val) => acc + val, 0),
							2
						)}
					</h6>
				</div>
				<div className="badge bg-info-subtle text-dark p-3 fs-4 rounded-4">
					<h6 className="mb-0 font-weight-bold">
						<span style={{ color: '#9b734c' }}>SC Count:</span>{' '}
						{addCommasToNumber(
							chartData.payoutStats.scCount.reduce((acc, val) => acc + val, 0)
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
