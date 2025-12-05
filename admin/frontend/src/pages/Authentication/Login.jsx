/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// redux
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';

// Formik validation
import * as Yup from 'yup';
import { useFormik } from 'formik';

import {
	Row,
	Col,
	CardBody,
	Card,
	Alert,
	Container,
	Form,
	Input,
	FormFeedback,
	Label,
	Button,
} from 'reactstrap';
import withRouter from '../../components/Common/withRouter';

// actions
import { loginUser } from '../../store/actions';

// import images
import profile from '../../assets/images/profile-img.png';
import logo from '../../assets/images/logo.svg';
import { projectName } from '../../constants/config';

const Login = (props) => {
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

	const selectLoginState = (state) => state.Login;
	const LoginProperties = createSelector(selectLoginState, (login) => ({
		error: login.error,
	}));

	const { error } = useSelector(LoginProperties);

	// const signIn = (type) => {
	// 	dispatch(socialLogin(type, navigate));
	// };

	// for facebook and google authentication
	// const socialResponse = (type) => {
	// 	signIn(type);
	// };

	return (
		<>
			<div className="home-btn d-none d-sm-block">
				<Link to="/" className="text-dark">
					<i className="bx bx-home h2" />
				</Link>
			</div>
			<div className="account-pages my-5 pt-sm-5">
				<Container>
					<Row className="justify-content-center">
						<Col md={8} lg={6} xl={5}>
							<Card className="overflow-hidden">
								<div className="bg-primary-subtle">
									<Row>
										<Col xs={7}>
											<div className="text-primary p-4">
												<h5 className="text-primary">Welcome Back !</h5>
												<p>Sign in to continue to {projectName}.</p>
											</div>
										</Col>
										<Col className="col-5 align-self-end">
											<img src={profile} alt="" className="img-fluid" />
										</Col>
									</Row>
								</div>
								<CardBody className="pt-0">
									<div>
										<Link to="/" className="auth-logo-light">
											<div className="avatar-md profile-user-wid mb-4">
												<span className="avatar-title rounded-circle bg-light">
													<img
														src={logo}
														alt=""
														className="rounded-circle"
														height="34"
													/>
												</span>
											</div>
										</Link>
									</div>
									<div className="p-2">
										<Form
											className="form-horizontal"
											onSubmit={(e) => {
												e.preventDefault();
												validation.handleSubmit();
												return false;
											}}
										>
											{error ? <Alert color="danger">{error}</Alert> : null}

											<div className="mb-3">
												<Label className="form-label">Email</Label>
												<Input
													name="emailOrUsername"
													className="form-control"
													placeholder="Enter username or email"
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
												<Input
													name="password"
													autoComplete="off"
													value={validation.values.password || ''}
													type="password"
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
												>
													Log In
												</Button>
											</div>

											{/* <div className="mt-4 text-center">
												<h5 className="font-size-14 mb-3">Sign in with</h5>

												<ul className="list-inline">
													<li className="list-inline-item">
														<Link
															to="#"
															className="social-list-item bg-primary text-white border-primary"
															onClick={(e) => {
																e.preventDefault();
																socialResponse('facebook');
															}}
														>
															<i className="mdi mdi-facebook" />
														</Link>
													</li>
													<li className="list-inline-item">
														<Link
															to="#"
															className="social-list-item bg-danger text-white border-danger"
															onClick={(e) => {
																e.preventDefault();
																socialResponse('google');
															}}
														>
															<i className="mdi mdi-google" />
														</Link>
													</li>
												</ul>
											</div> */}

											<div className="mt-4 text-center">
												<Link to="/forgot-password" className="text-muted">
													<i className="mdi mdi-lock me-1" />
													Forgot your password?
												</Link>
											</div>
										</Form>
									</div>
								</CardBody>
							</Card>
							<div className="mt-5 text-center">
								<p>
									Don&#39;t have an account ?{' '}
									<Link to="/register" className="fw-medium text-primary">
										{' '}
										Signup now{' '}
									</Link>{' '}
								</p>
								<p>
									© {new Date().getFullYear()} {projectName}{' '}
									<i className="mdi mdi-heart text-danger" /> by Phibet
								</p>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		</>
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
	router: PropTypes.objectOf,
	// history: PropTypes.objectOf,
};
