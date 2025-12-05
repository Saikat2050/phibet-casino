import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import {
	addGameToCategoryStart,
	getCasinoGamesStart,
	getCasinoCategoryDetailStart,
	getCasinoProvidersDataStart,
} from '../../../store/actions';
import { showToastr } from '../../../utils/helpers';
import { selectedLanguage } from '../../../constants/config';
import SelectedFilters from '../../../components/Common/SelectedFilters';
import {
	filterValidationSchema,
	filterValues,
	staticFiltersFields,
} from '../../CasinoGames/formDetails';
import useForm from '../../../components/Common/Hooks/useFormModal';
import CustomFilters from '../../../components/Common/CustomFilters';

const keyMapping = {
	searchString: 'Search',
	casinoProviderId: 'Provider',
};

const useAddGamesToCasinoCategory = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { categoryId } = useParams();
	const [newGamesData, setNewGamesData] = useState([]);
	const [pageNo, setPageNo] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [newGamepageNo, setNewGamepageNo] = useState(1);
	const isFirst = useRef(true);
	const [newGameItemsPerPage, setNewGameItemsPerPage] = useState(10);
	const { casinoGames, isCasinoGamesLoading, casinoProvidersData } =
		useSelector((state) => state.CasinoManagementData);

	const { validation, formFields, setFormFields } = useForm({
		initialValues: filterValues(),
		validationSchema: filterValidationSchema(),
		staticFormFields: staticFiltersFields(),
	});

	const fetchData = () => {
		if (categoryId) {
			dispatch(
				getCasinoGamesStart({
					perPage: itemsPerPage,
					page: pageNo,
					notIncluded: true,
					casinoCategoryId: categoryId,
					casinoProviderId: validation?.values?.casinoProviderId,
					searchString: validation?.values?.searchString,
				})
			);
		}
	};

	useEffect(() => {
		if (isFirst.current) {
			isFirst.current = false;
		} else {
			fetchData();
		}
	}, [categoryId, pageNo, itemsPerPage]);

	const handleFilter = () => {
		fetchData();
	};

	const formattedGames = useMemo(() => {
		if (casinoGames) {
			return casinoGames?.games?.map((game) => ({
				...game,
				name: game?.name?.[selectedLanguage],
				devices: Array.isArray(game.devices)
					? game.devices.join(', ')
					: game.devices,
				providerName: game?.casinoProvider?.name?.[selectedLanguage],
			}));
		}
		return [];
	}, [casinoGames]);

	const handleAddGame = (e, row) => {
		e.preventDefault();

		setNewGamesData((prevData) => {
			if (!prevData.find((game) => game.id === row.id)) {
				return [...prevData, row];
			}
			showToastr({
				message: 'Game already added',
				type: 'error',
			});
			return prevData;
		});
	};

	const handleRemoveGame = (e, id) => {
		e.preventDefault();

		setNewGamesData((prevData) => prevData.filter((game) => game.id !== id));
	};

	const onChangeRowsPerPage = (value) => {
		setItemsPerPage(value);
	};

	const onChangeNewGameTableRowsPerPage = (value) => {
		setNewGameItemsPerPage(value);
	};

	const handleSubmitClick = () => {
		if (newGamesData.length) {
			dispatch(
				addGameToCategoryStart({
					categoryId,
					gameIds: newGamesData?.map((game) => game.id),
					navigate,
				})
			);
		}
	};

	useEffect(() => {
		dispatch(getCasinoCategoryDetailStart());
		dispatch(getCasinoProvidersDataStart());
	}, []);

	useEffect(() => {
		if (casinoProvidersData?.providers) {
			const providerField = casinoProvidersData?.providers?.map((row) => ({
				optionLabel: row.name[selectedLanguage],
				value: row.id,
			}));

			setFormFields([
				{
					name: 'casinoProviderId',
					fieldType: 'select',
					label: '',
					placeholder: 'Provider',
					optionList: providerField,
				},
			]);
		}
	}, [casinoProvidersData]);

	const filterFormatter = (key, value) => {
		const formattedKey = keyMapping[key] || key;
		let formattedValue = value;
		switch (key) {
			case 'casinoProviderId':
				formattedValue =
					casinoProvidersData?.providers?.find((row) => row?.id === value)
						?.name[selectedLanguage] || '';
				break;
			default:
				break;
		}
		return `${formattedKey}: ${formattedValue}`;
	};

	const selectedFiltersComponent = (
		<SelectedFilters
			validation={validation}
			filterFormatter={filterFormatter}
		/>
	);

	const filterComponent = (
		<CustomFilters
			filterFields={formFields}
			validation={validation}
			handleFilter={handleFilter}
			showSearchInput={false}
		/>
	);

	return {
		pageNo,
		setPageNo,
		itemsPerPage,
		setItemsPerPage,
		formattedGames,
		isCasinoGamesLoading,
		totalPages: casinoGames?.totalPages,
		onChangeRowsPerPage,
		handleAddGame,
		newGamesData,
		handleRemoveGame,
		newGamepageNo,
		setNewGamepageNo,
		newGameItemsPerPage,
		setNewGameItemsPerPage,
		onChangeNewGameTableRowsPerPage,
		handleSubmitClick,
		selectedFiltersComponent,
		filterComponent,
		validation,
	};
};

export default useAddGamesToCasinoCategory;
