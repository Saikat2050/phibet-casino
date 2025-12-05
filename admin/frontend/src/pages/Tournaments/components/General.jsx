/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Col, Card } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
	generalStepInitialValues,
	generalFormSchema,
	staticFormFields,
} from '../formDetails';
import FormPage from '../../../components/Common/FormPage';
import Spinners from '../../../components/Common/Spinner';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { getAllTags, getLanguagesStart } from '../../../store/actions';
import TabsPage from '../../../components/Common/TabsPage';
import { CustomInputField } from '../../../helpers/customForms';
import Actions from './Actions';
import { filterEmptyPayload } from '../../../network/networkUtils';
import { modules } from '../../../constants/permissions';
import usePermission from '../../../components/Common/Hooks/usePermission';

const General = ({
	isLoading,
	setAllFields,
	tournamentDetail,
	submitButtonLoading,
	tournamentId,
	toggleTab,
	tabsToShow,
	activeTab,
	tournamentSegmentDetail,
}) => {
	const { isGranted } = usePermission();
	const dispatch = useDispatch();
	const [activeLangTab, setActiveLangTab] = useState('EN');
	const { languageData } = useSelector((state) => state.CasinoManagementData);
	const { userTags } = useSelector((state) => state.UserDetails);

	useEffect(() => {
		if (!languageData) {
			dispatch(getLanguagesStart());
		}
		if (!userTags && isGranted(modules.segmentation, 'R')) {
			dispatch(getAllTags());
		}
	}, [languageData]);

	const toggle = (tab) => {
		setActiveLangTab(tab);
	};

	const handleSubmit = (values) => {
		setAllFields((prev) => ({
			...prev,
			...values,
			name: filterEmptyPayload(values.name),
			description: filterEmptyPayload(values.description),
		}));
		window.scrollTo(0, 0);
	};

	const { formFields, validation, setFormFields } = useForm({
		initialValues: generalStepInitialValues(tournamentDetail),
		validationSchema: generalFormSchema(),
		staticFormFields: staticFormFields(),
		onSubmitEntry: handleSubmit,
	});

	const handleNextClick = (nextTab) => {
		validation.submitForm();

		validation.setFieldTouched('name[EN]', true); // edge case: nested is not touched automatically
		validation.setFieldTouched('description[EN]', true);

		generalFormSchema()
			.validate(validation.values, {
				abortEarly: false,
			})
			.then(() => {
				handleSubmit(validation.values);
				toggleTab(nextTab);
			})
			.catch((err) => {
				console.log('Error in general form = ', err?.errors);
			});
	};
	useEffect(() => {
		const specificIdsLookup = {};
		tournamentSegmentDetail?.forEach((item) => {
			specificIdsLookup[item?.id] = true;
		});

		const filteredTags = userTags?.tags
			.filter((row) => specificIdsLookup[row.id])
			.map((row) => ({
				label: row.tag,
				value: row.id,
			}));
		if (tournamentDetail && tournamentId) {
			validation.setValues(
				generalStepInitialValues(tournamentDetail, null, filteredTags)
			);
		}
	}, [tournamentDetail, tournamentId, tournamentSegmentDetail]);

	useEffect(() => {
		if (userTags) {
			const tags = userTags?.tags?.map((row) => ({
				label: row?.tag,
				value: row.id,
			}));
			setFormFields(
				staticFormFields([
					{
						name: 'tagIds',
						fieldType: 'MultiSelectOptions',
						label: 'Select Segment',
						placeholder: 'Select Segment',
						multiple: true,
						multiSelectOption: tags,
					},
				])
			);
		}
	}, [userTags]);

	const tabData = languageData?.languages?.map((item) => ({
		id: item.code,
		title: item.code,
		component: (
			<>
				<Col lg="4 mb-2">
					<CustomInputField
						label="Title"
						name={`name[${activeLangTab}]`}
						onChange={(e) => {
							e.preventDefault();
							validation.setFieldValue('name', {
								...validation?.values?.name,
								[activeLangTab]: e.target.value,
							});
						}}
						value={validation?.values?.name?.[activeLangTab] || ''}
						onBlur={validation.handleBlur}
						placeholder="Title"
						invalid={
							!!(
								validation?.touched?.name?.[activeLangTab] &&
								validation?.errors?.name?.[activeLangTab]
							)
						}
						isRequired
						isError
						errorMsg={
							validation?.touched?.name?.[activeLangTab] &&
							validation?.errors?.name?.[activeLangTab]
						}
						// disabled={isView}
					/>
				</Col>

				<CustomInputField
					label="Description"
					name={`description[${activeLangTab}]`}
					type="textarea"
					isRequired
					onChange={(e) => {
						e.preventDefault();
						validation.setFieldValue('description', {
							...validation?.values?.description,
							[activeLangTab]: e.target.value,
						});
					}}
					value={validation?.values?.description?.[activeLangTab] || ''}
					onBlur={validation.handleBlur}
					placeholder="Description"
					invalid={
						!!(
							validation?.touched?.description?.[activeLangTab] &&
							validation?.errors?.description?.[activeLangTab]
						)
					}
					isError
					errorMsg={
						validation?.touched?.description?.[activeLangTab] &&
						validation?.errors?.description?.[activeLangTab]
					}
				/>
			</>
		),
	}));

	return (
		<Card>
			<Col lg="12" className="my-3">
				{isLoading ? (
					<Spinners
						color="primary"
						className="position-absolute top-50 start-50"
					/>
				) : (
					<>
						<FormPage
							validation={validation}
							responsiveFormFields={formFields}
							customColClasses=""
							colOptions={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4, xxl: 4 }}
							isSubmit={false}
							formClass="shadow-none mb-0"
						/>
						<TabsPage
							activeTab={activeLangTab}
							tabsData={tabData}
							toggle={toggle}
							tabContentClass="px-3"
						/>
					</>
				)}
			</Col>
			<Actions
				handleNextClick={handleNextClick}
				submitButtonLoading={submitButtonLoading}
				activeTab={activeTab}
				toggleTab={toggleTab}
				tabsToShow={tabsToShow}
			/>
		</Card>
	);
};

General.defaultProps = {};

export default General;
