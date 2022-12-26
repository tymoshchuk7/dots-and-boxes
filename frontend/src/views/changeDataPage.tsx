import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { changeAvatarAction, changePasswordAction } from '../actions/userActions';

interface ChangeDataInterface {
  changePassword: any;
  changeAvatar: any;
}

const ChangeDataSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .min(4, 'Too Short!')
    .max(25, 'Too Long!')
    .required('Required'),
  newPassword: Yup.string()
    .min(4, 'Too Short!')
    .max(25, 'Too Long!')
    .required('Required'),
});

const ChangeDataPage: React.FC<ChangeDataInterface> = ({ changePassword, changeAvatar }) => {
  const history = useHistory();
  const [isWrong, setIsWrong] = useState(false);
  const [isInvalidImage, setIsInvalidImage] = useState(false);
  const [image, setImage] = useState<File>();

  const imageBtnHandler = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (image?.type.match(/image/)) {
      const payload = new FormData();
      payload.append('image', image);
      changeAvatar(payload, () => {
        history.push('/');
      });
    } else {
      setIsInvalidImage(true);
    }
  };

  return (
    <Container>
      <h1 className="text-center p-3">Change personal data</h1>
      <Formik
        initialValues={{
          oldPassword: '',
          newPassword: '',
          newPassword2: '',
        }}
        validationSchema={ChangeDataSchema}
        onSubmit={(values) => {
          if (values.newPassword === values.newPassword2) {
            changePassword(values, () => {
              history.push('/');
            });
          } else {
            setIsWrong(true);
          }
        }}
      >
        { ({
          values, errors, touched, handleChange, handleBlur, handleSubmit,
        }) => (
          <Form>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Old password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Old password"
                value={values.oldPassword}
                onChange={handleChange('oldPassword')}
                onBlur={handleBlur}
              />
              { touched.oldPassword && errors.oldPassword && (
              <Form.Text className="text-danger">
                { errors.oldPassword }
              </Form.Text>
              )}
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlInput2">
              <Form.Label>New password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="New password"
                value={values.newPassword}
                onChange={handleChange('newPassword')}
                onBlur={handleBlur}
              />
              { touched.newPassword && errors.newPassword && (
                <Form.Text className="text-danger">
                  { errors.newPassword }
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlInput3">
              <Form.Control
                required
                type="password"
                placeholder="Repeat new password"
                value={values.newPassword2}
                onChange={handleChange('newPassword2')}
                onBlur={handleBlur}
              />
              { isWrong && (
                <Form.Text className="text-danger">
                  Check new password
                </Form.Text>
              )}
            </Form.Group>
            <Button onClick={() => handleSubmit()}>
              Change password
            </Button>
          </Form>
        )}
      </Formik>
      <Form>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Upload your new avatar</Form.Label>
          <Form.Control
            type="file"
            onChange={(event: any) => {
              setImage(event.target.files[0]);
            }}
          />
          { isInvalidImage && (
          <Form.Text className="text-danger">
            Please select image
          </Form.Text>
          )}
        </Form.Group>
        <Button onClick={(event) => imageBtnHandler(event)}>
          Change avatar
        </Button>
      </Form>
    </Container>
  );
};

const mapDispatchToProps = {
  changePassword: changePasswordAction,
  changeAvatar: changeAvatarAction,
};

const wrapper = connect(null, mapDispatchToProps)(ChangeDataPage);

export default wrapper;
