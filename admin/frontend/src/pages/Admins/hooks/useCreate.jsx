import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Buffer } from 'buffer';
import {
	leftStaticFormFields,
	rightStaticFormFields,
	getInitialValues,
	validationSchema,
} from '../formDetails';
import PermissionForm from '../permissionForm';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { addSuperAdminUserStart, getAllAdmins } from '../../../store/actions';
import { showToastr } from '../../../utils/helpers';
import { formPageTitle } from '../../../components/Common/constants';
import { decryptCredentials } from '../../../network/storageUtils';
import { getRolesStart } from '../../../store/auth/roles/actions';

const useCreate = () => {
	const location = useLocation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [adminData, setAdminData] = useState({});
	const roles = useSelector((state) => state.AdminRoles.roles);
	// const groups = useSelector((state) => state.AdminUser.groups);
	const { superAdminUser } = useSelector((state) => state.PermissionDetails);
	const { isAddSuperUserLoading, adminDetails: allAdminList } = useSelector(
		(state) => state.AllAdmins
	);
	const [customComponent, setCustomComponent] = useState();
	const [showModal, setShowModal] = useState(false);

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
			delete filteredPayload.adminId;
			dispatch(
				addSuperAdminUserStart({
					data: {
						...values,
						password: Buffer.from(values.password).toString('base64'),
						parentAdminId: values.adminId
							? Number(values.adminId)
							: adminData?.id,
					},
					navigate,
				})
			);
		}
	};

	const handleAdminSelect = (e) => {
		const foundAdmin = allAdminList?.staff?.find(
			(admin) => admin.id === e.target.value
		);
		setAdminData(foundAdmin);
	};

	const {
		validation,
		leftFormFields,
		setLeftFormFields,
		rightFormFields,
		setRightFormFields,
	} = useForm({
		header: 'Add Staff',
		initialValues: getInitialValues(null),
		validationSchema: validationSchema(),
		onSubmitEntry: handleStaffSubmit,
		leftStaticFormFields: leftStaticFormFields(),
		rightStaticFormFields: rightStaticFormFields(),
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
					callBack: handleAdminSelect,
				};
			} else if (validation?.values?.role === 'Manager') {
				validation.setFieldValue('adminRoleId', 2);
			}
			setRightFormFields([...rightStaticFormFields()]);

			setLeftFormFields([
				...leftStaticFormFields(),
				{
					name: 'role',
					fieldType: 'select',
					label: 'Role',
					placeholder: 'Select Role',
					optionList: roleOptions,
					isRequired: true,
				},
				customField,
			]);
		}
	};

	useEffect(() => {
		if (location.pathname === '/staff/add') {
			if (!roles) {
				dispatch(getRolesStart());
			}

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
	}, [
		roles,
		// groups,
		validation?.values?.role,
		allAdminList,
		// validation?.values?.group,
	]);

	useEffect(() => {
		setCustomComponent(
			<PermissionForm
				values={validation.values}
				adminDetails={adminData}
				superAdminUser={superAdminUser}
				validation={validation}
			/>
		);
	}, [validation?.values, adminData, superAdminUser, validation?.values?.role]);

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
		isAddSuperUserLoading,
		showModal,
		setShowModal,
		navigate,
	};
};

export default useCreate;
