/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { isEmpty } from 'lodash';
import { commonFields, getBonusInitialValues } from '../formDetails';
import FormPage from '../../../components/Common/FormPage';
import Spinners from '../../../components/Common/Spinner';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { generalFormSchema } from '../Validation/schema';
import Actions from './Actions';
import { getAllTags } from '../../../store/actions';
import { modules } from '../../../constants/permissions';
import usePermission from '../../../components/Common/Hooks/usePermission';

const General = ({
	isLoading,
	activeTab,
	setAllFields,
	setLangContent,
	bonusDetails,
	submitButtonLoading,
	toggleTab,
	tabsToShow,
	bonusSegment,
}) => {
	const dispatch = useDispatch();
	const { isGranted } = usePermission();
	const { userTags } = useSelector((state) => state.UserDetails);
	const handleSubmit = (values) => {
		setAllFields((prev) => ({
			...prev,
			...values,
			currencyDetails: prev.currencyDetails,
		}));
		window.scrollTo(0, 0);

		setLangContent((prev) => ({
			promoTitle: { ...prev.promoTitle, EN: values.promotionTitle },
			terms: { ...prev.terms, EN: values.termAndCondition },
			desc: { ...prev.desc, EN: values.description },
		}));
	};

	const handleBonusTypeChange = (e) => {
		const bnsType = e.target.value;
		setAllFields((prev) => ({
			...prev,
			bonusType: bnsType,
		}));
	};

	useEffect(() => {
		if (!userTags && isGranted(modules.segmentation, 'R'))
			dispatch(getAllTags());
	}, []);

	const { formFields, validation, setFormFields } = useForm({
		initialValues: getBonusInitialValues(),
		validationSchema: generalFormSchema(),
		staticFormFields: commonFields({}, handleBonusTypeChange),
		onSubmitEntry: handleSubmit,
	});

	useEffect(() => {
		const specificIdsLookup = {};
		bonusSegment?.forEach((item) => {
			specificIdsLookup[item?.id] = true;
		});

		const filteredTags = userTags?.tags
			.filter((row) => specificIdsLookup[row.id])
			.map((row) => ({
				label: row.tag,
				value: row.id,
			}));

		if (!isEmpty(bonusDetails)) {
			validation.setValues(getBonusInitialValues(bonusDetails, filteredTags));
			setFormFields(commonFields(bonusDetails, handleBonusTypeChange));
			// setFormFields(
			// 	commonFields(bonusDetails, handleBonusTypeChange, [
			// 		{
			// 			name: 'tagIds',
			// 			fieldType: 'MultiSelectOptions',
			// 			label: 'Select Segment',
			// 			placeholder: 'Select Segment',
			// 			multiple: true,
			// 			multiSelectOption: tags,
			// 			isHidable: (form) =>
			// 				form.bonusType === BONUS_TYPES.JOINING ||
			// 				form.bonusType === BONUS_TYPES.POSTAL_CODE,
			// 		},
			// 	])
			// );
		} else {
			// setFormFields(
			// 	commonFields({}, handleBonusTypeChange, [
			// 		{
			// 			name: 'tagIds',
			// 			fieldType: 'MultiSelectOptions',
			// 			label: 'Select Segment',
			// 			placeholder: 'Select Segment',
			// 			multiple: true,
			// 			multiSelectOption: tags,
			// 			isHidable: (form) =>
			// 				form.bonusType === BONUS_TYPES.JOINING ||
			// 				form.bonusType === BONUS_TYPES.POSTAL_CODE,
			// 		},
			// 	])
			// );
		}
	}, [bonusDetails, bonusSegment, userTags]);

	const handleNextClick = (nextTab) => {
		generalFormSchema()
			.validate(validation.values)
			.then(() => {
				handleSubmit(validation.values);
				toggleTab(nextTab);
			})
			.catch(() => {
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
