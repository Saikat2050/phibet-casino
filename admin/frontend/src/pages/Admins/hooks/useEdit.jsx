import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { isEmpty } from 'lodash';
import {
	leftStaticFormFields,
	rightStaticFormFields,
	getInitialValues,
	validationSchema,
} from '../formDetails';
import PermissionForm from '../permissionForm';
import useForm from '../../../components/Common/Hooks/useFormModal';
import {
	getAllAdmins,
	updateSuperAdminUserStart,
} from '../../../store/actions';
import { showToastr } from '../../../utils/helpers';
import { formPageTitle } from '../../../components/Common/constants';
import { decryptCredentials } from '../../../network/storageUtils';

const useEdit = (adminDetails = {}) => {
	const location = useLocation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const roles = useSelector((state) => state.AdminRoles.roles);
	const { superAdminUser } = useSelector((state) => state.PermissionDetails);
	const { isUpdateSuperUserLoading, adminDetails: allAdminList } = useSelector(
		(state) => state.AllAdmins
	);
	const [customComponent, setCustomComponent] = useState();

	const handleStaffSubmit = (values) => {
		if (
			[undefined, null].includes(values.permission) ||
			Object.keys(values.permission).length < 1
		) {
			dispatch(
				showToastr({
					message: 'Please select at least one permission',
					type: 'error',
				})
			);
		} else {
			const filteredPayload = values;
			delete filteredPayload.email;
			delete filteredPayload.username;
			dispatch(
				updateSuperAdminUserStart({
					data: {
						...filteredPayload,
						childAdminId: Number(adminDetails?.id),
					},
					navigate,
				})
			);
		}
	};

	const {
		validation,
		leftFormFields,
		setLeftFormFields,
		rightFormFields,
		setRightFormFields,
	} = useForm({
		header: 'Edit Staff',
		initialValues: getInitialValues(adminDetails, true),
		validationSchema: validationSchema(true),
		onSubmitEntry: handleStaffSubmit,
		leftStaticFormFields: leftStaticFormFields(true),
		rightStaticFormFields: rightStaticFormFields(true),
	});

	const setCustomFields = () => {
		if (roles) {
			let customField = {};

			const roleOptions =
				roles
					?.filter((r) => r.name !== 'Superadmin')
					.map((r) => ({
						id: r.id,
						optionLabel: r.name,
						value: r.name,
					})) || [];

			const adminOptions =
				allAdminList?.staff?.map((ad) => ({
					optionLabel: `${ad.firstName || ''} ${ad.lastName || ''} ${
						!ad.firstName && !ad.lastName ? ad.username : ''
					}`,
					value: ad.id,
				})) || [];

			if (validation?.values?.role === 'Support') {
				validation.setFieldValue('adminRoleId', 3);
				customField = {
					name: 'adminId',
					fieldType: 'select',
					label: 'Admin',
					placeholder: 'Select Admin',
					optionList: adminOptions,
					callBack: () => {},
					isDisabled: true,
				};
			} else if (validation?.values?.role === 'Manager') {
				validation.setFieldValue('adminRoleId', 2);
			}
			setRightFormFields([...rightStaticFormFields(true), customField]);

			setLeftFormFields([
				...leftStaticFormFields(true),
				{
					name: 'role',
					fieldType: 'select',
					label: 'Role',
					placeholder: 'Select Role',
					optionList: roleOptions,
					isDisabled: true,
					isRequired: true,
				},
			]);
		}
	};

	useEffect(() => {
		if (location.pathname?.includes('/staff/edit')) {
			if (!allAdminList?.staff) {
				dispatch(
					getAllAdmins({
						sort: 'desc',
					})
				);
			}
		}

		if (roles && allAdminList?.staff) {
			setCustomFields();
		}
	}, [roles, allAdminList]);

	useEffect(() => {
		if (!isEmpty(adminDetails)) {
			setCustomComponent(
				<PermissionForm
					values={validation.values}
					adminDetails={
						allAdminList?.staff?.find(
							(admin) => admin.id === adminDetails.parentAdminId
						) || adminDetails
					}
					superAdminUser={superAdminUser}
					validation={validation}
					isEdit
				/>
			);
		}
	}, [
		validation?.values,
		adminDetails,
		superAdminUser,
		validation?.values?.role,
	]);

	useEffect(() => {
		if (localStorage.getItem(formPageTitle.staff)) {
			const values = JSON.parse(
				decryptCredentials(localStorage.getItem(formPageTitle.staff))
			);
			validation.setValues(values);
		}
	}, []);

	return {
		validation,
		customComponent,
		leftFormFields,
		rightFormFields,
		isUpdateSuperUserLoading,
	};
};

export default useEdit;
