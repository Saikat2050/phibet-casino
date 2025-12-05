/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	fetchLanguageManagementStart,
	resetLanguageManagementData,
} from '../../../store/actions';
import { English, Keys } from '../LanguageManagementCol';
import { downloadFileInNewWindow } from '../../../utils/helpers';
import { getAccessToken } from '../../../network/storageUtils';
import { MANAGEMENT } from '../../../network/networkUtils';

const itemsPerPage = 10;
const { VITE_APP_API_URL } = import.meta.env;

const useLanguageManagementListing = () => {
	const dispatch = useDispatch();
	const [searchText, setSearchText] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const { languageManagement, loading: isLanguageManagementLoading } =
		useSelector((state) => state.LanguageManagement);

	useEffect(() => {
		dispatch(
			fetchLanguageManagementStart({
				perPage: itemsPerPage,
				page: currentPage,
				search: searchText,
			})
		);
	}, [currentPage, searchText]);

	// resetting lang management redux state
	useEffect(() => () => dispatch(resetLanguageManagementData()), []);

	const formattedLanguageManagement = useMemo(() => {
		const formattedValues = [];
		if (languageManagement && languageManagement.languageKeys) {
			Object.values(languageManagement.languageKeys).map((keys) =>
				keys.map((key) =>
					formattedValues.push({
						keys: key,
						english: languageManagement?.languageData?.[0]?.[key],
					})
				)
			);
		}

		return formattedValues;
	}, [languageManagement]);

	const columns = useMemo(
		() => [
			{
				Header: 'Keys',
				accessor: 'keys',
				filterable: true,
				Cell: ({ cell }) => <Keys value={cell.value} />,
			},
			{
				Header: 'English',
				accessor: 'english',
				filterable: true,
				Cell: ({ cell }) => <English cell={cell} />,
			},
			// {
			// 	Header: 'Action',
			// 	// accessor: 'username',
			// 	filterable: true,
			// 	Cell: (cellProps) => <Action {...cellProps} />,
			// },
		],
		[]
	);

	const handleDownload = () =>
		downloadFileInNewWindow(
			`${VITE_APP_API_URL}/api/admin${
				MANAGEMENT.LANGUAGE
			}support-keys?csvDownload=true&token=${getAccessToken()}`
		);

	const buttonList = useMemo(() => [
		{
			label: '',
			handleClick: handleDownload,
			link: '#!',
			tooltip: 'Download as Xls',
			icon: <i className="mdi mdi-file-download-outline" />,
		},
	]);

	return {
		searchText,
		setSearchText,
		currentPage,
		setCurrentPage,
		totalLanguageManagementCount: languageManagement?.count,
		isLanguageManagementLoading,
		formattedLanguageManagement,
		itemsPerPage,
		columns,
		buttonList,
	};
};

export default useLanguageManagementListing;
