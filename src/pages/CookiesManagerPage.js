import React from 'react';
import Container from '@material-ui/core/Container';
import { AppBar, makeStyles, Paper, Toolbar, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { useIsExtensionWidth } from '../utils/utils';
import CookiesManagerList from '../components/CookiesManagerList';

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down(theme.ext)]: {
      padding: 0,
    },
    [theme.breakpoints.up(theme.ext)]: {
      maxWidth: 'md',
    },
  },
  balancesContainer: {
    [theme.breakpoints.down(theme.ext)]: {
      marginBottom: 24,
    },
  },
}));

export default function CookiesManagerPage() {
  const classes = useStyles();
  const isExtensionWidth = useIsExtensionWidth();
  return (
    <Container fixed maxWidth="md" className={classes.container}>
      <Grid container spacing={isExtensionWidth ? 0 : 3}>
        <Grid item xs={12}>
          <Paper>
            <AppBar position="static" color="default" elevation={1}>
              <Toolbar>
                <Typography
                  variant="h6"
                  style={{ flexGrow: 1, fontSize: isExtensionWidth && '1rem' }}
                  component="h2"
                >
                  Cookies Manager
                </Typography>
              </Toolbar>
            </AppBar>
            <CookiesManagerList/>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
