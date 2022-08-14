import React, { Suspense, useState } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCookieBite } from '@fortawesome/free-solid-svg-icons';
import { Container } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  ThemeProvider,
  unstable_createMuiStrictModeTheme as createMuiTheme,
} from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import NavigationFrame from './components/NavigationFrame';
import { ConnectionProvider } from './utils/connection';
import WalletPage from './pages/WalletPage';
import CookiesManagerPage from './pages/CookiesManagerPage';
import { useWallet, WalletProvider, DecoratorProvider } from './utils/wallet';
import { ConnectedWalletsProvider } from './utils/connected-wallets';
import { TokenRegistryProvider } from './utils/tokens/names';
import LoadingIndicator from './components/LoadingIndicator';
import { SnackbarProvider } from 'notistack';
import PopupPage from './pages/PopupPage';
import LoginPage from './pages/LoginPage';
import ConnectionsPage from './pages/ConnectionsPage';
import { isExtension } from './utils/utils';
import { PageProvider, usePage } from './utils/page';

library.add(faCookieBite);

export default function App() {
  const prefersDarkMode = true;
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
          primary: blue,
        },
        ext: '450',
      }),
    [prefersDarkMode],
  );

  // Disallow rendering inside an iframe to prevent clickjacking.
  if (window.self !== window.top) {
    return null;
  }

  let appElement = (
    <NavigationFrame>
      <Suspense fallback={<LoadingIndicator />}>
        <PageContents />
      </Suspense>
    </NavigationFrame>
  );

  if (isExtension) {
    appElement = (
      <ConnectedWalletsProvider>
        <PageProvider>{appElement}</PageProvider>
      </ConnectedWalletsProvider>
    );
  }

  return (
    <Container disableGutters={true} maxWidth="md">
      <Suspense fallback={<LoadingIndicator />}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ConnectionProvider>
            <DecoratorProvider>
              <TokenRegistryProvider>
                <SnackbarProvider maxSnack={5} autoHideDuration={8000}>
                  <WalletProvider>{appElement}</WalletProvider>
                </SnackbarProvider>
              </TokenRegistryProvider>
            </DecoratorProvider>
          </ConnectionProvider>
        </ThemeProvider>
      </Suspense>
    </Container>
  );
}

function PageContents() {
  const wallet = useWallet();
  const [page] = usePage();
  if (page === 'cookies_manager')
    return <CookiesManagerPage />;
  if (!wallet) {
    return (
      <>
        <LoginPage />
      </>
    );
  }
  if (window.opener) {
    return <PopupPage opener={window.opener} />;
  }
  if (page === 'connections') {
    return <ConnectionsPage />;
  } else {
    return <WalletPage />;
  }
}
