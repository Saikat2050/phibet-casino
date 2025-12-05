/* eslint-disable no-param-reassign */
import React, { useEffect, useMemo, useState } from 'react';
import { isEmpty } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import useForm from '../../../components/Common/Hooks/useFormModal';
import PlayersList from '../../Players';
import { getInitialNotifyData, validatedNotify } from '../formDetails';
import { showToastr } from '../../../utils/helpers';
import { getLanguagesStart, notifyPlayersStart } from '../../../store/actions';
import {
	CustomInputField,
	CustomSelectField,
	CustomToggleButton,
} from '../../../helpers/customForms';

const { VITE_APP_AWS_GALLERY_URL } = import.meta.env;

const useNotifyPlayer = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { languageData } = useSelector((state) => state.CasinoManagementData);

	const { notifyPlayerLoading } = useSelector((state) => state.Notification);
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

	const toggleAllUsers = (allUserIds) => {
		setUserIds((prev) => {
			const newUserIds = { ...prev };
			const areAllSelected = allUserIds.every((userId) => newUserIds[userId]);
			if (areAllSelected) {
				allUserIds.forEach((userId) => {
					delete newUserIds[userId];
				});
			} else {
				allUserIds.forEach((userId) => {
					newUserIds[userId] = true;
				});
			}
			return newUserIds;
		});
	};

	const notifyPlayersSubmit = (data) => {
		if (data.choosePlayers && isEmpty(userIds)) {
			showToastr({
				message: 'Please select at least 1 player.',
				type: 'error',
			});
			return;
		}

		dispatch(
			notifyPlayersStart({
				payload: {
					...data,
					choosePlayers: null,
					language: null,
					userIds: data.choosePlayers ? Object.keys(userIds || {}) : null,
				},
				navigate,
			})
		);
	};

	const { validation, leftFormFields, rightFormFields } = useForm({
		header: 'Create',
		initialValues: getInitialNotifyData(),
		validationSchema: validatedNotify(),
		onSubmitEntry: notifyPlayersSubmit,
	});

	useEffect(() => {
		if (!languageData?.languages) dispatch(getLanguagesStart());
	}, []);

	const customComponent = useMemo(
		() => (
			<>
				<Row className="p-3">
					<Col className="mt-2" xl={4} xs={6}>
						<CustomSelectField
							name="language"
							isRequired
							type="select"
							value={validation.values?.language}
							label="Select language"
							placeholder="Select notification language"
							key="my_unique_select_key__language"
							onChange={validation.handleChange}
							options={languageData?.languages?.map((language) => (
								<option value={language.code} key={language.id}>
									{language.name}
								</option>
							))}
						/>
					</Col>
					<Col className="mt-2" xl={4} xs={6}>
						<CustomInputField
							label="Title"
							id={`title[${validation.values?.language}]`}
							name={`title[${validation.values?.language}]`}
							onChange={(e) => {
								e.preventDefault();
								validation.setFieldValue('title', {
									...validation?.values?.title,
									[validation.values?.language]: e.target.value,
								});
							}}
							value={
								validation?.values?.title?.[validation.values?.language] || ''
							}
							onBlur={validation.handleBlur}
							placeholder="Title"
							invalid={
								!!(
									validation?.touched?.title?.[validation.values?.language] &&
									validation?.errors?.title?.[validation.values?.language]
								)
							}
							isError
							errorMsg={
								validation?.touched?.title?.[validation.values?.language] &&
								validation?.errors?.title?.[validation.values?.language]
							}
							// disabled={isView}
							isRequired
							max={51}
						/>
					</Col>
					<Col className="mt-2" xl={4} xs={6}>
						<CustomInputField
							label="Description"
							name={`description[${validation.values?.language}]`}
							type="textarea"
							onChange={(e) => {
								e.preventDefault();
								validation.setFieldValue('description', {
									...validation?.values?.description,
									[validation.values?.language]: e.target.value,
								});
							}}
							value={
								validation?.values?.description?.[
									validation.values?.language
								] || ''
							}
							onBlur={validation.handleBlur}
							placeholder="Description"
							invalid={
								!!(
									validation?.touched?.description?.[
										validation.values?.language
									] &&
									validation?.errors?.description?.[validation.values?.language]
								)
							}
							isError
							errorMsg={
								validation?.touched?.description?.[
									validation.values?.language
								] &&
								validation?.errors?.description?.[validation.values?.language]
							}
							isRequired
							max={201}
						/>
					</Col>
					<Col className="mt-2" xl={4} xs={6}>
						<CustomInputField
							label="Enter redirection URL"
							name="url"
							onChange={validation.handleChange}
							value={validation?.values?.url}
							onBlur={validation.handleBlur}
							placeholder="Enter URL example: https://player-end-url.com"
							invalid={!!(validation?.touched?.url && validation?.errors?.url)}
							isError
							errorMsg={validation?.touched?.url && validation?.errors?.url}
						/>
					</Col>
					<Col className="mt-2" xl={4} xs={6}>
						<CustomInputField
							label="Select notification icon"
							type="file"
							onChange={(event) => {
								validation.setFieldValue('file', event.currentTarget.files[0]);
							}}
							callBack
							onBlur={validation.handleBlur}
							placeholder="Select notification icon"
							invalid={!!(validation.touched?.file && validation.errors?.file)}
							isError
							errorMsg={validation.touched?.file && validation.errors?.file}
						/>
						{validation.values?.file && (
							<img
								style={{
									marginTop: 10,
								}}
								width={100}
								src={
									// eslint-disable-next-line no-nested-ternary
									typeof validation.values?.file === 'string'
										? validation.values?.file?.includes('http')
											? validation.values?.file
											: `${VITE_APP_AWS_GALLERY_URL}${validation.values?.file}`
										: URL.createObjectURL(validation.values?.file)
								}
								alt="Not found"
							/>
						)}
					</Col>
					<Col className="mt-2" xl={4} xs={6}>
						<CustomToggleButton
							labelClassName="form-check-label"
							label="Choose players"
							htmlFor="choosePlayers"
							id="choosePlayers"
							type="checkbox"
							name="choosePlayers"
							checked={!!validation.values.choosePlayers}
							inputClassName="form-check-input"
							value={!!validation.values.choosePlayers}
							onClick={(e) => {
								validation.setFieldValue('choosePlayers', !e.target.checked);
							}}
							onBlur={validation.handleBlur}
							switchSizeClass="d-flex justify-content-between form-switch-md px-0 pt-2 mt-4"
						/>
					</Col>
				</Row>
				{validation.values.choosePlayers ? (
					<PlayersList
						userIds={userIds}
						toggleUserId={toggleUserId}
						customContainerClass="p-0"
						toggleAllUsers={toggleAllUsers}
					/>
				) : null}
			</>
		),
		[userIds, validation.values.choosePlayers, languageData, validation]
	);

	return {
		validation,
		leftFormFields,
		rightFormFields,
		customComponent,
		notifyPlayerLoading,
	};
};

export default useNotifyPlayer;
