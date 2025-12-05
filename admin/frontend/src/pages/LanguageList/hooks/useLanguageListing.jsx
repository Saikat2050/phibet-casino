/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	fetchLanguagesStart,
	resetLanguagesData,
} from '../../../store/actions';
import { LanguageCode, LanguageName } from '../LanguageListCol';

const useLanguageListing = (filterValues = {}) => {
	const dispatch = useDispatch();
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const { languages, loading: isLanguagesLoading } = useSelector(
		(state) => state.Languages
	);

	const onChangeRowsPerPage = (value) => {
		setItemsPerPage(value);
	};

	useEffect(() => {
		dispatch(
			fetchLanguagesStart({
				perPage: itemsPerPage,
				page: currentPage,
				...filterValues,
			})
		);
	}, [currentPage, itemsPerPage]);

	// resetting language list redux state
	useEffect(() => () => dispatch(resetLanguagesData()), []);

	const formattedLanguages = useMemo(() => {
		const formattedValues = [];
		if (languages) {
			languages.languages.map((language) =>
				formattedValues.push({
					...language,
				})
			);
		}
		return formattedValues;
	}, [languages]);

	const columns = useMemo(
		() => [
			// {
			// 	Header: 'Id',
			// 	accessor: 'id',
			// 	notHidable: true,
			// 	filterable: true,
			// 	Cell: ({ cell }) => <Id value={cell.value} />,
			// },
			{
				Header: 'Language Name',
				accessor: 'name',
				filterable: true,
				Cell: ({ cell }) => <LanguageName value={cell.value} />,
			},
			{
				Header: 'Language Code',
				accessor: 'code',
				filterable: true,
				Cell: ({ cell }) => <LanguageCode value={cell.value} />,
			},
		],
		[]
	);

	return {
		currentPage,
		setCurrentPage,
		totalLanguagesCount: languages?.totalPages,
		isLanguagesLoading,
		formattedLanguages,
		itemsPerPage,
		onChangeRowsPerPage,
		columns,
	};
};

export default useLanguageListing;
