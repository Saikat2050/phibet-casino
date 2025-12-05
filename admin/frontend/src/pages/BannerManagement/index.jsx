import React from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/Table';
import useBannerManagement from './hooks/useBannerManagement';

const BannerManagement = () => {
	document.title = 'Banner Management';
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);
	const { columns, formattedSABanners, SABannersloading } =
		useBannerManagement();

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb
						title="Content Management"
						breadcrumbItem="Banner Management"
					/>
				)}
				<TableContainer
					columns={columns}
					data={formattedSABanners}
					isLoading={SABannersloading}
					customPageSize={10}
				/>
			</Container>
		</div>
	);
};

export default BannerManagement;
