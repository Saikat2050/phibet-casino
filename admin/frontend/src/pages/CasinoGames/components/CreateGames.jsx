import React, { useEffect } from 'react';
import { Container } from 'reactstrap';

import { useSelector, useDispatch } from 'react-redux';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import FormPage from '../../../components/Common/FormPage';
import useAddGames from '../hooks/useAddGames';
import { projectName } from '../../../constants/config';
import { getAggregatorsList } from '../../../store/actions';

const CreateGames = () => {
	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAggregatorsList());
	}, [dispatch]);

	const { validation, formFields, addGameLoading } = useAddGames();

	return (
		<div className="page-content">
			{showBreadcrumb && (
				<Breadcrumbs
					title="Casino Management"
					breadcrumbItem="Add Games"
					showBackButton
				/>
			)}
			<Container fluid>
				<FormPage
					formTitle="Add New Game"
					validation={validation}
					responsiveFormFields={formFields}
					submitLabel="Add Game"
					colOptions={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4, xxl: 4 }}
					customColClasses=""
					isSubmitLoading={addGameLoading}
				/>
			</Container>
		</div>
	);
};

export default CreateGames;
