import React from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup'
import { connect } from 'react-redux';
import { createRoomAction } from '../actions/roomActions';

interface createRoomScreenProps {
  navigation: any;
  createRoom: (arg: object, callback: () => void) => void;
};

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

const createRoomScreen: React.FC<createRoomScreenProps> = ({ navigation, createRoom }) => {
  return(
    <View style={styles.container}>
      <Formik
        initialValues={{ 
          name: '', 
          width: '',
          height: ''
        }}
        onSubmit={values => {
          createRoom(values, () => {
            navigation.push('Main');
          });
        }}
        validationSchema={CreateRoomSchema}
      >
        {({ values, handleChange, errors, setFieldTouched, touched, handleSubmit }) => (
          <View>          
            <TextInput
              label="Room name"
              mode="outlined"
              value={values.name}
              onChangeText={handleChange('name')}
              onBlur={() => setFieldTouched('name')}
            />
            {touched.name && errors.name &&
              <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.name}</Text>
            }
            <TextInput
              label="Width"
              mode="outlined"
              value={values.width}
              onChangeText={handleChange('width')}
              onBlur={() => setFieldTouched('width')}
            />
            {touched.width && errors.width &&
              <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.width}</Text>
            }
            <TextInput
              label="Height"
              mode="outlined"
              value={values.height}
              onChangeText={handleChange('height')}
              onBlur={() => setFieldTouched('height')}
            />
            {touched.height && errors.height &&
              <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.height}</Text>
            }
            <View style={styles.buttonWrapper}>
              <Button
                color="#6300ED"
                title='Create room'
                onPress={() => handleSubmit()}
              />
            </View>
          </View>
        )}
      </Formik>
    </View>
  )
}

const mapDispatchToProps = {
  createRoom: createRoomAction,
};

const wrapper = connect(null, mapDispatchToProps)(createRoomScreen);

export default wrapper;

const styles = StyleSheet.create({
  container: {
    paddingTop: '50%',
    paddingHorizontal: '10%',
  },
  buttonWrapper: {
    marginTop: 10,
  },
});