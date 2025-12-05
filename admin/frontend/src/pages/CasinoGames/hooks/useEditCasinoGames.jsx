import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { editCasinoGamesStart } from '../../../store/actions';
import useForm from '../../../components/Common/Hooks/useFormModal';
import {
	getInitialValues,
	staticFormFields,
	validationSchema,
} from '../formDetails';
import { selectedLanguage } from '../../../constants/config';

const useEditCasinoGames = () => {
	const dispatch = useDispatch();
	const [isEdit, setIsEdit] = useState({ open: false, selectedRow: '' });
	const { isEditCasinoGamesLoading, isEditCasinoGamesSuccess } = useSelector(
		(state) => state.CasinoManagementData
	);

	const { casinoProvidersData } = useSelector(
		(state) => state.CasinoManagementData
	);

	const handleEditCasinoGames = (values) => {
		const formData = {
			gameId: values.gameId,
			name: { [selectedLanguage]: values.name },
			mobileFile:
				values.mobileImage instanceof File ? values.mobileImage : undefined,
			desktopFile:
				values.desktopImage instanceof File ? values.desktopImage : undefined,
			newProviderId: values.casinoProviderId,
			newCategoryId: values.gameCategoryId,
			setDefaultImage: true,
		};

		dispatch(
			editCasinoGamesStart({
				data: formData,
			})
		);
	};

	const { isOpen, setIsOpen, header, validation, formFields, setFormFields } =
		useForm({
			header: 'Edit Casino Game',
			initialValues: getInitialValues(),
			validationSchema,
			staticFormFields,
			onSubmitEntry: handleEditCasinoGames,
		});

	useEffect(() => {
		if (isEditCasinoGamesSuccess) setIsOpen(false);
	}, [isEditCasinoGamesSuccess]);

	const onClickEdit = (selectedRow) => {
		setIsEdit({ open: !isEdit, selectedRow });
		validation.setValues(getInitialValues(selectedRow));
		setIsOpen((prev) => !prev);
	};

	// useEffect(() => {
	// 	setIsOpen(false);
	// }, [casinoCategoryDetails?.count]);

	useEffect(() => {
		if (casinoProvidersData?.providers?.length) {
			const provOptions = casinoProvidersData?.providers?.map((r) => ({
				id: r.id,
				optionLabel: r.name?.[selectedLanguage],
				value: r.id,
			}));

			setFormFields([
				...staticFormFields,
				{
					name: 'casinoProviderId',
					label: 'Provider Name',
					fieldType: 'select',
					optionList: provOptions,
					isDisabled: true,
				},
			]);
		}
	}, [casinoProvidersData]);

	return {
		isOpen,
		setIsOpen,
		header,
		validation,
		formFields,
		setFormFields,
		isEditCasinoGamesLoading,
		onClickEdit,
	};
};

export default useEditCasinoGames;
