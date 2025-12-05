import React from 'react';
import PropTypes, { oneOfType } from 'prop-types';
import { Col } from 'reactstrap';
import CkEditor from '../../components/Common/CkEditor';

const CustomComponent = ({ validation }) => (
	<Col className="mb-2 ps-4">
		<CkEditor
			label="Content"
			isRequired
			isError
			errorMsg={validation.errors?.content?.[validation?.values?.language]}
			initialData={validation?.values?.content?.[validation?.values?.language]}
			onChangeHandler={(data) => {
				validation.setFieldValue(
					`content[${validation?.values?.language}]`,
					data
				);
			}}
		/>
	</Col>
);

const EmailTemplateId = ({ value }) => value ?? '';

const Label = ({ value }) => value ?? '';

const Primary = ({ value }) => (value ? 'Yes' : 'No');

CustomComponent.propTypes = {
	validation: PropTypes.objectOf(
		oneOfType([
			PropTypes.object,
			PropTypes.func,
			PropTypes.bool,
			PropTypes.number,
			PropTypes.string,
		])
	).isRequired,
};

export { EmailTemplateId, Label, Primary, CustomComponent };
