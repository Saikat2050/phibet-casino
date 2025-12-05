import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	fetchDisputesStart,
	fetchDisputeDetails,
	sendMessage,
	updateDisputeStatus,
	updateDispute,
} from '../../../store/actions';
import { debounceTime } from '../../../constants/config';
import useWebSocket from '../../../components/Common/Hooks/useWebSocket';
import { getAccessToken } from '../../../network/storageUtils';
import { showToastr } from '../../../utils/helpers';

const { VITE_APP_API_URL } = import.meta.env;

let debounce;
const useDisputeResolution = () => {
	const dispatch = useDispatch();
	const [page, setPage] = useState(1);
	const [selectedDispute, setSelectedDispute] = useState('');
	const [filters, setFilters] = useState({
		subject: '',
		status: null,
	});

	const {
		disputes,
		loading,
		detailsLoading,
		disputeDetails,
		sendMessageLoading,
		sendMessageSuccess,
	} = useSelector((state) => state.Disputes);

	const handleSocketData = (event, data) => {
		if (event === 'dispute') {
			dispatch(updateDispute(data));
		}
	};

	useWebSocket(
		`${VITE_APP_API_URL}/private`,
		handleSocketData,
		getAccessToken()
	);

	const handleDisputeDetails = () => {
		if (selectedDispute) {
			dispatch(fetchDisputeDetails({ threadId: selectedDispute }));
		}
	};

	useEffect(() => {
		debounce = setTimeout(() => {
			dispatch(
				fetchDisputesStart({
					page,
					perPage: 10,
					...filters,
				})
			);
		}, debounceTime);
		return () => clearInterval(debounce);
	}, [page, filters]);

	useEffect(() => {
		const disputeId = disputes?.threadTickets?.[0]?.id || '';
		if (!selectedDispute && disputeId) setSelectedDispute(disputeId);
	}, [disputes]);

	useEffect(() => {
		handleDisputeDetails();
	}, [selectedDispute]);

	const updateStatus = (payload) => {
		dispatch(updateDisputeStatus(payload));
	};

	const handleSendMessage = ({ attachment, message }, e) => {
		e.preventDefault();
		if (!selectedDispute) {
			showToastr({
				message: 'Dispute details unavailable.',
				type: 'error',
			});
			return;
		}
		dispatch(
			sendMessage({
				data: {
					files: null,
					file: attachment?.[1],
					threadId: selectedDispute,
					userId: disputeDetails?.userId,
					message,
				},
			})
		);
	};

	return {
		disputes,
		loading,
		selectedDispute,
		setSelectedDispute,
		detailsLoading,
		disputeDetails,
		sendMessageLoading,
		handleSendMessage,
		sendMessageSuccess,
		updateStatus,
		setPage,
		page,
		filters,
		setFilters,
	};
};

export default useDisputeResolution;
