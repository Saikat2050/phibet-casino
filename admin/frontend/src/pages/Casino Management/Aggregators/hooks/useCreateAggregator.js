/* eslint-disable no-use-before-define */
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import useForm from '../../../../components/Common/Hooks/useFormModal';
import {
	getInitialValues,
	staticFormFields,
	validationSchema,
} from '../formDetails';
import {
	createAggregatorStart,
	updateAggregatorStatusStart,
} from '../../../../store/actions';
// import { modules } from '../../../../constants/permissions';
import { formPageTitle } from '../../../../components/Common/constants';
import { decryptCredentials } from '../../../../network/storageUtils';

const useCreateAggregator = () => {
	const dispatch = useDispatch();
	const [showModal, setShowModal] = useState(false);

	const { isCreateAggregatorLoading } = useSelector(
		(state) => state.AggregatorsReducer
	);

	const handleCallback = () => {
		setIsOpen(false);
	};

	const handleCreateAggregator = (values) => {
		dispatch(
			createAggregatorStart({
				payload: {
					...values,
				},
				handleCallback,
			})
		);
		validation.resetForm();
	};

	const { isOpen, setIsOpen, header, validation, formFields, setFormFields } =
		useForm({
			header: 'Add Aggregator',
			initialValues: getInitialValues(),
			validationSchema,
			isEdit: false,
			onSubmitEntry: handleCreateAggregator,
			staticFormFields,
		});

	// const handleAddClick = (e) => {
	// 	e.preventDefault();
	// 	setIsOpen((prev) => !prev);
	// };

	const handleStatus = (props) => {
		const { id } = props;
		dispatch(
			updateAggregatorStatusStart({
				id,
				type: 'aggregator',
			})
		);
	};

	const buttonList = useMemo(() => [
		// {
		// 	label: 'Create',
		// 	handleClick: handleAddClick,
		// 	link: '#!',
		// 	module: modules.casinoManagement,
		// 	operation: 'C',
		// },
	]);

	useEffect(() => {
		if (window.localStorage.getItem(formPageTitle.aggregators && isOpen)) {
			const values = JSON.parse(
				decryptCredentials(localStorage.getItem(formPageTitle.aggregators))
			);
			validation.setValues(values);
		}
	}, [isOpen]);

	return {
		isOpen,
		setFormFields,
		setIsOpen,
		formFields,
		header,
		validation,
		buttonList,
		isCreateAggregatorLoading,
		handleStatus,
		showModal,
		setShowModal,
	};
};

export default useCreateAggregator;
