import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Container } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { createRoomAction } from '../actions/roomActions';

interface CreateRoomProps {
  createRoom: (arg: object, callback: () => void) => void;
}

const CreateRoomSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Too Short!')
    .max(25, 'Too Long!')
    .required('Required'),
  width: Yup.number()
    .min(2, 'Too Small Width!')
    .max(30, 'Too Large Width!')
    .required('Required'),
  height: Yup.number()
    .min(2, 'Too Small Height!')
    .max(30, 'Too Large Height!')
    .required('Required'),
});

const CreateRoom: React.FC<CreateRoomProps> = ({ createRoom }) => {
  const history = useHistory();
  return (
    <Container>
      <h1 className="text-center p-3">Create game room</h1>
      <Formik
        initialValues={{
          name: '',
          height: 2,
          width: 2,
        }}
        validationSchema={CreateRoomSchema}
        onSubmit={(values) => {
          createRoom(values, () => {
            history.push('/');
          });
        }}
      >
        { ({
          values, errors, touched, handleChange, handleBlur, handleSubmit,
        }) => (
          <Form>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Room name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Some name"
                value={values.name}
                onChange={handleChange('name')}
                onBlur={handleBlur}
              />
              { touched.name && errors.name && (
              <Form.Text className="text-danger">
                { errors.name }
              </Form.Text>
              )}
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect2">
              <Form.Label>Input width of the field between 2 and 30</Form.Label>
              <Form.Control
                type="number"
                min="2"
                max="30"
                value={values.width}
                onChange={handleChange('width')}
                onBlur={handleBlur}
              />
              { touched.width && errors.width && (
              <Form.Text className="text-danger">
                { errors.width }
              </Form.Text>
              )}
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect3">
              <Form.Label>Input height of the field between 2 and 30</Form.Label>
              <Form.Control
                type="number"
                min="2"
                max="30"
                value={values.height}
                onChange={handleChange('height')}
              />
              { touched.height && errors.height && (
              <Form.Text className="text-danger">
                {errors.height}
              </Form.Text>
              )}
            </Form.Group>
            <Button className="text-right" variant="primary" onClick={() => handleSubmit()}>
              Save
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

const mapDispatchToProps = {
  createRoom: createRoomAction,
};

const wrapper = connect(null, mapDispatchToProps)(CreateRoom);

export default wrapper;
