/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

// redux
import { useSelector, useDispatch } from 'react-redux';

// Formik validation
import * as Yup from 'yup';
import { useFormik } from 'formik';

import {
	Row,
	Col,
	Container,
	Form,
	Input,
	FormFeedback,
	Label,
	Button,
} from 'reactstrap';
import withRouter from '../../../components/Common/withRouter';

// actions
import { loginUser } from '../../../store/actions';

// import images
import { projectName } from '../../../constants/config';
import Banner from './Banner';

const Login = (props) => {
	const [passwordShow, setPasswordShow] = useState(false);

	// meta title
	const {
		router: { navigate },
	} = props;
	document.title = 'Login';
	const dispatch = useDispatch();

	const validation = useFormik({
		// enableReinitialize : use this flag when initial values needs to be changed
		enableReinitialize: true,

		initialValues: {
			emailOrUsername: '',
			password: '',
		},
		validationSchema: Yup.object({
			emailOrUsername: Yup.string().required(
				'Please Enter Your Username or Email'
			),
			password: Yup.string().required('Please Enter Your Password'),
		}),
		onSubmit: (values) => {
			dispatch(loginUser(values, navigate));
		},
	});

	const { loading } = useSelector((state) => state.Login);

	// 	dispatch(socialLogin(type, navigate));
	// };

	// for facebook and google authentication
	// const socialResponse = (type) => {
	// 	signIn(type);
	// };

	return (
		<div>
			<Container fluid className="p-0">
				<Row className="g-0">
					<Banner />

					<Col xl={3}>
						<div className="auth-full-page-content p-md-5 p-4">
							<div className="w-100">
								<div className="d-flex flex-column h-100">
									{/* <div className="mb-4 mb-md-5">
										<img
											src={logodark}
											alt=""
											height="30"
											className="logo-dark-element"
										/>
										<img
											src={logodark}
											alt=""
											height="30"
											className="logo-light-element"
										/>
									</div> */}
									<div className="my-auto">
										<div>
											<h2 className="text-primary">Welcome Back !</h2>
											<p className="text-muted">
												Sign in to continue to {projectName}.
											</p>
										</div>

										<div className="mt-4">
											<Form
												className="form-horizontal"
												onSubmit={(e) => {
													e.preventDefault();
													validation.handleSubmit();
													return false;
												}}
											>
												<div className="mb-3">
													<Label className="form-label">Username/Email</Label>
													<Input
														name="emailOrUsername"
														className="form-control"
														placeholder="Enter username or email"
														type="text"
														onChange={validation.handleChange}
														onBlur={validation.handleBlur}
														value={validation.values.emailOrUsername || ''}
														invalid={
															!!(
																validation.touched.emailOrUsername &&
																validation.errors.emailOrUsername
															)
														}
													/>
													{validation.touched.emailOrUsername &&
													validation.errors.emailOrUsername ? (
														<FormFeedback type="invalid">
															{validation.errors.emailOrUsername}
														</FormFeedback>
													) : null}
												</div>

												<div className="mb-3">
													<Label className="form-label">Password</Label>
													<div className="input-group auth-pass-inputgroup">
														<Input
															name="password"
															autoComplete="off"
															value={validation.values.password || ''}
															type={passwordShow ? 'text' : 'password'}
															placeholder="Enter Password"
															onChange={validation.handleChange}
															onBlur={validation.handleBlur}
															invalid={
																!!(
																	validation.touched.password &&
																	validation.errors.password
																)
															}
														/>
														<Button
															onClick={() => setPasswordShow(!passwordShow)}
															className="border border-secondary border-opacity-25"
															color="light"
															id="password-addon"
														>
															{passwordShow ? (
																<i className="mdi mdi-eye-outline" />
															) : (
																<i className="mdi mdi-eye-off-outline" />
															)}
														</Button>
													</div>
													{validation.touched.password &&
													validation.errors.password ? (
														<FormFeedback type="invalid">
															{validation.errors.password}
														</FormFeedback>
													) : null}
												</div>
												<div className="mt-3 d-grid">
													<Button
														className="btn-block"
														color="primary"
														type="submit"
														disabled={loading}
													>
														{loading && (
															<i className="bx bx-hourglass bx-spin font-size-16 align-middle me-2" />
														)}
														Log In
													</Button>
												</div>
											</Form>
										</div>
									</div>
									<div className="mt-4 mt-md-5 text-center">
										<p className="mb-0">
											© {new Date().getFullYear()} {projectName}{' '}
											<i className="mdi mdi-heart text-danger" /> by Phibet
										</p>
									</div>
								</div>
							</div>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default withRouter(Login);

Login.defaultProps = {
	navigate: () => {},
	router: {},
	// history: {}
};

Login.propTypes = {
	navigate: PropTypes.func,
	router: PropTypes.shape({
		location: PropTypes.shape({
			pathname: PropTypes.string.isRequired,
			search: PropTypes.string.isRequired,
		}).isRequired,
		navigate: PropTypes.func.isRequired,
	}),
};
