import { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import Router from 'next/router';
import { useAuth } from '../lib/authentication';

const CHANGE_PASSWORD = gql`
  mutation ChangePasswordWithToken($token: String!, $password: String!) {
    changePasswordWithToken(token: $token, password: $password) {
      id
    }
  }
`;

const GET_PASSWORD_TOKEN = gql`
  query allForgottenPasswordTokens($token: String!, $accessedAt: DateTime) {
    passwordTokens: allForgottenPasswordTokens(
      where: { token: $token, expiresAt_gte: $accessedAt }
    ) {
      id
    }
  }
`;

const ChangePassword = ({ token, accessedAt }) => {
  return <ChangePasswordForm token={token} accessedAt={accessedAt} />;
};

ChangePassword.getInitialProps = async context => {
  const token = context.query.key;
  const accessedAt = new Date().toISOString();
  return { token, accessedAt };
};

export default ChangePassword;

const ChangePasswordForm = ({ token, accessedAt }) => {
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [errorState, setErrorState] = useState('');
  const { isAuthenticated } = useAuth();

  const minPasswordLength = 8;

  const handleSubmit = changePasswordWithToken => async event => {
    event.preventDefault();
    if (password !== confirmedPassword) {
      setErrorState('Passwords do not match');
    } else if (password.length < minPasswordLength) {
      setErrorState('Passwords must be longer than 8 characters');
    } else {
      setErrorState('');
      const res = await changePasswordWithToken({ variables: { token, password } });
      console.log(res)
      Router.push({ pathname: '/profile_old', query: { id: res.data.changePasswordWithToken.id } })
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      Router.push('/');
    }
  }, [isAuthenticated]);

  const { data, loading, error } = useQuery(GET_PASSWORD_TOKEN, {
    variables: { token, accessedAt },
  });

  const [startPasswordRecovery, { error: mutationError }] = useMutation(CHANGE_PASSWORD, {
    onCompleted: () => {
      // Router.push('/');
    },
  });

  return (
    <>
      {/* <Meta title="Change password" /> */}
      {/* <Navbar background="white" foreground={colors.greyDark} /> */}
      {loading && !data ? <span>Loading...</span> : error || !data.passwordTokens || !data.passwordTokens.length ? <span>Invalid or expired token</span> : (
        <div>
          <h1>Change password</h1>
          {mutationError && <p>Failed to change password</p>}

          <form
            noValidate
            onSubmit={handleSubmit(startPasswordRecovery)}
          >
              <label htmlFor="password">Password</label>
              <input
                required
                type="password"
                id="password"
                minLength={minPasswordLength}
                autoFocus
                autoComplete="password"
                placeholder="supersecret"
                disabled={isAuthenticated}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <label>Confirm password</label>
              <input
                required
                type="password"
                id="confirmedPassword"
                minLength={minPasswordLength}
                autoComplete="password"
                placeholder="supersecret"
                disabled={isAuthenticated}
                value={confirmedPassword}
                onChange={e => setConfirmedPassword(e.target.value)}
              />
            {errorState ? <p>{errorState}</p> : null}
            <button type="submit">Change password</button>
          </form>
        </div>
      )}
    </>
  );
};
