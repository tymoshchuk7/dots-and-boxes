import React, { useState } from 'react';
import {
  View, StyleSheet, Text,
  Image, Button
} from 'react-native';
import { TextInput, Button as ButtonCustom } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { changePasswordAction, changeAvatarAction } from '../actions/userActions';

interface changeDataScreenProps {
  changePassword: (payload: object, callback: () => void) => void;
  changeAvatar: (payload: object, callback: () => void) => void;
  navigation: any
};

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

const changeDataScreen: React.FC<changeDataScreenProps> = ({ changePassword, changeAvatar, navigation }) => {

  const [isDifferent, setIsDifferent] = useState(false);
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

  const changeAvatarBtn = () => {
    const formData = new FormData();
    if (image?.match(/.jpg/) || image?.match(/.png/)) {
      formData.append('image', {
        uri: image,
        name: 'photo.png',
        filename :'imageName.png',
        type: 'image/png'
      }, 'some.jpg');
    }
    changeAvatar(formData, () => {
      navigation.push('Main');
    });
  }

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{
          oldPassword: '',
          newPassword: '',
          repeatNewPassword: '',
        }}
        onSubmit={values => {
          if (values.newPassword === values.repeatNewPassword) {
            changePassword(values, () => {
              navigation.push('Main');
            });
          } else {
            setIsDifferent(true);
          }
        }}
        validationSchema={ChangeDataSchema}
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
            <View style={{flexDirection: 'row'}}>
              <ButtonCustom
                onPress={openImage}
                color="#6300ED"
                style={{flexGrow: 1}}
              >
                Pick avatar
              </ButtonCustom>
              <ButtonCustom
                onPress={changeAvatarBtn}
                color="#6300ED"
                mode="contained"
                style={{flexGrow: 1}}
              >
                Change avatar
              </ButtonCustom>
            </View>
            <TextInput
              label="Enter old password"
              mode="outlined"
              value={values.oldPassword}
              onChangeText={handleChange('oldPassword')}
              onBlur={() => setFieldTouched('oldPassword')}
              secureTextEntry={true}
            />
            {touched.oldPassword && errors.oldPassword &&
              <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.oldPassword}</Text>
            }
            <TextInput
              label="Enter new password"
              mode="outlined"
              value={values.newPassword}
              onChangeText={handleChange('newPassword')}
              onBlur={() => setFieldTouched('newPassword')}
              secureTextEntry={true}
            />
            {touched.newPassword && errors.newPassword &&
              <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.newPassword}</Text>
            }
            <TextInput
              label="Repeat new password"
              mode='outlined'
              value={values.repeatNewPassword}
              onChangeText={handleChange('repeatNewPassword')}
              onBlur={() => setFieldTouched('repeatNewPassword')}
              secureTextEntry={true}
            />
            {isDifferent &&
              <Text style={{ fontSize: 12, color: '#FF0D10' }}>Passwords mismatches</Text>
            }
            <View style={styles.buttonWrapper}>
              <Button
                color="#6300ED"
                title='Change password'
                onPress={handleSubmit as any}
              />
            </View>
          </View>
        )}
      </Formik>
    </View>
  )
}

const mapDispatchToProps = {
  changePassword: changePasswordAction,
  changeAvatar: changeAvatarAction,
};

const wrapper = connect(null, mapDispatchToProps)(changeDataScreen);

export default wrapper;

const styles = StyleSheet.create({
  container: {
    paddingTop: '30%',
    paddingHorizontal: '10%',
  },
  image: {
    minHeight: 100,
    minWidth: 100,
    maxHeight: 125,
    maxWidth: 125,
    marginBottom: 10,
  },
  buttonWrapper: {
    marginTop: 10,
  },
});