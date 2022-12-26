import React, { useState } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { logOutAction } from '../actions/userActions';

const Header = ({ navigation, previous, isAuthorized }: any) => {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const dispatch = useDispatch();

  return (
    <Appbar.Header>
      { previous ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content
        title="Sticks"
        onPress={() => navigation.push('Main')}
      />
      { isAuthorized && !previous ? (
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action icon="menu" color="white" onPress={openMenu} />
          }>
          <Menu.Item onPress={() => navigation.push('CreateRoom')} title="Create room" />
          <Menu.Item onPress={() => navigation.push('ChangeData')} title="Settings" />
          <Menu.Item onPress={() => dispatch(logOutAction())} title="Log out" />
        </Menu>
      ) : null}
    </Appbar.Header>
  );
}

export default Header; 