import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { showToastr } from '../../../utils/helpers';
import useForm from '../../../components/Common/Hooks/useFormModal';
import CasinoGameForm from '../CasinoGameForm';
import {
	getCasinoGamesStart,
	createWageringTemplateDetails,
} from '../../../store/actions';

import {
	getInitialValues,
	createWageringTemplate,
	staticFormFields,
} from '../formDetails';
import { formPageTitle } from '../../../components/Common/constants';
import { decryptCredentials } from '../../../network/storageUtils';
import useCreateFilters from './useCreateFilter';

const useCreateWageringTemplate = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [page, setPage] = useState(1);
	const [customComponent, setCustomComponent] = useState();
	const { wageringTemplateDetail } = useSelector(
		(state) => state.WageringTemplate
	);
	const [selectedId, setSelectedId] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [existingFilledData, setExistingFilledData] = useState({});

	const {
		filterValidation,
		filterComponent,
		selectedFiltersComponent,
		casinoProvidersData,
	} = useCreateFilters();

	const {
		// casinoProvidersData,
		casinoGames,
		isCasinoGamesLoading,
		createWageringTemplateDetailLoading,
	} = useSelector((state) => state.CasinoManagementData);

	const formSubmitHandler = (values) => {
		try {
			const templateData = {
				name: values.name,
				gameContributions: Object.keys(selectedId || {})?.map((id) => {
					if (
						selectedId[id].contributionPercentage <= 0 ||
						selectedId[id].contributionPercentage > 100
					) {
						showToastr({
							message: 'Contribution percentage must be in range 0 to 100',
							type: 'error',
						});
						throw new Error();
					}
					return {
						casinoGameId: id,
						contributionPercentage: selectedId[id].contributionPercentage,
					};
				}),
				...values,
			};
			if (Object.keys(templateData.gameContributions).length < 1) {
				showToastr({
					message: 'Select At Least One Game',
					type: 'error',
				});
			} else {
				dispatch(createWageringTemplateDetails({ templateData, navigate }));
			}

			setSelectedId([]);
		} catch (err) {
			console.log('error', err);
		}
	};

	const onChangeRowsPerPage = (value) => {
		setPage(1);
		setItemsPerPage(value);
	};

	const { header, validation, formFields, setFormFields } = useForm({
		header: 'Create',
		initialValues: getInitialValues(),
		validationSchema: createWageringTemplate,
		onSubmitEntry: formSubmitHandler,
		staticFormFields,
	});

	useEffect(() => {
		dispatch(
			getCasinoGamesStart({
				perPage: itemsPerPage,
				page,
				...filterValidation?.values,
			})
		);
	}, [itemsPerPage, page, filterValidation?.values]);

	useEffect(() => {
		setCustomComponent(
			<CasinoGameForm
				values={validation.values}
				casinoGames={casinoGames}
				validation={validation}
				wageringTemplateDetail={wageringTemplateDetail}
				selectedId={selectedId}
				setSelectedId={setSelectedId}
				onChangeRowsPerPage={onChangeRowsPerPage}
				itemsPerPage={itemsPerPage}
				isCasinoGamesLoading={isCasinoGamesLoading}
				page={page}
				setPage={setPage}
				filterValidation={filterValidation}
				filterComponent={filterComponent}
				selectedFiltersComponent={selectedFiltersComponent}
			/>
		);
	}, [
		casinoProvidersData,
		filterValidation?.values,
		casinoGames,
		itemsPerPage,
		page,
		isCasinoGamesLoading,
		selectedId,
	]);

	useEffect(() => {
		setExistingFilledData((prev) => ({
			...prev,
			values: {
				...validation?.values,
				selectedId,
			},
		}));
	}, [validation?.values, selectedId]);

	useEffect(() => {
		if (localStorage.getItem(formPageTitle.wageringTemplate)) {
			const values = JSON.parse(
				decryptCredentials(localStorage.getItem(formPageTitle.wageringTemplate))
			);
			validation.setValues({
				name: values?.name,
				searchString: values?.searchString || '',
				customValue: values?.customValue || '',
			});
			setSelectedId(values?.selectedId || []);
		}
	}, []);

	return {
		header,
		validation,
		formFields,
		setFormFields,
		customComponent,
		setCustomComponent,
		selectedId,
		setSelectedId,
		isCasinoGamesLoading,
		createWageringTemplateDetailLoading,
		showModal,
		setShowModal,
		existingFilledData,
		navigate,
	};
};

export default useCreateWageringTemplate;
