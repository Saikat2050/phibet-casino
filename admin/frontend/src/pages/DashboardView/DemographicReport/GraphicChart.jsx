/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import React, { useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import ReactEcharts from 'echarts-for-react';
import getChartColorsArray from '../../../components/Common/ChartsDynamicColor';
import { addCommasToNumber, formatInKMB } from '../../../utils/helpers';
import Spinners from '../../../components/Common/Spinner';

const CountryLineBarChart = ({
	dataColors = '["--bs-primary", "--bs-success", "--bs-danger","--bs-info", "--bs-warning"]',
	chartData = [],
	layoutModeType,
	isLoading,
}) => {
	const spineareaChartColors = getChartColorsArray(dataColors);
	const { defaultCurrency } = useSelector((state) => state.Currencies);
	const colorScheme = {
		light: {
			axisLineColor: '#8791af',
			splitLineColor: 'rgba(166, 176, 207, 0.1)',
			textColor: '#c48e48',
			axisLabelColor: '#000',
		},
		dark: {
			axisLineColor: '#8791af',
			splitLineColor: 'rgba(166, 176, 207, 0.1)',
			textColor: '#fff',
			axisLabelColor: '#fff',
		},
	};

	const { axisLineColor, splitLineColor, textColor, axisLabelColor } =
		colorScheme[layoutModeType] || colorScheme.light;

	const { countryNames, signUpCounts, depositorCounts, depositAmounts } =
		useMemo(() => {
			const filteredCountryNames = chartData.map((val) => val.countryName);
			const filteredSignUpCounts = chartData.map((val) =>
				parseInt(val.signUpCount, 10)
			);
			const filteredDepositorCounts = chartData.map((val) =>
				parseInt(val.depositorCount, 10)
			);
			const filteredDepositAmounts = chartData.map((val) =>
				parseFloat(val.depositAmount)?.toFixed(2)
			);

			return {
				countryNames: filteredCountryNames,
				signUpCounts: filteredSignUpCounts,
				depositorCounts: filteredDepositorCounts,
				depositAmounts: filteredDepositAmounts,
			};
		}, [chartData]);

	const legendNames = ['Deposit Amount', 'Depositor Count', 'Sign-Up Count'];

	const echartsRef = useRef(null);

	const options = useMemo(
		() => ({
			grid: {
				zlevel: 0,
				x: 60,
				x2: 20,
				y: 30,
				y2: 30,
				borderWidth: 0,
				backgroundColor: 'rgba(0,0,0,0)',
				borderColor: 'rgba(0,0,0,0)',
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					crossStyle: {
						color: '#999',
					},
				},
			},
			color: spineareaChartColors,
			legend: {
				data: legendNames,
				textStyle: {
					color: axisLabelColor,
					fontWeight: 600,
				},
			},
			xAxis: [
				{
					type: 'category',
					data: countryNames,
					axisPointer: {
						type: 'shadow',
					},
					axisLine: {
						lineStyle: {
							color: axisLineColor,
						},
					},
				},
			],
			yAxis: [
				{
					type: 'value',
					name: '',
					min: 0,
					axisLine: {
						lineStyle: {
							color: axisLineColor,
						},
					},
					splitLine: {
						lineStyle: {
							color: splitLineColor,
						},
					},
					axisLabel: {
						formatter: (value) =>
							`${defaultCurrency?.symbol || ''} ${formatInKMB(value) || ''}`,
						textStyle: {
							color: axisLabelColor,
							fontWeight: 600,
						},
					},
				},
				{
					type: 'value',
					name: '',
					min: 0,
					axisLine: {
						lineStyle: {
							color: axisLineColor,
						},
					},
					splitLine: {
						lineStyle: {
							color: splitLineColor,
						},
					},
					axisLabel: {
						formatter: (value) => `${formatInKMB(value) || ''}`,
						textStyle: {
							color: axisLabelColor,
							fontWeight: 600,
						},
					},
				},
			],
			series: [
				{
					name: legendNames[0],
					type: 'bar',
					data: depositAmounts,
					label: {
						show: true,
						color: layoutModeType === 'dark' ? '#fff' : '#000',
						position: 'top',
						formatter: (params) =>
							`${defaultCurrency?.symbol || ''} ${addCommasToNumber(
								params.value
							)}`,
					},
				},
				{
					name: legendNames[1],
					type: 'line',
					smooth: true,
					yAxisIndex: 1,
					data: depositorCounts,
					lineStyle: {
						width: 3,
					},
				},
				{
					name: legendNames[2],
					type: 'line',
					smooth: true,
					yAxisIndex: 1,
					data: signUpCounts,
					lineStyle: {
						width: 3,
					},
				},
			],
			textStyle: {
				color: textColor,
			},
		}),
		[
			countryNames,
			depositAmounts,
			depositorCounts,
			signUpCounts,
			textColor,
			axisLineColor,
			splitLineColor,
			axisLabelColor,
			defaultCurrency?.symbol,
			spineareaChartColors,
			layoutModeType,
		]
	);

	return (
		<div>
			{isLoading && !chartData?.length ? (
				<div style={{ height: '350px' }}>
					<Spinners />
				</div>
			) : (
				<ReactEcharts
					ref={echartsRef}
					style={{ height: '350px' }}
					option={options}
				/>
			)}
		</div>
	);
};

export default CountryLineBarChart;
