// // pages/_app.js
// import '@/styles/globals.css';
// import { Provider } from 'react-redux';
// import store from '@/store/store'; // adjust if your path is different

// export default function App({ Component, pageProps }) {
//   return (
//     <Provider store={store}>
//       <Component {...pageProps} />
//     </Provider>
//   );
// }
import '@/styles/globals.css';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import store from '@/store/store';

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(186, 139, 2)',
    },
    secondary: {
      main: 'rgb(24, 24, 24)',
    },
  },
});

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}
