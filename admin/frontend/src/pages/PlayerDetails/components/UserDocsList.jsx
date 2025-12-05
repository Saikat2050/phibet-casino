/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Container } from 'reactstrap';
import TableContainer from '../../../components/Common/Table';
import {
	activateKyc,
	getDocumentLabel,
	inActiveKyc,
	rejectDocument,
	requestDocument,
	verifyDocument,
} from '../../../store/actions';
import { Actionee, Name, Reason, ThumbnailUrl } from './UserDocsListCol';
import { Status } from '../TableCol';
import { DOCUMENT_STATUS_TYPES } from '../constants';
import ModalView from '../../../components/Common/Modal';
import { CustomInputField } from '../../../helpers/customForms';
import { modules } from '../../../constants/permissions';
import { ICON_CLASS, TEXT_COLORS } from '../../../utils/constant';
import Actions from '../../../components/Common/Actions';
import ButtonList from '../../../components/Common/ButtonList';

const UserDocsList = ({ userDetails, userId }) => {
	const dispatch = useDispatch();
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [page, setPage] = useState(1);
	const [showModal, setShowModal] = useState({
		documentLabelId: '',
		show: false,
	});
	const [reason, setReason] = useState('');
	const {
		requestDocument: requestDocuments,
		verifyDocument: verifyDocuments,
		rejectDocument: rejectDocuments,
	} = useSelector((state) => state.UserDetails);
	const { documentLabels, documentLabelsLoading } = useSelector(
		(state) => state.SASettings
	);

	const formattedKycLabels = useMemo(() => {
		if (documentLabels?.documentLabels?.length > 0) {
			return documentLabels?.documentLabels?.map((label) => ({
				id: label?.id,
				name: label?.name,
				url: label?.documents?.[0]?.url || 'Not Provided',
				comment: label?.documents?.[0]?.comment || 'NA',
				actionee: label?.documents?.[0]?.adminUser?.username || 'NA',
				required: label?.required,
				status:
					DOCUMENT_STATUS_TYPES?.find(
						(status) => status.value === label?.documents?.[0]?.status
					)?.label || 'Not Provided',
			}));
		}
		return [];
	}, [documentLabels]);

	const handleRequestDocument = ({ id }) => {
		dispatch(
			requestDocument({
				documentLabelId: id,
				userId,
			})
		);
	};

	const handleVerifyDocument = ({ id }) => {
		const userDocumentId = userDetails?.documents?.find(
			(document) => id === document?.documentLabelId
		)?.id;
		dispatch(
			verifyDocument({
				userDocumentId,
				userId,
			})
		);
	};

	const toggleModal = ({ id }) => {
		setShowModal((prev) => ({
			documentLabelId: id,
			show: !prev?.show,
		}));
	};

	const handleRejectDocument = (documentLabelId) => {
		dispatch(
			rejectDocument({
				documentLabelId,
				userId,
				kycStatus: 'false',
				reason,
			})
		);
		toggleModal(documentLabelId);
		setReason('');
	};

	const onChangeRowsPerPage = (value) => {
		setPage(1);
		setItemsPerPage(value);
	};

	const isRequestDocumentDisabled = ({ status }) =>
		status === 'Requested' || status === 'Pending';

	const isVerifyDocumentDisabled = ({ status }) =>
		status === 'Requested' ||
		status === 'Approved' ||
		status === 'Rejected' ||
		status === 'Not Provided';

	const actionsList = [
		{
			actionName: 'Request Document',
			actionHandler: handleRequestDocument,
			isHidden: false,
			icon: ICON_CLASS.file,
			iconColor: TEXT_COLORS.primary,
			isDisabled: isRequestDocumentDisabled,
		},
		{
			actionName: 'Verify Document',
			actionHandler: handleVerifyDocument,
			isHidden: false,
			icon: ICON_CLASS.editFile,
			iconColor: TEXT_COLORS.success,
			isDisabled: isVerifyDocumentDisabled,
		},
		{
			actionName: 'Reject Document',
			actionHandler: toggleModal,
			isHidden: false,
			icon: ICON_CLASS.cancelFile,
			iconColor: TEXT_COLORS.danger,
			isDisabled: isVerifyDocumentDisabled,
		},
	];

	const columns = useMemo(
		() => [
			// {
			// 	Header: 'DOCUMENT ID',
			// 	accessor: 'id',
			// 	notHidable: true,
			// 	filterable: true,
			// 	Cell: ({ cell }) => <Id value={cell.value} />,
			// },
			{
				Header: 'NAME',
				accessor: 'name',
				filterable: true,
				Cell: ({ cell }) => <Name value={cell?.row?.original} />,
			},
			{
				Header: 'DOCUMENT THUMBNAIL',
				accessor: 'url',
				filterable: true,
				Cell: ({ cell }) => <ThumbnailUrl value={cell.value} />,
			},
			{
				Header: 'REASON',
				accessor: 'comment',
				filterable: true,
				Cell: ({ cell }) => <Reason value={cell.value} />,
			},
			{
				Header: 'ACTIONEE',
				accessor: 'actionee',
				Cell: ({ cell }) => <Actionee value={cell.value} />,
			},
			{
				Header: 'STATUS',
				accessor: 'status',
				disableSortBy: true,
				Cell: ({ cell }) => <Status value={cell.value} />,
			},
			{
				Header: 'Action',
				Cell: ({ cell }) => <Actions cell={cell} actionsList={actionsList} />,
			},
		],
		[userDetails]
	);

	const fetchLabels = () => {
		dispatch(
			getDocumentLabel({
				userId,
			})
		);
	};

	useEffect(() => {
		fetchLabels();
	}, [userId]);

	useEffect(() => {
		if (requestDocuments || verifyDocuments || rejectDocuments) fetchLabels();
	}, [requestDocuments, verifyDocuments, rejectDocuments]);

	const handletoggleKyc = () => {
		if (userDetails?.kycStatus) {
			dispatch(inActiveKyc({ userId }));
		} else {
			dispatch(activateKyc({ userId }));
		}
	};

	const buttonList = useMemo(
		() => [
			{
				label: userDetails?.kycStatus ? 'Reject KYC' : 'Approve KYC',
				handleClick: handletoggleKyc,
				link: '#!',
				module: modules.kyc,
				operation: 'C',
			},
		],
		[userDetails]
	);
	const actionList = <ButtonList buttonList={buttonList} />;

	return (
		<Container fluid>
			<TableContainer
				isLoading={documentLabelsLoading}
				columns={columns || []}
				data={formattedKycLabels || []}
				isGlobalFilter
				isPagination
				customPageSize={itemsPerPage}
				tableClass="table-bordered align-middle nowrap mt-2"
				paginationDiv="justify-content-center"
				pagination="pagination justify-content-start pagination-rounded"
				totalPageCount={documentLabels?.totalPages || 0}
				isManualPagination
				onChangePagination={setPage}
				currentPage={page}
				changeRowsPerPageCallback={onChangeRowsPerPage}
				actionList={actionList}
			/>
			<ModalView
				openModal={showModal.show}
				toggleModal={() =>
					setShowModal((prev) => ({
						...prev,
						show: !prev.show,
					}))
				}
				headerTitle="Reject Document Reason"
				className="modal-dialog"
				hideFooter
			>
				<CustomInputField
					name="reason"
					type="text"
					onChange={(e) => {
						setReason(e?.target?.value);
					}}
					placeholder="Enter Reject Document Reason"
					validate={{ required: { value: true } }}
					value={reason}
				/>
				<Button
					color="primary"
					className="mt-2 float-end"
					onClick={() => handleRejectDocument(showModal?.documentLabelId)}
				>
					Submit
				</Button>
			</ModalView>
		</Container>
	);
};

export default UserDocsList;
