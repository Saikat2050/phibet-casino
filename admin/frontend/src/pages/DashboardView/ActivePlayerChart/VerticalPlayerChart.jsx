/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import moment from 'moment';
import React, { useMemo } from 'react';
import ReactEcharts from 'echarts-for-react';
import getChartColorsArray from '../../../components/Common/ChartsDynamicColor';

const ActiveUsersLineChart = ({
	dataColors,
	chartData = [],
	layoutModeType,
}) => {
	const spineareaChartColors = getChartColorsArray(dataColors);

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

	const { activeUsersCount, dates } = useMemo(() => {
		if (!chartData?.dates?.length) {
			return { dates: [], activeUsersCount: [] };
		}

		return {
			dates: chartData.dates.map((date) => moment(date).format('D MMM YYYY')),
			activeUsersCount: chartData.activePlayerStats.activePlayers,
		};
	}, [chartData]);

	const options = {
		grid: {
			zlevel: 0,
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true,
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'line',
			},
		},
		// toolbox: {
		// 	orient: 'start',
		// 	left: -5,
		// 	top: 25,
		// 	feature: {
		// 		dataView: { show: true, readOnly: false, title: 'Data View' },
		// 		saveAsImage: { show: true, title: 'Download Image' },
		// 	},
		// },
		color: spineareaChartColors,
		xAxis: [
			{
				type: 'category',
				data: dates,
				axisPointer: {
					type: 'shadow',
				},
				axisLine: {
					lineStyle: {
						color: axisLineColor,
					},
				},
				axisLabel: {
					rotate: 45,
					// formatter: (value) => {
					// 	const parts = value.split(' - ');
					// 	return parts.length === 2 ? `${parts[0]}\n-\n${parts[1]}` : value;
					// },
					textStyle: {
						color: axisLabelColor,
						fontWeight: 600,
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
					textStyle: {
						color: axisLabelColor,
						fontWeight: 600,
					},
				},
			},
		],
		series: [
			{
				name: 'Active Users',
				type: 'line',
				data: activeUsersCount,
				smooth: true,
				lineStyle: {
					width: 2,
				},
			},
		],
		textStyle: {
			color: textColor,
		},
	};

	return (
		<div>
			<ReactEcharts style={{ height: '350px' }} option={options} />
		</div>
	);
};

export default ActiveUsersLineChart;

// /* eslint-disable no-nested-ternary */
// /* eslint-disable react/prop-types */
// import moment from 'moment';
// import React, { useMemo } from 'react';
// import ReactEcharts from 'echarts-for-react';
// import getChartColorsArray from '../../../components/Common/ChartsDynamicColor';
// import Spinners from '../../../components/Common/Spinner';

// const ActiveUsersBarChart = ({
// 	dataColors,
// 	chartData,
// 	layoutModeType,
// 	statsDataLoading,
// }) => {
// 	const spineareaChartColors = getChartColorsArray(dataColors);

// 	const colorScheme = {
// 		light: {
// 			axisLineColor: '#8791af',
// 			splitLineColor: 'rgba(166, 176, 207, 0.1)',
// 			textColor: '#c48e48',
// 			axisLabelColor: '#000',
// 		},
// 		dark: {
// 			axisLineColor: '#8791af',
// 			splitLineColor: 'rgba(166, 176, 207, 0.1)',
// 			textColor: '#fff',
// 			axisLabelColor: '#fff',
// 		},
// 	};

// 	const { axisLineColor, splitLineColor, textColor, axisLabelColor } =
// 		colorScheme[layoutModeType] || colorScheme.light;

// 	const { activeUsersCount, dates } = useMemo(() => {
// 		const filteredDates = chartData?.map((val) =>
// 			val.start_date !== val.end_date
// 				? `${moment(val.start_date).format('D MMM')} - ${moment(
// 						val.end_date
// 				  ).format('D MMM YYYY')}`
// 				: moment(val.end_date).format('D MMM YYYY')
// 		);
// 		const filteredActiveUsersCount = chartData?.map((val) =>
// 			parseInt(val.active_users_count, 10)
// 		);

// 		return {
// 			dates: filteredDates,
// 			activeUsersCount: filteredActiveUsersCount,
// 		};
// 	}, [chartData]);

// 	const options = {
// 		grid: {
// 			zlevel: 0,
// 			left: 30,
// 			right: '10%',
// 			bottom: 0,
// 			containLabel: true,
// 		},
// 		tooltip: {
// 			trigger: 'axis',
// 			axisPointer: {
// 				type: 'shadow',
// 			},
// 		},
// 		color: spineareaChartColors,
// 		yAxis: [
// 			{
// 				type: 'category',
// 				data: dates,
// 				axisPointer: {
// 					type: 'shadow',
// 				},
// 				axisLine: {
// 					lineStyle: {
// 						color: axisLineColor,
// 					},
// 				},
// 				axisLabel: {
// 					textStyle: {
// 						color: axisLabelColor,
// 						fontWeight: 600,
// 					},
// 				},
// 			},
// 		],
// 		xAxis: [
// 			{
// 				type: 'value',
// 				name: 'Active Users',
// 				nameLocation: 'center',
// 				nameGap: 25,
// 				min: 0,
// 				axisLine: {
// 					lineStyle: {
// 						color: axisLineColor,
// 					},
// 				},
// 				splitLine: {
// 					lineStyle: {
// 						color: splitLineColor,
// 					},
// 				},
// 				axisLabel: {
// 					textStyle: {
// 						color: axisLabelColor,
// 						fontWeight: 600,
// 					},
// 				},
// 			},
// 		],
// 		series: [
// 			{
// 				name: 'Active Users',
// 				type: 'bar',
// 				data: activeUsersCount,
// 				barWidth: '60%',
// 			},
// 		],
// 		textStyle: {
// 			color: textColor,
// 		},
// 	};

// 	return (
// 		<div>
// 			{statsDataLoading && !chartData ? (
// 				<div style={{ height: '350px' }}>
// 					<Spinners />
// 				</div>
// 			) : (
// 				<ReactEcharts style={{ height: '350px' }} option={options} />
// 			)}
// 		</div>
// 	);
// };

// export default ActiveUsersBarChart;
