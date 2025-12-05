import { useFormik } from 'formik';
import { useState } from 'react';

const useForm = ({
	header: initialHeader,
	initialValues,
	validationSchema,
	onSubmitEntry,
	staticFormFields,
	leftStaticFormFields,
	rightStaticFormFields,
	enableReinitialize = true,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [header, setHeader] = useState(initialHeader);
	const [formFields, setFormFields] = useState(staticFormFields || []);
	const [leftFormFields, setLeftFormFields] = useState(
		leftStaticFormFields || []
	);
	const [rightFormFields, setRightFormFields] = useState(
		rightStaticFormFields || []
	);

	const validation = useFormik({
		enableReinitialize,
		initialValues,
		validationSchema,
		onSubmit: onSubmitEntry,
	});
	return {
		header,
		isOpen,
		setIsOpen,
		validation,
		formFields,
		setFormFields,
		setHeader,
		leftFormFields,
		setLeftFormFields,
		rightFormFields,
		setRightFormFields,
	};
};

export default useForm;
