import React, { useState } from 'react';
import {
  Text, View,
  StyleSheet, Image
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { signUpAction } from '../actions/userActions';

interface RegistrationScreenProps {
  navigation: any;
  signUp: (arg: object, callback: () => void) => void;
};

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


const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ navigation, signUp }) => {

  const [image, setImage] = useState('');

  const openImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled) return;
    setImage(pickerResult.uri);
  }

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: ''
        }}
        onSubmit={values => {
          const formData = new FormData();
          if (image?.match(/.jpg/) || image?.match(/.png/)) {
            formData.append('image', {
              uri: image,
              name: 'avatar.jpg',
              filename: 'imageAvatar.jpg',
              type: 'image/png'
            }, 'some.jpg');
          }
          formData.append('username', values.username);
          formData.append('email', values.email);
          formData.append('password', values.password);
          signUp(formData, () => {
            navigation.push('Authorization');
          });
        }}
        validationSchema={SignupSchema}
      >
        {({ values, handleChange, errors, setFieldTouched, touched, handleSubmit }) => (
          <View>
            {image.length > 0 && (
              <View style={{ alignItems: 'center' }}>
                <Image
                  source={{
                    uri: image,
                  }}
                  style={styles.image}
                />
              </View>)}
            <TextInput
              mode="outlined"
              label="Username"
              value={values.username}
              onChangeText={handleChange('username')}
              onBlur={() => setFieldTouched('username')}
            />
            {touched.username && errors.username &&
              <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.username}</Text>
            }
            <TextInput
              mode="outlined"
              label="E-mail"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={() => setFieldTouched('email')}
            />
            {touched.email && errors.email &&
              <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.email}</Text>
            }
            <TextInput
              mode="outlined"
              label="Password"
              value={values.password}
              onChangeText={handleChange('password')}
              placeholder="Password"
              onBlur={() => setFieldTouched('password')}
              secureTextEntry={true}
            />
            {touched.password && errors.password &&
              <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.password}</Text>
            }
            <Text style={styles.linkWrapper}>
              Already have account?
              <Text
                style={styles.link}
                onPress={() => navigation.push('Authorization')}>
                &nbsp;Go back&nbsp;
              </Text>
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Button
                onPress={openImage}
                color="#6300ED"
                style={{ flexGrow: 1 }}
              >
                Pick avatar
              </Button>
              <Button
                onPress={() => handleSubmit()}
                color="#6300ED"
                mode="contained"
                style={{ flexGrow: 1 }}
              >
                Sign Up
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}

const mapDispatchToProps = {
  signUp: signUpAction
};

const wrapper = connect(null, mapDispatchToProps)(RegistrationScreen);

export default wrapper;

const styles = StyleSheet.create({
  image: {
    minHeight: 100,
    minWidth: 100,
    maxHeight: 125,
    maxWidth: 125,
    marginBottom: 10,
  },
  container: {
    paddingTop: '30%',
    paddingHorizontal: '10%',
  },
  link: {
    color: 'blue'
  },
  linkWrapper: {
    paddingVertical: 10,
  },
});