import { createGlobalStyle } from 'styled-components';
 
const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    /*overflow: hidden;*/
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    margin: 0;
  }

  a { text-decoration: none }
`;
 
export default GlobalStyle;