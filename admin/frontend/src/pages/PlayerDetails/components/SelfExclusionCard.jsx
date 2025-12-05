/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { useEffect, useState } from 'react';
import {
	Button,
	Card,
	Form,
	Modal,
	ModalBody,
	ModalHeader,
	UncontrolledTooltip,
} from 'reactstrap';
import { useDispatch } from 'react-redux';
import {
	CustomInputField,
	CustomSelectField,
} from '../../../helpers/customForms';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { selfExclusionSchema } from '../formDetails';
import { disableUser } from '../../../store/actions';
import { timePeriodValues } from '../constants';

const SelfExclusionCard = ({ limit, userId }) => {
	const dispatch = useDispatch();
	const [isResetLimit, setIsResetLimit] = useState({ open: false, data: '' });
	const [customValue, setCustomValue] = useState(false);
	const onResetLimit = () => {
		setIsResetLimit({ open: true, data: limit });
	};
	const { validation } = useForm({
		validationSchema: selfExclusionSchema,
		initialValues: {
			days: [0, 1, 7, 30, 180, 365].includes(limit?.days)
				? ''
				: limit?.days || '',
			// eslint-disable-next-line no-nested-ternary
			permanent: [-1, 1, 7, 30, 180, 365].includes(limit?.days)
				? limit?.days
				: limit?.days === 0
				? null
				: 'custom' || null,
		},
		onSubmitEntry: (formValues) =>
			dispatch(
				disableUser({
					userId,
					reset: false,
					expireIn:
						formValues?.permanent !== 'custom'
							? Number(formValues?.permanent)
							: Number(formValues?.days),
					value:
						validation?.values?.permanent === '-1' ? 'permanent' : 'temporary',
				})
			),
	});

	useEffect(() => {
		if (validation?.values?.permanent === 'custom') {
			setCustomValue(true);
		} else {
			setCustomValue(false);
		}
	}, [validation?.values]);

	useEffect(() => {
		if ([-1, 0, 1, 7, 30, 180, 365].includes(limit?.days)) {
			setCustomValue(false);
		} else {
			setCustomValue(true);
		}
	}, []);

	useEffect(() => {
		if (limit.value) {
			validation.setValues({ perPage: limit.value });
		}
	}, [limit]);

	const toggle = () =>
		setIsResetLimit((prev) => ({ open: !prev.open, data: prev.data }));

	const handleYes = () => {
		dispatch(
			disableUser({
				userId,
				expireIn: 0,
				reset: true,
				value: 'temporary',
			})
		);
	};

	return (
		<Card className="p-3 border">
			<div>
				<Form
					onSubmit={(e) => {
						e.preventDefault();
						validation.handleSubmit();
						return false;
					}}
				>
					<h5 className="text-center">{limit.label}</h5>
					<CustomSelectField
						label="Time Period"
						name="permanent"
						isClearable
						className="mb-2"
						type="select"
						onChange={(e) => {
							validation.handleChange(e);
						}}
						onBlur={validation.handleBlur}
						validate={{ required: { value: true } }}
						value={validation.values.permanent}
						invalid={
							!!(validation.touched.permanent && validation.errors.permanent)
						}
						isError
						errorMsg={
							validation.touched.permanent && validation.errors.permanent
						}
						options={[
							<option key="default" value="" disabled selected>
								Select a time period
							</option>,
							...timePeriodValues.map(({ optionLabel, value }) => (
								<option key={value} value={value}>
									{optionLabel}
								</option>
							)),
						]}
					/>
					{customValue && (
						<CustomInputField
							label="Enter Days"
							name="days"
							type="number"
							placeholder="Enter Days"
							value={validation?.values?.days}
							onChange={validation.handleChange}
							onBlur={validation.handleBlur}
							invalid={!!(validation.touched?.days && validation.errors?.days)}
							isError
							errorMsg={validation.touched?.days && validation.errors?.days}
						/>
					)}
					<div className="mt-3 text-center d-flex justify-content-center">
						<Button type="submit" className="btn btn-primary" color="primary">
							Set
						</Button>
						{!!limit?.days && (
							<>
								<i
									className="mdi mdi-refresh"
									style={{
										cursor: 'pointer',
										fontSize: '1.5rem',
										marginLeft: '5px',
									}}
									id="refresh"
									onClick={onResetLimit}
									onKeyDown={(event) => {
										if (event.key === 'Enter') {
											onResetLimit();
										}
									}}
									tabIndex="0"
								/>
								<UncontrolledTooltip placement="top" target="refresh">
									Reset Limit
								</UncontrolledTooltip>
							</>
						)}
					</div>
				</Form>
			</div>
			<Modal isOpen={isResetLimit.open} toggle={toggle} backdrop="static">
				<ModalHeader toggle={toggle} tag="h4">
					Are you sure you want to reset {limit?.label}?
				</ModalHeader>
				<ModalBody>
					<Button onClick={handleYes}>Yes</Button>
					<Button className="mx-2" onClick={toggle}>
						No
					</Button>
				</ModalBody>
			</Modal>
		</Card>
	);
};

export default SelfExclusionCard;
