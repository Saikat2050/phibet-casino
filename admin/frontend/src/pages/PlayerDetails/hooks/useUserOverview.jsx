/* eslint-disable camelcase */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import { formatDateYMD } from '../../../utils/dateFormatter';
import { genderTypes, KYC_STATUS_TYPE } from '../constants';
// import moment from 'moment';

const useUserOverview = ({ user }) => {
	const { playerId } = useParams();
	const showStyle = (data) => (data ? 'text-success' : 'text-danger');
	const printData = (data) => (data ? 'Yes' : 'No');

	const { userStatsData } = useSelector((state) => state.UserDetails);

	const {
		addresses,
		emailVerified,
		phoneVerified,
		firstName,
		lastName,
		username,
		gender,
		dateOfBirth,
		email,
		// defaultDisableReason,
		isActive,
		reason,
		kycMethod,
		phone,
		sumsubKycStatus,
		kycStatus,
		userTags,
		publicAddress,
		referral,
		uniqueId,
		isProfile
		// registration,
	} = user || {};

	const address = addresses?.length
		? `${addresses[addresses.length - 1]?.address1 || '-'}, ${addresses[addresses.length - 1]?.address2
			? `${addresses[addresses.length - 1]?.address2},`
			: ''
		} ${addresses[addresses.length - 1]?.city || '-'}, ${addresses[addresses.length - 1]?.zipCode || '-'
		}, ${addresses[addresses.length - 1]?.countryCode || '-'} `
		: '-';
	let tags = '';
	userTags?.forEach((t, idx) => {
		tags += `${t?.tag?.tag} ${idx + 1 !== userTags?.length ? ',' : ''}`;
	});

	const basicInfo = [
		{ label: 'ID', value: playerId },
		{
			label: 'UUID',
			value: uniqueId,
		},
		{ label: 'Email', value: email },
		{
			label: 'Email Verified',
			value: printData(emailVerified),
			subValue: showStyle(emailVerified),
		},
		{
			label: 'Phone Verified',
			value: printData(phoneVerified),
			subValue: showStyle(phoneVerified),
		},
		{ label: 'Full Name', value: `${firstName || ''} ${lastName || '-'}` },
		{ label: 'User Name', value: username },

		{ label: 'Date Of Birth', value: formatDateYMD(dateOfBirth) },

		{
			label: 'Status',
			value: isActive ? 'Active' : 'In -Active',
			subValue: showStyle(isActive),
		},
		// { label: 'Inactive Reason', value: defaultDisableReason || '-' },
		// { label: 'Portal', value: `${tenant?.name} (${tenant?.domain})` },
		{ label: 'Reason', value: !isActive ? reason : '' },
		{
			label: 'Segments',
			value: tags || 'NA',
		},

		// { label: 'SumSub Applicant Id', value: applicantId },
	];

	const addLineBreaks = (str, length) => {
		let result = '';
		for (let i = 0; i < str.length; i += length) {
			result += `${str.substring(i, i + length)} `;
		}
		return result;
	};

	const contactInfo = [
		{ label: 'Phone Number', value: phone },
		{ label: 'Address', value: address },
		...(!isEmpty(referral)
			? [
				{
					label: 'Referred By',
					value: (
						<Link
							className="text-decoration-underline"
							to={`/player-details/${referral?.id}`}
						>
							{`${referral?.firstName || ''} ${referral?.lastName || ''} ${!(referral?.firstName && referral?.lastName)
								? referral?.username
								: ''
								}`}
						</Link>
					),
				},
			]
			: []),
		...(publicAddress
			? [
				{ label: 'Metamask Registered Player', value: 'Yes' },
				{
					label: 'Wallet Address',
					value: addLineBreaks(publicAddress, 10),
				},
			]
			: []),

		// { label: 'Country Code', value: address?.countryCode },
		// {
		// 	label: 'NewsLetter',
		// 	value: newsLetter ? 'True' : 'False',
		// 	subValue: showStyle(newsLetter),
		// },
		// {
		// 	label: 'SMS',
		// 	value: sms ? 'True' : 'False',
		// 	subValue: showStyle(sms),
		// },
	];
	const kycInfo = [
		// {
		// 	label: 'KYC Method',
		// 	value: kycMethod === 1 ? 'Sumsub' : 'System KYC',
		// },
		{
			label: 'Profile Data Status',
			value: isProfile ? 'Data Verified' : 'Pending',
		},
		{
			label: 'ID Status',
			value:
				kycMethod === 1
					? sumsubKycStatus?.toUpperCase()
					: KYC_STATUS_TYPE?.[kycStatus] === KYC_STATUS_TYPE.COMPLETE ? 'ID Verified' : KYC_STATUS_TYPE?.[kycStatus] || 'Pending',
		},
	];

	const otherInfo = [
		{
			label: 'Gender',
			value: genderTypes.find((gen) => gen.value === gender)?.label || '',
		},
		// {
		// 	label: 'Registration Date',
		// 	value: moment(registration).format('ll')
		// },
	];

	return {
		basicInfo,
		contactInfo,
		kycInfo,
		userStatsData,
		otherInfo,
	};
};

export default useUserOverview;
