import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { addGameStart } from '../../../store/actions';

const useAddGames = () => {
	const dispatch = useDispatch();
	const { aggregatorsData, addGameLoading } = useSelector(
		(state) => state.AggregatorsReducer
	);

	const aggregatorOptions = useMemo(
		() =>
			aggregatorsData?.aggregators?.map((agg) => ({
				value: agg.id,
				label: agg.name?.EN || 'Unnamed',
				fullData: agg,
			})) || [],
		[aggregatorsData]
	);

	const formFields = useMemo(
		() => [
			{
				name: 'aggregatorId',
				fieldType: 'select',
				label: 'Aggregator',
				placeholder: 'Select Aggregator',
				isRequired: true,
				optionList: aggregatorOptions.map((opt) => ({
					value: opt.value,
					optionLabel: opt.label,
				})),
			},
		],
		[aggregatorOptions]
	);

	const handleSubmit = (values) => {
		const selected = aggregatorOptions.find(
			(opt) => opt.value === values.aggregatorId
		);
		const aggregatorName = selected?.label || '';
		dispatch(
			addGameStart({
				aggregatorId: values.aggregatorId,
				aggregatorName,
			})
		);
	};

	const { validation, formFields: preparedFields } = useForm({
		header: 'Add Game',
		initialValues: {
			aggregatorId: '',
		},
		validationSchema: null,
		onSubmitEntry: handleSubmit,
		staticFormFields: formFields,
	});

	return {
		validation,
		formFields: preparedFields,
		addGameLoading,
	};
};

export default useAddGames;
