import React, { useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';

import {
	appSettingValidation,
	getAppSettingInitialValues,
	leftAppSettingsFormFields,
	rightAppSettingFormFields,
} from '../formDetails';

import useForm from '../../../components/Common/Hooks/useFormModal';
import usePermission from '../../../components/Common/Hooks/usePermission';
import FormPage from '../../../components/Common/FormPage';
import { updateAppSetting } from '../../../store/actions';
import { modules } from '../../../constants/permissions';

const SiteConfig = ({ details }) => {
	const dispatch = useDispatch();
	const { isGranted } = usePermission();

	const hasUpdatePermission = isGranted(modules.applicationSetting, 'U');
	const isReadOnly = !hasUpdatePermission;

	const customOnChange = (e) => {
		e.preventDefault();
		if (!hasUpdatePermission) return;

		const { name } = e.target;
		if (name) {
			dispatch(updateAppSetting({ key: name }));
		}
	};

	const {
		leftFormFields,
		rightFormFields,
		setLeftFormFields,
		setRightFormFields,
		validation,
	} = useForm({
		initialValues: getAppSettingInitialValues(details),
		validationSchema: appSettingValidation,
		leftStaticFormFields: leftAppSettingsFormFields(
			details,
			customOnChange,
			isReadOnly
		),
		rightStaticFormFields: rightAppSettingFormFields(
			details,
			customOnChange,
			isReadOnly
		),
	});

	useEffect(() => {
		if (!isEmpty(details)) {
			setLeftFormFields(
				leftAppSettingsFormFields(details, customOnChange, isReadOnly)
			);
			setRightFormFields(
				rightAppSettingFormFields(details, customOnChange, isReadOnly)
			);
		}
	}, [details]);

	return (
		<Row>
			<Col lg="12">
				<FormPage
					validation={validation}
					leftFormFields={leftFormFields}
					rightFormFields={rightFormFields}
					isSubmit={false}
					customColClasses=""
				/>
			</Col>
		</Row>
	);
};

SiteConfig.defaultProps = {
	details: [],
};

SiteConfig.propTypes = {
	details: PropTypes.arrayOf(
		PropTypes.objectOf(
			PropTypes.oneOfType([PropTypes.number, PropTypes.node, PropTypes.string])
		)
	),
};

export default SiteConfig;
