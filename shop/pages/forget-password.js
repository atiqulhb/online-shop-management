
// import { jsx } from '@emotion/core';
// 
// import { Container, H1 } from '../primitives';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import Meta from '../components/Meta';
// import { gridSize } from '../theme';

import ForgotPassword from '../components/ForgotPassword';

export default function ForgotPasswordPage() {
  return (
    <>
      {/* <Meta title="Forgot password" /> */}
      {/* <Navbar background="white" /> */}
      {/* <div width={420} css={{ marginTop: gridSize * 3 }}> */}
      <div>
        {/* <H1>Forgot password</H1> */}
        <h1>Forgot password</h1>
        <ForgotPassword />
      </div>
      {/* <Footer callToAction={false} /> */}
    </>
  );
};
