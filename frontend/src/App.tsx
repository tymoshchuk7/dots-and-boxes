import {
  Switch, Route, Link,
} from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './App.css';
import { connect, useDispatch } from 'react-redux';
import {
  Container, Navbar, Nav,
  DropdownButton, Dropdown, Button,
} from 'react-bootstrap';
import Auth from './views/authPage';
import Registraion from './views/registrationPage';
import Main from './views/mainPage';
import Room from './views/roomPage';
import CreateRoom from './views/createRoomPage';
import ChangData from './views/changeDataPage';
import NoMatch from './views/errorPage';
import PrivateRoute from './components/privateRoute';
import PublicRoute from './components/publicRoute';
import MsgModal from './components/modal';
import MoveToast from './components/toast';
import NotiificationsContainer from './components/toastContainer';
import { verifyAction, logOutAction } from './actions/userActions';
import { useSocket } from './contexts/socketConnection';
import { NotificationsIndicator } from './types/WidgetTypes';
import config from './config';

interface AppProps {
  verifyUser: {
    id: string;
    auth: boolean;
    username: string;
    avatar: string;
  };
  verify: () => void;
  logOut: () => void;
  changeAvatar: {
    avatar: string;
  };
  indicator: boolean;
}

function App({
  verifyUser, verify, logOut, changeAvatar, indicator,
}: AppProps) {
  const { auth, username } = verifyUser;
  const { avatar } = changeAvatar;
  const [showToast, setShowToast] = useState(false);
  const { connectToSockets } = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    verify();
  }, []);

  useEffect(() => {
    if (auth) connectToSockets();
  }, [auth]);

  const btnHandler = () => {
    logOut();
  };

  const toastHandler = () => {
    setShowToast(false);
  };

  return (
    <>
      <MsgModal />
      <Navbar
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/header.jpg)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          minHeight: '80px',
        }}
        bg="dark"
        variant="dark"
      >
        <Container>
          {auth && (
            <>
              <Nav className="mr-auto d-flex align-items-center text-dark">
                <Nav.Link><Link to="/" style={{ color: '#000' }}>Home</Link></Nav.Link>
                <Nav.Link><Link to="/create" style={{ color: '#000' }}>Create room</Link></Nav.Link>
                <Nav.Link><Link to="/change" style={{ color: '#000' }}>Settings</Link></Nav.Link>
              </Nav>
              <div className={`position-relative ${indicator ? ('indicator') : ('')}`}>
                <Button
                  variant="outline-dark"
                  onClick={() => {
                    setShowToast(!showToast);
                    dispatch({ type: NotificationsIndicator.CLOSE_NOTIFICATOR });
                  }}
                  style={{ marginRight: 15, color: '#000' }}
                >
                  Show my moves
                </Button>
                <MoveToast
                  showToast={showToast}
                  closeToast={toastHandler}
                />
              </div>
              <DropdownButton id="dropdown-basic-button" variant="outline-dark" title={username}>
                <Dropdown.Item onClick={btnHandler}>Log out</Dropdown.Item>
              </DropdownButton>
              <img
                style={{ maxWidth: '50px', marginLeft: '5px', border: '2px solid black' }}
                src={config.IO_API + avatar}
                alt="userPhoto"
              />
            </>
          )}
        </Container>
      </Navbar>
      <div className="App">
        <div>
          <Switch>
            <PublicRoute component={Registraion} path="/registration" />
            <PublicRoute component={Auth} path="/login" />
            <PrivateRoute component={Main} path="/" exact />
            <PrivateRoute component={CreateRoom} path="/create" />
            <PrivateRoute component={ChangData} path="/change" />
            <PrivateRoute component={Room} path="/room/:id" />
            <Route path="*">
              <NoMatch />
            </Route>
          </Switch>
        </div>
        <NotiificationsContainer />
      </div>
    </>
  );
}

const mapStateToProps = (state: any) => ({
  verifyUser: state.verifyUser,
  changeAvatar: state.changeAvatar,
  indicator: state.NotificationsIndicator,
});

const mapDispatchToProps = {
  verify: verifyAction,
  logOut: logOutAction,
};

const wrapper = connect(mapStateToProps, mapDispatchToProps)(App);

export default wrapper;
