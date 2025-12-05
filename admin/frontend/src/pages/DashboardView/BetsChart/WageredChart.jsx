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
			return { dateSeries: [], series: [] };
		}

		return {
			dateSeries: chartData.dates.map((date) => moment(date).format('ll')),
			series: [
				{
					name: 'GC Wagered Count',
					data: chartData.wageredStats.gcCount,
				},
				{
					name: 'GC Wagered Coins',
					data: chartData.wageredStats.gcAmount,
				},
				{
					name: 'SC Wagered Count',
					data: chartData.wageredStats.scCount,
				},
				{
					name: 'SC Wagered Coins',
					data: chartData.wageredStats.scAmount,
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
		colors: [
			'#07664b', // GC Count
			'#43f7c8', // GC Amount
			'#0a8f6c', // SC Count
			'#3ddb9f', // SC Amount
		],
		xaxis: { categories: dateSeries },
	};

	return (
		<div id="chart">
			<div className="d-flex justify-content-start flex-wrap gap-3">
				<div className="badge bg-success-subtle text-dark p-3 fs-4 rounded-4">
					<h6 className="mb-0 font-weight-bold">
						<span style={{ color: '#07664b' }}>GC Coins:</span>{' '}
						{addCommasToNumber(
							chartData.wageredStats.gcAmount?.reduce(
								(acc, val) => acc + val,
								0
							),
							2
						)}
					</h6>
				</div>
				<div className="badge bg-success-subtle text-dark p-3 fs-4 rounded-4">
					<h6 className="mb-0 font-weight-bold">
						<span style={{ color: '#07664b' }}>GC Count:</span>{' '}
						{addCommasToNumber(
							chartData.wageredStats.gcCount?.reduce((acc, val) => acc + val, 0)
						)}
					</h6>
				</div>
				<div className="badge bg-success-subtle text-dark p-3 fs-4 rounded-4">
					<h6 className="mb-0 font-weight-bold">
						<span style={{ color: '#0a8f6c' }}>SC Coins:</span>{' '}
						{addCommasToNumber(
							chartData.wageredStats.scAmount?.reduce(
								(acc, val) => acc + val,
								0
							),
							2
						)}
					</h6>
				</div>
				<div className="badge bg-success-subtle text-dark p-3 fs-4 rounded-4">
					<h6 className="mb-0 font-weight-bold">
						<span style={{ color: '#0a8f6c' }}>SC Count:</span>{' '}
						{addCommasToNumber(
							chartData.wageredStats.scCount?.reduce((acc, val) => acc + val, 0)
						)}
					</h6>
				</div>
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
