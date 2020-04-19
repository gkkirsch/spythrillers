import {createContext, useContext} from 'react';
import Firebase from './firebase';

export const FirebaseContext = createContext();

export const useFirebase = (base) => {
  const firebase = useContext(FirebaseContext);
  if (base) firebase.setBasePath(base);
  return firebase;
}

