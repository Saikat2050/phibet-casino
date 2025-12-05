import React, { useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
	adminSiteConfigSchema,
	getSiteConfigInitialValues,
	leftStaticSiteConfigFormFields,
	rightStaticSiteConfigFormFields,
} from '../formDetails';

import useForm from '../../../components/Common/Hooks/useFormModal';
import FormPage from '../../../components/Common/FormPage';
import {
	updateSiteConfigurationStart,
	updateLogo,
} from '../../../store/actions';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { modules } from '../../../constants/permissions';

const SiteConfig = ({ details }) => {
	const dispatch = useDispatch();
	const { isGranted } = usePermission();

	const hasUpdatePermission = isGranted(modules.applicationSetting, 'U');
	const isReadOnly = !hasUpdatePermission;

	const customBlurHandler = (e) => {
		e.preventDefault();
		if (!hasUpdatePermission) return;

		const { name, value, files, type } = e.target;

		if (type === 'file') {
			dispatch(updateLogo({ file: files[0] }));
		} else if (name && value) {
			dispatch(updateSiteConfigurationStart({ [name]: value }));
		}
	};

	const {
		leftFormFields,
		rightFormFields,
		setLeftFormFields,
		setRightFormFields,
		validation,
	} = useForm({
		initialValues: getSiteConfigInitialValues(details),
		validationSchema: adminSiteConfigSchema,
		leftStaticFormFields: leftStaticSiteConfigFormFields(
			details,
			customBlurHandler,
			isReadOnly
		),
		rightStaticFormFields: rightStaticSiteConfigFormFields(
			details,
			customBlurHandler,
			isReadOnly
		),
	});

	useEffect(() => {
		if (Object.keys(details || {}).length > 0) {
			setLeftFormFields(
				leftStaticSiteConfigFormFields(details, customBlurHandler, isReadOnly)
			);
			setRightFormFields(
				rightStaticSiteConfigFormFields(details, customBlurHandler, isReadOnly)
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
