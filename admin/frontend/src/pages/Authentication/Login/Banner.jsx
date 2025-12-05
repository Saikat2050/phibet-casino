import React from 'react';
import { Col } from 'reactstrap';
import logo from '../../../assets/images/logo.png';

// img
import authOverlay from '../../../assets/images/login/casino-elements.jpg';

const Banner = () => (
	<Col
		xl={9}
		style={{
			background: `url(${authOverlay})`,
			backgroundSize: '115vw',
			opacity: 1,
			backgroundRepeat: 'no-repeat',
			backgroundPosition: 'center',
		}}
	>
		<div className="auth-full-bg pt-lg-5 p-4 position-relative">
			<div>
				<img src={logo} alt="logo" width="200px" />
			</div>
		</div>
	</Col>
);
export default Banner;
