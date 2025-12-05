import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	getInitialNewConfigure,
	PaymentProviderStaticFormFields,
	validationSchema,
} from '../formDetails';
import useForm from '../../../components/Common/Hooks/useFormModal';
import {
	addPaymentProvider,
	getPaymentcredentialsFail,
	getPaymentcredentialsProvider,
	updatePaymentcredentialsProvider,
} from '../../../store/payment/actions';
import { modules } from '../../../constants/permissions';

const useAddNewProvider = ({ type, setType }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [page, setPage] = useState(1);
	const [dynamicField, setDynamicField] = useState([]);
	const fields = useRef();
	const [selectedProvider, setSelectedProvider] = useState(null);
	const { paymentProviderData, isLoadinpaymentProvider } = useSelector(
		(state) => state.Payment
	);

	useEffect(() => {
		dispatch(
			getPaymentcredentialsProvider({
				perPage: 10,
				page,
			})
		);
		return () => {
			dispatch(getPaymentcredentialsFail());
		};
	}, []);

	useEffect(() => {
		fields.current = dynamicField;
	}, [dynamicField]);

	const handleSubmit = (value, { resetForm }) => {
		const { name, isActive, icon, BaseURL, ...rest } = value;
		const filteredRest = Object.keys(rest)
			.filter((key) => rest[key] !== null && rest[key] !== '')
			.reduce((obj, key) => {
				// eslint-disable-next-line no-param-reassign
				obj[key] = rest[key];
				return obj;
			}, {});

		const createFilteredPayload = (payload) =>
			Object.keys(payload)
				.filter((key) => payload[key] !== null && payload[key] !== '')
				.reduce((obj, key) => {
					// eslint-disable-next-line no-param-reassign
					obj[key] = payload[key];
					return obj;
				}, {});
		if (type === 'Edit') {
			const payload = createFilteredPayload({
				id: selectedProvider?.id,
				providerCredentialId: selectedProvider?.id,
				name,
				icon,
				isActive,
				providerType: 'payment',
				credentials: {
					BaseURL,
					...filteredRest,
				},
			});
			dispatch(
				updatePaymentcredentialsProvider(
					payload,
					paymentProviderData?.providerCredentials?.length
				)
			);
			resetForm();
		} else {
			const payload = createFilteredPayload({
				name,
				icon,
				isActive,
				providerType: 'payment',
				credentials: {
					BaseURL,
					...filteredRest,
				},
			});

			dispatch(
				addPaymentProvider(
					payload,
					paymentProviderData?.providerCredentials?.length,
					page
				)
			);
			resetForm();
		}
		// eslint-disable-next-line no-use-before-define
		toggleFormModal();
		setSelectedProvider();
		setDynamicField([]);
	};

	const {
		isOpen,
		setIsOpen,
		header,
		validation,
		setHeader,
		formFields,
		setFormFields,
	} = useForm({
		header: '',
		initialValues: getInitialNewConfigure(selectedProvider),
		onSubmitEntry: handleSubmit,
		validationSchema,
		staticFormFields: PaymentProviderStaticFormFields(selectedProvider?.name),
	});
	const toggleFormModal = () => {
		setIsOpen((prev) => !prev);
		setSelectedProvider();
	};

	const handleProviderClick = (provider) => {
		setSelectedProvider(provider);
		setIsOpen(true);
		setDynamicField([]);
	};

	const onRemoveField = (name) => {
		validation.setFieldValue(name, null);
		const updatedFields = [];
		// eslint-disable-next-line no-restricted-syntax
		for (const field of fields.current) {
			if (field.name !== name) {
				updatedFields.push(field);
			}
		}
		setDynamicField(updatedFields);
	};

	useEffect(() => {
		if (selectedProvider?.credentials) {
			const credentialsFields = Object?.keys(selectedProvider?.credentials)
				.map((key) => {
					const field = {
						name: key,
						fieldType: 'textField',
						type: 'text',
						label: `Enter ${key}`,
						placeholder: `Enter ${key} value`,
					};
					if (key !== 'BaseURL') {
						validation.setFieldValue(key, selectedProvider.credentials[key]);
					}
					return field;
				})
				.filter((field) => field.name !== 'BaseURL');
			setFormFields([
				...PaymentProviderStaticFormFields(selectedProvider?.name),
				...credentialsFields,
			]);
		} else {
			setFormFields(PaymentProviderStaticFormFields(selectedProvider?.name));
		}
	}, [selectedProvider]);

	const onBackClick = () => {
		navigate('/payment');
		// dispatch(getPaymentcredentialsFail());
	};
	const buttonList = useMemo(() => [
		{
			label: 'Configure Provider',
			handleClick: () => {
				handleProviderClick({ id: 'Create' });
				setType('Configure');
				setHeader('Configure Provider');
			},
			link: '#!',
			module: modules.paymentManagement,
			operation: 'C',
		},
	]);

	const fetchMoreData = () => {
		setPage((prevPage) => prevPage + 1);
	};

	return {
		validation,
		isOpen,
		setIsOpen,
		toggleFormModal,
		handleProviderClick,
		header,
		setHeader,
		paymentProviderData,
		isLoadinpaymentProvider,
		onBackClick,
		formFields: [
			...formFields,
			...dynamicField,
			{
				fieldType: 'addKeyValue',
				tooltipMessage: 'add payment Provider credentials',
				callBack: ({ key, value }) => {
					validation.setFieldValue(key, value);
					setDynamicField((prev) => [
						...prev,
						{
							name: key,
							fieldType: 'textField',
							onDelete: onRemoveField,
							type: 'text',
							label: `Enter ${key}`,
							placeholder: `Enter ${key} value`,
						},
					]);
				},
			},
			{
				name: 'isActive',
				fieldType: 'switch',
				label: 'Set Active/Inactive',
			},
			{
				name: 'icon',
				fieldType: 'file',
				type: '',
				label: 'Payment Provider icon',
				placeholder: 'Upload payment provider icon',
				showThumbnail: true,
			},
		],
		buttonList,
		fetchMoreData,
		page,
		selectedProvider,
	};
};

export default useAddNewProvider;
