import Link from 'next/link'
import { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';
// import { jsx } from '@emotion/core';

import { useAuth } from '../lib/authentication';
// import { Button, Field, Group, Label, Link, Input } from '../../primitives/forms';
// import { gridSize, colors } from '../../theme';

export const CREATE_FORGOT_PASSWORD_TOKEN = gql`
  mutation startPasswordRecovery($email: String!) {
    startPasswordRecovery(email: $email) {
      id
    }
  }
`;

const ForgotPassword = ({ onSuccess, onClickSignin }) => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const { isAuthenticated } = useAuth();

  // const handleSubmit = async startPasswordRecovery => event => {
  //   event.preventDefault();
  //   startPasswordRecovery({ variables: { email } });
  // };

  // if the user is logged in, redirect to the homepage
  useEffect(() => {
    if (isAuthenticated) {
      Router.push('/');
    }
  }, [isAuthenticated]);

  const [startPasswordRecovery, { error: mutationError, loading }] = useMutation(
    CREATE_FORGOT_PASSWORD_TOKEN,
    {
      onCompleted: () => {
        setEmailSent(true);

        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess();
        }
      },
    }
  );

  return (
    <>
      {mutationError && (
        <p>There is no account with the email "{email}"</p>
      )}

      <form
        // css={{ marginTop: gridSize * 3 }}
        noValidate
        onSubmit={async e => {
          e.preventDefault()
          const res = await startPasswordRecovery({ variables: { email } })
          console.log(res)
        }}
      >
          <label htmlFor="email">Email</label>
          <input
            required
            type="text"
            autoFocus
            autoComplete="email"
            placeholder="you@awesome.com"
            disabled={isAuthenticated}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

        <div>
          {loading ? (
            <button disabled>Sending email...</button>
          ) : emailSent ? (
            <button disabled>
              Email sent
            </button>
          ) : (
            <button type="submit">Send</button>
          )}
          <Link href="/signin" onClick={onClickSignin}>
            Sign in
          </Link>
        </div>
      </form>
    </>
  );
};

export default ForgotPassword
