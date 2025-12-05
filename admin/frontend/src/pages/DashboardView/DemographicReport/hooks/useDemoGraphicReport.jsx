/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { countryFilter } from '../../../../utils/countryFilter';
import { getDemographicStart } from '../../../../store/dashboardView/actions';

const useDemoGraphicReport = () => {
	const dispatch = useDispatch();
	const [demoDateOptions, setDemoDateOptions] = useState({
		selected: 'last90days',
		fromDate: '',
		toDate: '',
	});
	const layoutModeType = useSelector((state) => state.Layout.layoutModeType);
	const [countries, setCountries] = useState([]);
	const [demoGrapFormatedData, setDemoGrapFormatedData] = useState([]);
	const { currencyById } = useSelector((state) => state.Currencies);
	const { demoGraphicData, isDemographicLoading } = useSelector(
		(state) => state.DashboardViewInfo
	);

	const fetchData = () => {
		dispatch(
			getDemographicStart({
				dateOptions: demoDateOptions?.selected,
				fromDate: demoDateOptions?.fromDate,
				toDate: demoDateOptions?.toDate,
			})
		);
	};

	const countrySelectOptions = useMemo(
		() =>
			demoGraphicData?.demograph?.map((item) => ({
				label: item.countryName,
				value: item.countryCode,
				...item,
			})),
		[demoGraphicData?.demograph]
	);

	const formatDataHandler = (list) => {
		const tempData = [];

		if (list?.length) {
			list?.map((item) => {
				const { countryName } = countryFilter(item.countryCode);
				const row = {
					x: countryName,
					y: Number(item.signUpCount),
				};
				tempData.push(row);
				return null;
			});
		}
		const finalData = [
			{
				data: tempData,
			},
		];
		setDemoGrapFormatedData(finalData);
	};

	const formattedDemoGraphicData = useMemo(
		() =>
			countries?.map((item) => {
				let totalDeposits = 0;
				let totalDepoCount = 0;

				item?.deposits?.forEach(
					({ currencyId, depositAmount, depositorCount }) => {
						const exchangeRate = Number(
							currencyById?.[currencyId]?.exchangeRate || 1
						);
						const amount = Number(depositAmount || 0);
						totalDeposits += amount * exchangeRate;
						totalDepoCount += Number(depositorCount || 0);
					}
				);
				const copiedItem = { ...item };
				delete copiedItem.deposits;
				return {
					...copiedItem,
					depositorCount: totalDepoCount,
					depositAmount: totalDeposits?.toFixed(2),
				};
			}),
		[countries, currencyById]
	);

	useEffect(() => {
		const { fromDate, toDate, selected } = demoDateOptions;
		if (selected === 'custom') {
			if (fromDate && toDate) {
				fetchData();
			}
		} else {
			fetchData();
		}
	}, [demoDateOptions]);

	useEffect(() => {
		formatDataHandler(countries);
	}, [countries?.length]);
	useEffect(() => {
		if (demoGraphicData?.demograph) {
			const initialCountries = demoGraphicData?.demograph
				?.slice(0, 12)
				?.map((item) => ({
					value: item.countryCode,
					label: item.countryName,
					...item,
				}));
			setCountries(initialCountries);
		}
	}, [demoGraphicData?.demograph]);

	return {
		demoGrapFormatedData,
		formattedDemoGraphicData,
		demoDateOptions,
		setDemoDateOptions,
		isDemographicLoading,
		countries,
		setCountries,
		countrySelectOptions,
		layoutModeType,
	};
};

export default useDemoGraphicReport;
