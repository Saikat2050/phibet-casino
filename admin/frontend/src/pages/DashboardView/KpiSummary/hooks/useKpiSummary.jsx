/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { KPI_SUMMARY_NAMES, TABS } from '../../constant';
import { getKpiSummaryStart } from '../../../../store/dashboardView/actions';
import { Delta, RowName, Today, Yesterday } from '../KpiListCol';
import { getPercentage } from '../../../../utils/helpers';
import { defaultCurrencyId } from '../../../../constants/config';

const useKpiSummary = () => {
	const dispatch = useDispatch();
	const [activeKpiSummTab, setActiveKpiSummTab] = useState(TABS.CASINO);
	const [kpiSummaryDate, setKpiSummaryDate] = useState('today');
	const [currencyId, setCurrencyId] = useState(defaultCurrencyId);
	const { kPISummary, isKpiSummaryLoading } = useSelector(
		(state) => state.DashboardViewInfo
	);
	const { currencies, defaultCurrency, currencyById } = useSelector(
		(state) => state.Currencies
	);

	const loadKPISummary = () => {
		dispatch(
			getKpiSummaryStart({
				tab: activeKpiSummTab,
				// dateOptions: kpiSummaryDate,
				currencyId,
			})
		);
	};

	useEffect(() => {
		if (activeKpiSummTab && currencyId) {
			loadKPISummary();
		}
	}, [activeKpiSummTab, kpiSummaryDate, currencyId]);

	const formattedKpiSummary = useMemo(() => {
		if (!isEmpty(kPISummary)) {
			const currency =
				currencies?.currencies?.find((curr) => curr.id === currencyId) ||
				defaultCurrency;
			return KPI_SUMMARY_NAMES.filter(
				(names) =>
					!(names.value === 'wincount' && activeKpiSummTab === TABS.SPORT)
			).map(({ label, value, isAmount }) => {
				const delta = getPercentage(
					Number(kPISummary[`monthtodate${value}`] || 0),
					Number(kPISummary[`pastmonthtodate${value}`] || 0)
				);
				return {
					name: label,
					today: `${isAmount ? currency.symbol : ''} ${Number(
						kPISummary[`today${value}`] || 0
					)?.toFixed(isAmount ? 2 : 0)}`,
					yesterday: `${isAmount ? currency.symbol : ''} ${Number(
						kPISummary[`yesterday${value}`] || 0
					)?.toFixed(isAmount ? 2 : 0)}`,
					monthToDate: `${isAmount ? currency.symbol : ''} ${Number(
						kPISummary[`monthtodate${value}`] || 0
					)?.toFixed(isAmount ? 2 : 0)}`,
					delta: `${delta} %`,
				};
			});
		}
		return [];
	}, [kPISummary, currencyId]);

	const kPISummaryColumn = useMemo(
		() => [
			{
				Header: 'Name',
				accessor: 'name',
				filterable: true,
				customColumnStyle: { fontWeight: 'bold' },
				Cell: ({ cell }) => <RowName cell={cell?.value || ''} />,
			},
			{
				Header: 'TODAY',
				accessor: 'today',
				filterable: true,
				Cell: ({ cell }) => <Today cell={cell?.value || ''} />,
			},
			{
				Header: 'YESTERDAY',
				accessor: 'yesterday',
				filterable: true,
				Cell: ({ cell }) => <Yesterday cell={cell?.value || ''} />,
			},
			{
				Header: 'MONTH TO DATE',
				accessor: 'monthToDate',
				filterable: true,
				// Cell: ({ cell }) => <Role cell={cell?.value || ''} />,
			},
			{
				Header: 'DELTA',
				accessor: 'delta',
				disableFilters: true,
				Cell: ({ cell }) => <Delta cell={cell?.value || ''} />,
				tableHeaderTooltipContent: (
					<p>
						Percentage change in month to date value with respect to old month
						to date value.
					</p>
				),
			},
		],
		[]
	);

	return {
		activeKpiSummTab,
		setActiveKpiSummTab,
		kPISummaryColumn,
		kPISummary,
		formattedKpiSummary,
		isKpiSummaryLoading,
		loadKPISummary,
		kpiSummaryDate,
		setKpiSummaryDate,
		currencyId,
		setCurrencyId,
		currencies,
		currencyById,
	};
};

export default useKpiSummary;
