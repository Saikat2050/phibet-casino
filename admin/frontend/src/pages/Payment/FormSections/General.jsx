/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import { generaFromFields, getInitialValues } from '../formDetails';
import FormPage from '../../../components/Common/FormPage';
import Spinners from '../../../components/Common/Spinner';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { generalFormSchema } from '../Validation/schema';
import Actions from './Actions';

const General = ({
	isLoading,
	activeTab,
	setAllFields,
	setLangContent,
	paymentDetails,
	submitButtonLoading,
	toggleTab,
	tabsToShow,
}) => {
	const { paymentAggregators } = useSelector((state) => state.Payment);

	const handleSubmit = (values) => {
		setAllFields((prev) => ({
			...prev,
			...values,
		}));
		window.scrollTo(0, 0);

		setLangContent((prev) => ({
			// description: { ...prev.description, EN: values.description },
			depositDescription: {
				...prev.depositDescription,
				EN: values.depositDescription,
			},
			withdrawDescription: {
				...prev.withdrawDescription,
				EN: values.withdrawDescription,
			},
			name: { ...prev.name, EN: values.name },
		}));
	};

	const { formFields, validation, setFormFields } = useForm({
		initialValues: getInitialValues(),
		validationSchema: generalFormSchema(),
		staticFormFields: generaFromFields(paymentDetails),
		onSubmitEntry: handleSubmit,
	});

	useEffect(() => {
		if (!isEmpty(paymentDetails)) {
			validation.setValues(getInitialValues(paymentDetails));
			setFormFields(generaFromFields(paymentDetails));
		}
	}, [paymentDetails]);

	useEffect(() => {
		const allFormFields = generaFromFields(paymentDetails);

		const isAggregatorFieldExists = allFormFields?.find(
			(item) => item?.name === 'aggregator'
		);

		if (!isAggregatorFieldExists && paymentAggregators?.data?.aggregators) {
			formFields.splice(1, 0, {
				name: 'aggregator',
				fieldType: paymentDetails ? 'textField' : 'select',
				label: 'Aggregator',
				isRequired: true,
				isDisabled: paymentDetails,
				placeholder: ' Select Aggregator',
				optionList: paymentAggregators?.data?.aggregators?.map((value) => ({
					optionLabel: value,
					value,
				})),
			});
			setFormFields(formFields);
		}
		// console.log(formFields, paymentAggregators, 'paymentAggregatorspaymentAggregators')
	}, [paymentAggregators, paymentDetails, generaFromFields]);

	const handleNextClick = (nextTab) => {
		generalFormSchema()
			.validate(validation.values)
			.then(() => {
				handleSubmit(validation.values);
				toggleTab(nextTab);
			})
			.catch((err) => {
				console.log('Error in general form = ', err?.errors);
				validation.submitForm();
			});
	};

	return (
		<Row>
			<Col lg="12">
				{isLoading ? (
					<Spinners
						color="primary"
						className="position-absolute top-50 start-50"
					/>
				) : (
					<FormPage
						validation={validation}
						responsiveFormFields={formFields}
						customColClasses=""
						colOptions={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4, xxl: 4 }}
						isSubmit={false}
						customComponent={
							<Actions
								handleNextClick={handleNextClick}
								submitButtonLoading={submitButtonLoading}
								activeTab={activeTab}
								toggleTab={toggleTab}
								tabsToShow={tabsToShow}
							/>
						}
					/>
				)}
			</Col>
		</Row>
	);
};

General.defaultProps = {};

export default General;
