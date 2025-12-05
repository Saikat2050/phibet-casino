import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDocumentLabel, resetDocumentLabels } from '../../../store/actions';
import languageCode from '../constants';

const useKYCLables = () => {
	const {
		documentLabels,
		documentLabelsLoading,
		isCreateKYCLabelsSuccess,
		isEditKYCLabelsSuccess,
	} = useSelector((state) => state.SASettings);
	const dispatch = useDispatch();
	const [expanded, setExpanded] = useState('');

	const fetchData = () => {
		dispatch(getDocumentLabel({}));
	};

	const formattedDocumentLabels = useMemo(() => {
		if (documentLabels) {
			setExpanded(documentLabels?.documentLabels?.[0]?.id);
			return documentLabels?.documentLabels?.map((label) => {
				// const language = Object.keys(label.name);
				const language = ['EN'];
				return [
					{
						...label,
						languageData: language?.map((lan) => ({
							language: `${languageCode[lan]} ${lan}`,
							// labelName: label.name[lan],
							labelName: label.name,
						})),
					},
				];
			});
		}
		return [];
	}, [documentLabels]);

	useEffect(() => {
		fetchData();
	}, []);

	// resetting kyc labels redux state
	useEffect(() => () => dispatch(resetDocumentLabels()), []);

	useEffect(() => {
		if (isCreateKYCLabelsSuccess || isEditKYCLabelsSuccess) fetchData();
	}, [isCreateKYCLabelsSuccess, isEditKYCLabelsSuccess]);

	return {
		documentLabels,
		formattedDocumentLabels,
		documentLabelsLoading,
		expanded,
		setExpanded,
	};
};

export default useKYCLables;
