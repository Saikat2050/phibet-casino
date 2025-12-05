import React, { useState } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'reactstrap';
// eslint-disable-next-line import/no-extraneous-dependencies
import Breadcrumbs from '../../components/Common/Breadcrumb';
import fallbackImage from '../../assets/images/PayMentProvider/credit-card.png';
import useAddNewProvider from './hooks/useAddNewProvider';
import FormModal from '../../components/Common/FormModal';
import CrudSection from '../../components/Common/CrudSection';
import NoDataFound from '../../components/Common/NoDataFound';

const AddNewProvider = () => {
	const [type, setType] = useState();
	const {
		validation,
		formFields,
		isOpen,
		handleProviderClick,
		setHeader,
		paymentProviderData,
		isLoadinpaymentProvider,
		onBackClick,
		buttonList,
		fetchMoreData,
		page,
		toggleFormModal,
		header,
		selectedProvider,
	} = useAddNewProvider({
		type,
		setType,
	});

	return (
		<div className="page-content">
			<Breadcrumbs
				title="Payment"
				breadcrumbItem="Configure"
				leftTitle={
					<>
						<i className="fas fa-angle-left" /> Back
					</>
				}
				callBack={onBackClick}
			/>
			<Container fluid>
				<Card className="p-2">
					<CrudSection buttonList={buttonList} title="Payment provider" />
					{isLoadinpaymentProvider &&
						paymentProviderData?.providerCredentials?.length === 0 && (
							<div
								className="d-flex justify-content-center align-items-center"
								style={{ height: '200px' }}
							>
								<Spinner color="primary" />
							</div>
						)}
					{!isLoadinpaymentProvider &&
						paymentProviderData?.providerCredentials?.length === 0 && (
							<div
								className="d-flex justify-content-center align-items-center"
								style={{ height: '200px' }}
							>
								<NoDataFound height="200px" width="300px" />
							</div>
						)}
					<Row className="p-4">
						{paymentProviderData?.providerCredentials?.map((provider) => (
							<Col
								xs="6"
								sm="3"
								md="2"
								className="p-2 payment-card"
								key={provider.id}
							>
								<button
									type="button"
									onClick={() => {
										handleProviderClick(provider);
										setType('Edit');
										setHeader(
											`Edit ${provider.name ?? 'payment provider'} Details`
										);
									}}
									className={`provider-button  ${
										selectedProvider?.id === provider.id ? 'selected' : ''
									}`}
								>
									<img
										src={provider.icon || fallbackImage}
										alt={provider.name}
										className="provider-image"
									/>
									<div className="provider-name">{provider.name}</div>
									<div
										className={`status-icon ${
											provider.isActive ? 'active-icon' : 'inactive-icon'
										}`}
									>
										{provider.isActive ? (
											<i className="bx bx-check-circle" />
										) : (
											<i className="bx bx-x-circle" />
										)}
									</div>
								</button>
							</Col>
						))}
					</Row>

					{paymentProviderData?.totalPages > page && (
						<div className="d-flex justify-content-center mt-3">
							<Button color="primary" outline onClick={fetchMoreData}>
								View More
							</Button>
						</div>
					)}
				</Card>
				<FormModal
					isOpen={isOpen}
					toggle={toggleFormModal}
					header={header}
					validation={validation}
					formFields={formFields}
					submitLabel="Submit"
					isSubmit
					customColClasses="mb-4"
				/>
			</Container>
		</div>
	);
};

export default AddNewProvider;
