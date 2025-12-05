/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { KeyValueData, Type } from '../bonusListCol';
import { getBonusReport } from '../../../../store/dashboardView/actions';
import { modules } from '../../../../constants/permissions';
import usePermission from '../../../../components/Common/Hooks/usePermission';
import { convertToUTC, getDateRangeForOption } from '../../../../utils/helpers';
import usePlayerOptions from '../../../../utils/usePlayerOptions';

const useBonusReport = () => {
	const dispatch = useDispatch();
	const playerOptions = usePlayerOptions();
	const { isGranted, permissions } = usePermission();
	const [timezone, setTimezone] = useState('GMT');
	const initialDateRange = getDateRangeForOption('last7days');
	const initialUTC = useMemo(
		() =>
			convertToUTC(
				initialDateRange.start.format('YYYY-MM-DD'),
				initialDateRange.end.format('YYYY-MM-DD'),
				timezone
			),
		[timezone, initialDateRange]
	);
	const [bonusReportDateOption, setBonusReportDateOption] = useState({
		selected: 'last7days',
		fromDate: initialUTC.startUTC,
		toDate: initialUTC.endUTC,
	});
	const [currencyId, setCurrencyId] = useState('');
	const [orderBy, setOrderBy] = useState('netProfit');
	const [tagBy, setTagBy] = useState('');
	const { bonusReport, bonusReportLoading } = useSelector((state) => state.DashboardViewInfo);

	const fetchBonusReport = () => {
		if (isGranted(modules.bonusReport, 'R')) {
			const { startUTC, endUTC } = convertToUTC(
				moment(bonusReportDateOption.fromDate).format('YYYY-MM-DD'),
				moment(bonusReportDateOption.toDate).format('YYYY-MM-DD'),
				timezone
			);

			dispatch(
				getBonusReport({
					dateOptions: bonusReportDateOption.selected,
					fromDate: startUTC,
					toDate: endUTC,
					timezone,
					tagIds: tagBy
				})
			);
		}
	};

	const handleDateOptionChange = (e) => {
		const selectedOption = e.target.value;
		const dateRange = getDateRangeForOption(selectedOption);

		setBonusReportDateOption({
			selected: selectedOption,
			fromDate: dateRange.start.toDate(),
			toDate: dateRange.end.toDate(),
		});
	};

	const handleRefresh = () => {
		setOrderBy(null);
		setTagBy(null);
		setCurrencyId(null);
		setBonusReportDateOption({
			selected: 'last7days',
			fromDate: initialUTC.startUTC,
			toDate: initialUTC.endUTC,
		});

		fetchBonusReport();
	};

	const bonusReportFormattedCSV = useMemo(
		() =>
			bonusReport?.result?.map((bonus) => ({
				type: bonus.type ?? null,
				'SC Rewards': bonus.sc ?? null,
				'GC Rewards': bonus.gc ?? null,
				'Claimed Count': bonus.count ?? null
			})) ?? [],
		[bonusReport]
	);

	const bonusReportFormatted = useMemo(() => bonusReport?.result?.map((bonusData) => ({ ...bonusData })) || [], [bonusReport]);

	useEffect(() => {
		fetchBonusReport();
	}, [bonusReportDateOption, orderBy, currencyId, permissions, timezone, tagBy]);

	const columns = useMemo(
		() => [
			{
				Header: 'Type',
				accessor: 'type',
				notHidable: true,
				filterable: true,
				customColumnStyle: { fontWeight: 'bold' },
				Cell: ({ cell }) => <Type cell={cell} />,
			},
			{
				Header: 'SC Rewards',
				accessor: 'sc',
				filterable: true,
				Cell: ({ cell }) => <KeyValueData value={cell?.value} />,
			},
			{
				Header: 'GC Rewards',
				accessor: 'gc',
				filterable: true,
				Cell: ({ cell }) => <KeyValueData value={cell?.value} />,
			},
			{
				Header: 'Count',
				accessor: 'count',
				filterable: true,
				Cell: ({ cell }) => <KeyValueData value={cell?.value} />,
			}
		],
		[]
	);

	return {
		columns,
		bonusReportFormatted,
		bonusReportLoading,
		bonusReportDateOption,
		setBonusReportDateOption,
		tagBy,
		setTagBy,
		timezone,
		setTimezone,
		handleDateOptionChange,
		handleRefresh,
		bonusReportFormattedCSV,
		playerOptions,
	};
};

export default useBonusReport;
