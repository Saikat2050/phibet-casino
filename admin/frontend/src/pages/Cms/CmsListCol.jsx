import React from 'react';
import PropTypes, { oneOfType } from 'prop-types';
import { Badge, Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import { CustomInputField, CustomTextEditor } from '../../helpers/customForms';

const CmsPageId = ({ value }) => (
	<Link to="/" className="text-body fw-bold">
		{value ?? ''}
	</Link>
);

const Title = ({ value }) => value || '-';

const Slug = ({ value }) => value ?? '';

const Portal = ({ value }) => value ?? '';

const Status = ({ value }) =>
	value ? (
		<Badge className="bg-success">Active</Badge>
	) : (
		<Badge className="bg-danger">In Active</Badge>
	);

const CustomComponent = ({ validation, isEdit, isView }) => (
	<Col className="mb-2">
		<Row lg={12}>
			<Col lg={3} className="mb-2">
				<CustomInputField
					disabled={isView}
					isRequired
					formFeedBackClass="mb-3"
					inputClassName={
						!!validation?.errors?.title?.[validation?.values?.language] ||
						'mb-3'
					}
					name={`title[${validation?.values?.language}]`}
					value={validation?.values?.title[validation?.values?.language]}
					onBlur={validation?.handleBlur}
					onChange={validation?.handleChange}
					maximumCharacters={100}
					label="Title"
					placeholder="Enter title"
					isError
					invalid={!!validation?.errors?.title?.[validation?.values?.language]}
					errorMsg={validation?.errors?.title?.[validation?.values?.language]}
				/>
			</Col>
		</Row>
		{(isEdit || isView) &&
		!Object.keys(validation?.values?.content || {})?.length ? null : (
			<CustomTextEditor
				label="Content"
				name={`content[${validation?.values?.language}]`}
				placeholder="Enter Content"
				validate={{ required: { value: true } }}
				isError
				validation={validation}
				value={validation?.values?.content?.[validation?.values?.language]}
				errorMsg={validation.errors?.content?.[validation?.values?.language]}
				readOnly={isView}
			/>
		)}
	</Col>
);

CustomComponent.defaultProps = {
	isEdit: false,
	isView: false,
};

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
	isEdit: PropTypes.string,
	isView: PropTypes.string,
};

CmsPageId.propTypes = {
	value: PropTypes.string.isRequired,
};

Status.propTypes = {
	value: PropTypes.string.isRequired,
};

export { CmsPageId, Title, Portal, Slug, Status, CustomComponent };
