import React, {useEffect} from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { logInAction, verifyAction } from '../actions/userActions';

interface AuthorizationScreenProps {
  navigation: any;
  logIn: (arg: object, success: () => void) => void;
  logInUser: {
    loading: boolean;
  },
  verify: () => void;
};

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(4, 'Too Short!')
    .max(25, 'Too Long!')
    .required('Required'),
});

const AuthorizationScreen: React.FC<AuthorizationScreenProps> = ({
  navigation, logIn, logInUser, verify,
 }) => {
  const { loading } = logInUser;
  useEffect(() => {
    verify();
  }, [loading])

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        onSubmit={values => {
          logIn(values, () => {});
        }}
        validationSchema={LoginSchema}
      >
        {({ values, handleChange, errors, setFieldTouched, touched, handleSubmit }) => (
          <View>
            <TextInput
              mode='outlined'
              label="E-mail"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={() => setFieldTouched('email')}
            />
            {touched.email && errors.email &&
              <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.email}</Text>
            }
            <TextInput
              mode='outlined'
              label="Password"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={() => setFieldTouched('password')}
              secureTextEntry={true}
            />
            {touched.password && errors.password &&
              <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.password}</Text>
            }
            <Text style={styles.linkWrapper}>
              Have not account?
              <Text
                style={styles.link}
                onPress={() => navigation.push('Registration')}>
                &nbsp;Sign up&nbsp;
              </Text>
              now!
            </Text>
            <Button
              color="#6300ED"
              title='Submit'
              onPress={handleSubmit as any}
            />
          </View>
        )}
      </Formik>
    </View>
  )
}

const mapStateToProps = (state: any) => ({
  logInUser: state.logInUser,
});

const mapDispatchToProps = {
  logIn: logInAction,
  verify: verifyAction
};

const wrapper = connect(mapStateToProps, mapDispatchToProps)(AuthorizationScreen);

export default wrapper;

const styles = StyleSheet.create({
  container: {
    paddingTop: '50%',
    paddingHorizontal: '10%',
  },
  link: {
    color: 'blue'
  },
  linkWrapper: {
    paddingVertical: 10,
  },
});