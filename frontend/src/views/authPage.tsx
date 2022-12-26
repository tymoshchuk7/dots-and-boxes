import { Link } from 'react-router-dom';
import {
  Form, Button, Row, Col, Container,
} from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { logInAction, verifyAction } from '../actions/userActions';

interface AuthProps {
  logInUser: {
    loading: boolean;
  };
  logIn: (arg: object) => void;
  verify: () => void;
}

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(4, 'Too Short!')
    .max(25, 'Too Long!')
    .required('Required'),
});

const Auth: React.FC<AuthProps> = ({ logInUser, logIn, verify }) => {
  const { loading } = logInUser;

  useEffect(() => {
    verify();
  }, [loading]);

  return (
    <Container>
      <h1 className="text-center p-3">Authorization</h1>
      <Row>
        <Col>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={LoginSchema}
            onSubmit={(values) => {
              logIn(values);
            }}
          >
            { ({
              values, errors, touched, handleChange, handleBlur, handleSubmit,
            }) => (
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    placeholder="Enter email"
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange('email')}
                  />
                  { touched.email && errors.email && (
                  <Form.Text className="text-danger">
                    {errors.email}
                  </Form.Text>
                  )}
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    placeholder="Password"
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange('password')}
                  />
                  { touched.password && errors.password && (
                  <Form.Text className="text-danger">
                    {errors.password}
                  </Form.Text>
                  )}
                </Form.Group>
                <p>
                  Have not account?
                  {' '}
                  <Link to="/registration">Sign up</Link>
                  {' '}
                  now!
                </p>
                <Button onClick={() => handleSubmit()}>
                  Log in
                </Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  logInUser: state.logInUser,
});

const mapDispatchToProps = {
  logIn: logInAction,
  verify: verifyAction,
};

const wrapper = connect(mapStateToProps, mapDispatchToProps)(Auth);

export default wrapper;
