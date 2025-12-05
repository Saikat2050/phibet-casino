/* eslint-disable react/no-danger */
/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Form } from 'reactstrap';
import {
	getAllEmailTemplates,
	getEmailTemplate,
	getLanguagesStart,
	deleteEmailTemplate,
	resetAllEmailTemplates,
	makeEmailTemplatePrimary,
} from '../../../store/actions';
import { useConfirmModal } from '../../../components/Common/ConfirmModal';
import { Label, Primary } from '../EmailTemplateListCol';
import { modules } from '../../../constants/permissions';
import Actions from '../../../components/Common/Actions';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { ICON_CLASS, TEXT_COLORS } from '../../../utils/constant';
import ButtonList from '../../../components/Common/ButtonList';

const useEmailTemplate = () => {
	const {
		emailTemplateloading,
		emailTemplates,
		emailTemplate,
		isEmailTemplateLoading,
	} = useSelector((state) => state.EmailTemplate);

	const { languageData } = useSelector((state) => state.CasinoManagementData);
	const { openConfirmModal } = useConfirmModal();
	const [clickId, setClickId] = useState('');
	const [customComponent, setCustomComponent] = useState();
	const [language] = useState('EN');
	const { isGranted, permissions } = usePermission();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const fetchData = () => {
		dispatch(getAllEmailTemplates());
		dispatch(getLanguagesStart());
	};

	// resetting email templates redux state
	useEffect(() => () => dispatch(resetAllEmailTemplates()), []);

	useEffect(() => {
		if (emailTemplate) {
			setCustomComponent(
				<>
					<Form>
						{/* <CustomSelectField
							name="language"
							type="select"
							onChange={(e) => {
								setLanguage(e.target.value);
							}}
							value={language}
							options={
								<>
									<option value="EN" selected disabled>
										English
									</option>
									{languageData?.languages?.length &&
										languageData?.languages?.map(
											({ name, code }) =>
												code !== 'EN' &&
												emailTemplate?.templateCode?.[code] !== undefined && (
													<option key={code} value={code}>
														{name}
													</option>
												)
										)}
								</>
							}
						/> */}
					</Form>
					<div
						className="d-flex p-2"
						dangerouslySetInnerHTML={{
							__html: emailTemplate?.templateCode?.[language],
						}}
					/>
				</>
			);
		}
	}, [emailTemplate, languageData, language]);

	useEffect(() => {
		fetchData();
	}, []);

	const handleEditClick = (row) => {
		navigate(`/email-templates/edit/${row?.id}`);
	};

	const toggleView = () => {
		setClickId('');
	};

	const handleViewClick = (row) => {
		setClickId(row?.id);
		dispatch(getEmailTemplate(row?.id));
	};

	const handleDeleteSubmit = (id, eventType) =>
		dispatch(
			deleteEmailTemplate({
				emailTemplateId: Number(id),
				eventType,
			})
		);

	const handleDeleteClick = (row) => {
		openConfirmModal(
			'Are you sure you want to delete this Email Template?',
			() => handleDeleteSubmit(row?.id, row?.eventype)
		);
	};

	const handleCreateClick = (e) => {
		e.preventDefault();
		navigate('create');
	};

	const handleMakePrimary = (row) => {
		dispatch(
			makeEmailTemplatePrimary({
				data: {
					emailTemplateId: parseInt(row?.id, 10),
					eventType: row?.eventype,
				},
			})
		);
	};

	const buttonList = useMemo(() => [
		{
			label: 'Create',
			handleClick: handleCreateClick,
			link: '#!',
			module: modules.emailTemplate,
			operation: 'C',
		},
	]);

	const actionList = <ButtonList buttonList={buttonList} />;

	const isDeleteDisabled = (row) => row?.isDefault;

	const actionsList = [
		{
			actionName: 'View',
			actionHandler: handleViewClick,
			isHidden: !isGranted(modules.emailTemplate, 'R'),
			icon: ICON_CLASS.view,
			iconColor: TEXT_COLORS.info,
		},
		{
			actionName: 'Make Template Primary',
			actionHandler: handleMakePrimary,
			isHidden: !isGranted(modules.emailTemplate, 'U'),
			icon: ICON_CLASS.markPrimary,
			iconColor: TEXT_COLORS.info,
		},
		// {
		// 	actionName: 'View',
		// 	actionHandler: handleViewClick,
		// 	isHidden: false,
		// 	icon: ICON_CLASS.view,
		// 	iconColor: TEXT_COLORS.secondary,
		// },
		{
			actionName: 'Edit',
			actionHandler: handleEditClick,
			isHidden: !isGranted(modules.emailTemplate, 'U'),
			icon: ICON_CLASS.edit,
			iconColor: TEXT_COLORS.primary,
		},
		{
			actionName: 'Delete',
			actionHandler: handleDeleteClick,
			isHidden: !isGranted(modules.emailTemplate, 'D'),
			icon: ICON_CLASS.delete,
			iconColor: TEXT_COLORS.danger,
			isDisabled: isDeleteDisabled,
		},
	];

	const columns = useMemo(
		() => [
			// {
			// 	Header: 'ID',
			// 	accessor: 'id',
			// 	Cell: (id) => <EmailTemplateId value={id} />,
			// },
			{
				Header: 'LABEL',
				accessor: 'label',
				Cell: (label) => <Label value={label} />,
			},
			{
				Header: 'PRIMARY',
				accessor: 'isDefault',
				Cell: (isDefault) => <Primary value={isDefault} />,
			},
			{
				Header: 'ACTIONS',
				accessor: 'id',
				Cell: (id, eventype, isDefault) => (
					<Actions
						cell={{
							row: {
								original: {
									id,
									eventype,
									isDefault,
								},
							},
						}}
						actionsList={actionsList}
					/>
				),
			},
		],
		[emailTemplates, permissions]
	);

	return {
		emailTemplateloading,
		emailTemplates,
		toggleView,
		emailTemplate,
		isEmailTemplateLoading,
		customComponent,
		columns,
		clickId,
		actionList,
		handleDeleteSubmit,
		handleDeleteClick,
		useConfirmModal,
		openConfirmModal,
		isGranted,
		permissions,
		buttonList,
	};
};

export default useEmailTemplate;
