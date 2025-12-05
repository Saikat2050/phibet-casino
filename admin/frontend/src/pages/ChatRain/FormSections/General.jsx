/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
	generalStaticFormFields,
	generalStepInitialValues,
} from '../formDetails';
import FormPage from '../../../components/Common/FormPage';
import useForm from '../../../components/Common/Hooks/useFormModal';
import generalFormSchema from '../Validation/schema';
import { createChatrain, updateChatrain } from '../../../store/actions';
import { capitalizeString } from '../../../utils/helpers';

const General = ({ chatRainDetails, isEdit }) => {
	const dispatch = useDispatch();
	const { createChatrainLoading, updateChatrainLoading } = useSelector(
		(state) => state.Chatrain
	);
	const { channels } = useSelector((state) => state.Channel);

	const handleSubmit = (values) => {
		if (isEdit) {
			dispatch(
				updateChatrain({
					data: {
						chatRainId: chatRainDetails?.id,
						chatGroupId: Number(values?.chatGroupId),
						name: values?.name,
						prizeMoney: Number(values?.prizeMoney),
						currency: values?.currency,
					},
				})
			);
		} else {
			dispatch(
				createChatrain({
					data: {
						chatGroupId: Number(values?.chatGroupId),
						name: values?.name,
						prizeMoney: Number(values?.prizeMoney),
						currency: values?.currency,
					},
				})
			);
		}
	};

	const { formFields, setFormFields, validation } = useForm({
		initialValues: generalStepInitialValues({ chatRainDetails }),
		validationSchema: generalFormSchema(),
		onSubmitEntry: handleSubmit,
		staticFormFields: generalStaticFormFields,
	});

	useEffect(() => {
		setFormFields([
			...formFields.filter((item) => item?.name !== 'chatGroupId'),
			{
				name: 'chatGroupId',
				fieldType: 'select',
				type: '',
				label: 'Select Channel',
				placeholder: 'Select Channel',
				optionList: channels?.map((item) => ({
					optionLabel: capitalizeString(item?.name),
					value: item?.id,
					id: item?.id,
				})),
			},
		]);
	}, [channels]);

	return (
		<Row>
			<Col lg="12">
				<FormPage
					formTitle={isEdit ? 'Edit Chat Rain' : 'Create Chat Rain'}
					submitLabel={isEdit ? 'Edit' : 'Create'}
					validation={validation}
					responsiveFormFields={formFields}
					customColClasses=""
					colOptions={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4, xxl: 4 }}
					isSubmit
					isSubmitLoading={createChatrainLoading || updateChatrainLoading}
				/>
			</Col>
		</Row>
	);
};

General.defaultProps = {};

export default General;
