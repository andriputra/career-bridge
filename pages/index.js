import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, gql, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://207.148.68.106:2301/query',
  cache: new InMemoryCache()
});

const performLogin = async ({ email, password }) => {
  try {
    const LOGIN_MUTATION = gql`
      mutation {
        login(email: "${email}", password: "${password}") {
          token
          refreshToken
          name
          email
          permissions { id }
        }
      }
    `;
    const { data } = await client.mutate({ mutation: LOGIN_MUTATION });
    return data.login;
  } catch (error) {
    throw new Error('Login gagal');
  }
};

const Home = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        throw new Error("Email dan password diperlukan.");
      }

      const { token, refreshToken } = await performLogin({ email, password });

      setIsLoggedIn(true);
      setLoginMessage('Login berhasil!');
      console.log('Token:', token);
      console.log('Refresh Token:', refreshToken);
    } catch (error) {
      setIsLoggedIn(false);
      setErrorMessage('Login Gagal: ' + error.message);
      console.error('Login Gagal:', error.message);
    }
  };

  const handleBackToLogin = () => {
    setIsLoggedIn(false);
    setLoginMessage('');
    setErrorMessage('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="container">
      <h1>Login</h1>
      {isLoggedIn ? (
        <>
          <p>{loginMessage}</p>
          <button className="button" onClick={handleBackToLogin}>Back to Login</button>
        </>
      ) : (
        <>
          <div className="input-group">
            <label>Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="button" onClick={handleLogin}>Login</button>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </>
      )}
    </div>
  );
};

const App = () => (
  <ApolloProvider client={client}>
    <Home />
  </ApolloProvider>
);

export default App;
