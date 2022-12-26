import { createNavigationContainerRef } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef()

export function navigate(name: never, params: never) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function push(arg1: string, arg2: any) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(arg1, arg2));
  }
}