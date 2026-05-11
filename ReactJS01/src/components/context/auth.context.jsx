import { createContext, useState } from 'react';

export const AuthContext = createContext({
  auth: {
    isAuthenticated: false,
    user: { email: '', name: '' },
  },
  setAuth: () => {},
  appLoading: true,
  setAppLoading: () => {},
});

export const AuthWrapper = (props) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: { email: '', name: '' },
  });
  const [appLoading, setAppLoading] = useState(true);

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, appLoading, setAppLoading }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
