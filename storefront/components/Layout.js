import React, { Component, memo } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
// import Header from './Header';
// import Meta from './Meta';
import Inner from './Inner'

const theme = {};

const StyledPage = styled.div`
`

const GlobalStyles = createGlobalStyle`
  html {
    overflow: hidden;
    box-sizing: border-box;
  }

  *, *::before, *::after {
    box-sizing: inherit;
  }

  body {
    margin: 0;
  }

  a { text-decoration: none }
`;

export default function Layout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <StyledPage>
        {/* <Meta /> */}
        {/* <Header /> */}
        <Inner>{children}</Inner>
      </StyledPage>
    </ThemeProvider>
  );
}