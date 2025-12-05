import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { showToastr } from '../../../utils/helpers';
import useForm from '../../../components/Common/Hooks/useFormModal';
import CasinoGameForm from '../CasinoGameForm';

import {
	getCasinoGamesStart,
	editWageringTemplateDetails,
	getWageringTemplateDetail,
	resetCasinoProvidersData,
	resetCasinoGamesData,
	resetWageringTemplateDetailData,
} from '../../../store/actions';

import {
	getInitialValues,
	createWageringTemplate,
	staticFormFields,
} from '../formDetails';
import useCreateFilters from './useCreateFilter';

const useEditWageringTemplate = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { wageringTemplateId } = useParams();
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [page, setPage] = useState(1);
	const [customComponent, setCustomComponent] = useState();
	const { wageringTemplateDetail } = useSelector(
		(state) => state.WageringTemplate
	);
	const [selectedId, setSelectedId] = useState([]);

	const { casinoGames, isCasinoGamesLoading } = useSelector(
		(state) => state.CasinoManagementData
	);

	const { SAWageringTemplate, SAWageringTemplateLoading } = useSelector(
		(state) => state.WageringTemplate
	);

	const {
		filterValidation,
		filterComponent,
		selectedFiltersComponent,
		casinoProvidersData,
	} = useCreateFilters();

	useEffect(() => {
		if (wageringTemplateId) {
			dispatch(
				getWageringTemplateDetail({
					wageringTemplateId: Number(wageringTemplateId),
				})
			);
		}
	}, []);

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
				wageringTemplateId,
				...values,
			};
			if (Object.keys(templateData.gameContributions).length < 1) {
				showToastr({
					message: 'Select At Least One Game',
					type: 'error',
				});
			} else {
				dispatch(editWageringTemplateDetails({ templateData, navigate }));
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

	const { header, validation, formFields, setFormFields, setHeader } = useForm({
		header: 'Edit Wagering Template',
		initialValues: getInitialValues(),
		validationSchema: createWageringTemplate,
		onSubmitEntry: formSubmitHandler,
		staticFormFields,
	});

	useEffect(() => {
		if (SAWageringTemplate && !SAWageringTemplateLoading) {
			validation.setValues(getInitialValues(SAWageringTemplate?.template?.[0]));
			const selectedIds = {};
			SAWageringTemplate?.template?.[0]?.wageringTemplateGameDetails?.forEach(
				({ casinoGame, contributionPercentage }) => {
					selectedIds[casinoGame.id] = { contributionPercentage };
				}
			);
			setSelectedId(selectedIds);
		}
	}, [SAWageringTemplate, SAWageringTemplateLoading]);

	// resetting redux state
	useEffect(
		() => () => {
			dispatch(resetCasinoProvidersData());
			dispatch(resetCasinoGamesData());
			dispatch(resetWageringTemplateDetailData());
		},
		[]
	);

	useEffect(() => {
		dispatch(
			getCasinoGamesStart({
				perPage: itemsPerPage,
				page,
				...filterValidation?.values,
			})
		);
	}, [filterValidation?.values, itemsPerPage, page]);

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
		selectedId,
		casinoProvidersData,
	]);

	return {
		header,
		validation,
		formFields,
		setFormFields,
		setHeader,
		customComponent,
		setCustomComponent,
		selectedId,
		setSelectedId,
		isCasinoGamesLoading,
		SAWageringTemplate,
		itemsPerPage,
		SAWageringTemplateLoading,
		onChangeRowsPerPage,
		page,
		setPage,
		wageringTemplateDetail,
	};
};

export default useEditWageringTemplate;
