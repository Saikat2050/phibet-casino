/* eslint-disable no-param-reassign */
import React, { useMemo, useState } from 'react';
import useForm from '../../../components/Common/Hooks/useFormModal';
import PlayersList from '../index';

const useBulkUpdate = () => {
	const [userIds, setUserIds] = useState({});
	const toggleUserId = (userId) => {
		if (userIds[userId]) {
			setUserIds((prev) => {
				delete prev[userId];
				return { ...prev };
			});
		} else {
			setUserIds((prev) => ({
				...prev,
				[userId]: true,
			}));
		}
	};

	const handleSubmit = () => {};

	const { validation, leftFormFields, rightFormFields } = useForm({
		header: 'Attach Tag',
		initialValues: {},
		validationSchema: {},
		onSubmitEntry: handleSubmit,
		leftStaticFormFields: [],
		rightStaticFormFields: [],
	});

	const customComponent = useMemo(
		() => <PlayersList userIds={userIds} toggleUserId={toggleUserId} />,
		[userIds]
	);

	return {
		userIds,
		toggleUserId,
		validation,
		leftFormFields,
		rightFormFields,
		customComponent,
	};
};

export default useBulkUpdate;
