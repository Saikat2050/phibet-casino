import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { footerText, projectName } from '../../constants/config';

const Footer = () => (
	<footer className="footer">
		<Container fluid>
			<Row>
				<Col md={6}>
					{new Date().getFullYear()} © {projectName}
				</Col>
				<Col md={6}>
					<div className="text-sm-end d-none d-sm-block">{footerText}</div>
				</Col>
			</Row>
		</Container>
	</footer>
);

export default Footer;
