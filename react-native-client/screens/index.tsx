import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { connect } from 'react-redux';
import AuthorizationScreen from './authrizationScreen';
import RegistrationScreen from './registrationScreen';
import MainScreen from './mainScreen';
import CreateRoomScreen from './createRoomScreen';
import ChangeDataScreen from './changeDataScreen';
import RoomScreen from './roomScreen';
import Header from '../components/header';
import MessageModal from '../components/modal';
import NotificationSnackbar from '../components/snackbar';
import { verifyAction } from '../actions/userActions';
import { useSocket } from '../contexts/socketConnection';
import { navigationRef } from '../navigation/rootNavigation';

interface AppNavigationProps {
  logInUser: {
    auth: boolean
  };
  verifyUser: {
    auth: boolean
  }
  verify: () => void;
};
const Stack = createNativeStackNavigator();

const AppNavigation: React.FC<AppNavigationProps> = ({
  verify, verifyUser
}) => {
  const { connectToSockets, socket } = useSocket();
  const { auth } = verifyUser;

  useEffect(() => {
    verify();
  }, []);

  useEffect(() => {
    if (auth) {
      connectToSockets();
    } else {
      // socket?.disconnect();
    }
  }, [auth]);

  return (
    <NavigationContainer ref={navigationRef}>
      <MessageModal />
      <NotificationSnackbar />
      <Stack.Navigator
        initialRouteName="Authorization"
        screenOptions={{
          header: (props) => <Header {...props} isAuthorized={auth} />,
        }}>
        {auth ? (
          <>
            <Stack.Screen
              name="Main"
              component={MainScreen}
            />
            <Stack.Screen
              name="Room"
              component={RoomScreen}
            />
            <Stack.Screen
              name="CreateRoom"
              component={CreateRoomScreen}
            />
            <Stack.Screen
              name="ChangeData"
              component={ChangeDataScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Authorization"
              component={AuthorizationScreen}
            />
            <Stack.Screen
              name="Registration"
              component={RegistrationScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
};

const mapStateToProps = (state: any) => ({
  logInUser: state.logInUser,
  verifyUser: state.verifyUser,
});

const mapDispatchToProps = {
  verify: verifyAction,
};

const wrapper = connect(mapStateToProps, mapDispatchToProps)(AppNavigation);

export default wrapper;
