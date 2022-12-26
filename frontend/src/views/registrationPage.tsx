import {
  Form, Row, Col, Button, Container,
} from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { signUpAction } from '../actions/userActions';

interface RegistrationProps {
  signUp: (arg: object, callbacK: () => void) => void;
}

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Too Short!')
    .max(25, 'Too Long!')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(4, 'Too Short!')
    .max(25, 'Too Long!')
    .required('Required'),
});

const Registration: React.FC<RegistrationProps> = ({ signUp }) => {
  const history = useHistory();
  const [image, setImage] = useState<Blob>();
  const [isInvalidImage, setIsInvalidImage] = useState(false);

  return (
    <Container>
      <h1 className="text-center p-3">Registration</h1>
      <Row>
        <Col>
          <Formik
            initialValues={{
              username: '',
              email: '',
              password: '',
            }}
            validationSchema={SignupSchema}
            onSubmit={(values) => {
              const formData = new FormData();
              if (image) {
                if (!image?.type.match(/image/)) {
                  setIsInvalidImage(true);
                  return;
                }
                formData.append('image', image);
              }
              formData.append('username', values.username);
              formData.append('email', values.email);
              formData.append('password', values.password);
              signUp(formData, () => {
                history.push('/');
              });
            }}
          >
            { ({
              values, errors, touched, handleChange, handleBlur, handleSubmit,
            }) => (
              <Form>
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label>Upload your avatar</Form.Label>
                  <Form.Control type="file" onChange={(event: any) => setImage(event.target.files[0])} />
                  { isInvalidImage && (
                    <Form.Text className="text-danger">
                      Please select image
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group controlId="formBasicUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Enter username"
                    value={values.username}
                    onBlur={handleBlur}
                    onChange={handleChange('username')}
                  />
                  { touched.username && errors.username && (
                  <Form.Text className="text-danger">
                    {errors.username}
                  </Form.Text>
                  )}
                </Form.Group>
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
                  Already have account?
                  <Link to="/"> Go back</Link>
                </p>
                <Button onClick={() => handleSubmit()}>
                  Sign up
                </Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

const mapDispatchToProps = {
  signUp: signUpAction,
};

const wrapper = connect(null, mapDispatchToProps)(Registration);

export default wrapper;
