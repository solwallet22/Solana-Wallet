import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useConnectionConfig } from '../utils/connection';
import {
  clusterForEndpoint,
  getClusters,
  addCustomCluster,
  customClusterExists,
} from '../utils/clusters';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useWalletSelector } from '../utils/wallet';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import ExitToApp from '@material-ui/icons/ExitToApp';
import AccountIcon from '@material-ui/icons/AccountCircle';
import UsbIcon from '@material-ui/icons/Usb';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import SolanaIcon from './SolanaIcon';
import Tooltip from '@material-ui/core/Tooltip';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import AddAccountDialog from './AddAccountDialog';
import DeleteMnemonicDialog from './DeleteMnemonicDialog';
import AddHardwareWalletDialog from './AddHarwareWalletDialog';
import { ExportMnemonicDialog } from './ExportAccountDialog.js';
import {
  isExtension,
  isExtensionPopup,
  useIsExtensionWidth,
} from '../utils/utils';
import ConnectionIcon from './ConnectionIcon';
import { Badge } from '@material-ui/core';
import { useConnectedWallets } from '../utils/connected-wallets';
import { usePage } from '../utils/page';
import { MonetizationOn, OpenInNew } from '@material-ui/icons';
import AddCustomClusterDialog from './AddCustomClusterDialog';

const useStyles = makeStyles((theme) => ({
  breakpoints: {
    values: {
      xs: 0,
      sm: 450,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  content: {
    flexGrow: 1,
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up(theme.ext)]: {
      paddingTop: theme.spacing(3),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  },
  title: {
    flexGrow: 1,
  },
  button: {
    marginLeft: theme.spacing(1),
  },
  menuItemIcon: {
    minWidth: 32,
  },
  badge: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.text.main,
    height: 16,
    width: 16,
  },
  mainMenuItem: {
    color: '#fff',
  },
  '&:hover, &:focus': {
    mainMenuItem: {
      color: '#14F195',
    }
  },
  logoBtn: {
    marginTop: '10px',
    background: 'none',
    '& img': {
      width: '50px',
      height: '50px',
      [theme.breakpoints.down('sm')]: {
        width: '40px',
        height: '40px',
        margin: '8px 0 0 0px',
      }
    },
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 0,
      marginTop: 0,
      marginBottom: '10px',
    },
    '&:hover, &:focus': {
      background: 'none',
    },
  },
  appTitle: {
    display: 'flex',
    flex: 1,
    fontSize: '22px',
    fontWeight: 700,
    height: '74px',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Diatype',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    [theme.breakpoints.down('sm')]: {
      'display': 'none',
    },
    '& button': {
      fontSize: '22px',
      '&:hover, &:focus': {
        background: 'none',
        color: '#14f195',
      },
    }
  },
  appTitleIcon: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flex: 1,
    },
  },
}));

export default function NavigationFrame({ children }) {
  const classes = useStyles();
  const setPage = usePage()[1];

  return (
    <>
      <Container className="navbar" disableGutters={true}>
        {!isExtension && (
          <div
            style={{
              textAlign: 'center',
              background: '#fafafa',
              color: 'black',
              paddingLeft: '24px',
              paddingRight: '24px',
              fontSize: '14px',
            }}
          >
            <Typography>
              Beware of sites attempting to impersonate sollet.io or other DeFi
              services.
            </Typography>
          </div>
        )}
        <Toolbar>
          <div className={classes.appTitleIcon}>
            <IconButton 
              disableRipple={true}
              className={classes.logoBtn}
              onClick={() => setPage('wallet')}>
              <img src="/icon512.png" alt="Solana Wallet" />
            </IconButton>
          </div>
          <div className={classes.appTitle}>
            <Button 
              disableRipple={true}
              onClick={() => setPage('wallet')}>
              Solana Wallet
            </Button>
          </div>
          <NavigationButtons />
        </Toolbar>
      </Container>
      <Container className={classes.content} disableGutters={true}>
        {children}
      </Container>
    </>
  );
}

function NavigationButtons() {
  const isExtensionWidth = useIsExtensionWidth();
  const [page] = usePage();

  if (isExtensionPopup) {
    return null;
  }

  let elements = [];
  if (page === 'wallet') {
    elements = [
      <ConnectionsButton />,
      <WalletSelector />,
      <NetworkSelector />,
      <CookiesButton />,
    ];
  } else if (page === 'cookies_manager') {
    elements = [
      <ConnectionsButton />,
      <WalletButton />,
    ];
  } else if (page === 'connections') {
    elements = [
      <WalletButton />,
      <CookiesButton />,
    ];
  }

  if (isExtension && isExtensionWidth) {
    elements.push(<ExpandButton />);
  }

  return elements;
}

function ExpandButton() {
  const onClick = () => {
    window.open(chrome.runtime.getURL('index.html'), '_blank');
  };

  return (
    <Tooltip title="Expand View">
      <IconButton color="inherit" onClick={onClick}>
        <OpenInNew />
      </IconButton>
    </Tooltip>
  );
}

function CookiesButton() {
  const classes = useStyles();
  const setPage = usePage()[1];
  const onClick = () => setPage('cookies_manager');

  return (
    <Tooltip title="Cookies Manager">
      <IconButton className={classes.mainMenuItem} color="inherit" onClick={onClick}>
        <FontAwesomeIcon icon="cookie-bite" />
      </IconButton>
    </Tooltip>
  );
}

function WalletButton() {
  const classes = useStyles();
  const setPage = usePage()[1];
  const onClick = () => setPage('wallet');

  return (
    <>
      <Tooltip title="Wallet Balances">
        <IconButton classes={classes.mainMenuItem} color="inherit" onClick={onClick}>
          <MonetizationOn />
        </IconButton>
      </Tooltip>
    </>
  );
}

function ConnectionsButton() {
  const classes = useStyles();
  const setPage = usePage()[1];
  const onClick = () => setPage('connections');
  const connectedWallets = useConnectedWallets();

  const connectionAmount = Object.keys(connectedWallets).length;

  return (
    <>
      <Tooltip title="Manage Connections">
        <IconButton classes={classes.mainMenuItem} color="inherit" onClick={onClick}>
          <Badge
            badgeContent={connectionAmount}
            classes={{ badge: classes.badge }}
          >
            <ConnectionIcon />
          </Badge>
        </IconButton>
      </Tooltip>
    </>
  );
}

function NetworkSelector() {
  const { endpoint, setEndpoint } = useConnectionConfig();
  const cluster = useMemo(() => clusterForEndpoint(endpoint), [endpoint]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [addCustomNetworkOpen, setCustomNetworkOpen] = useState(false);
  const classes = useStyles();

  return (
    <>
      <AddCustomClusterDialog
        open={addCustomNetworkOpen}
        onClose={() => setCustomNetworkOpen(false)}
        onAdd={({ name, apiUrl }) => {
          addCustomCluster(name, apiUrl);
          setCustomNetworkOpen(false);
        }}
      />
      <Tooltip title="Select Network" arrow>
        <IconButton classes={classes.mainMenuItem} color="inherit" onClick={(e) => setAnchorEl(e.target)}>
          <SolanaIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        getContentAnchorEl={null}
      >
        {getClusters().map((cluster) => (
          <MenuItem
            key={cluster.apiUrl}
            onClick={() => {
              setAnchorEl(null);
              setEndpoint(cluster.apiUrl);
            }}
            selected={cluster.apiUrl === endpoint}
          >
            <ListItemIcon className={classes.menuItemIcon}>
              {cluster.apiUrl === endpoint ? (
                <CheckIcon fontSize="small" />
              ) : null}
            </ListItemIcon>
            {cluster.name === 'mainnet-beta-backup'
              ? 'Mainnet Beta Backup'
              : cluster.apiUrl}
          </MenuItem>
        ))}
        <MenuItem
          onClick={() => {
            setCustomNetworkOpen(true);
          }}
        >
          <ListItemIcon className={classes.menuItemIcon}></ListItemIcon>
          {customClusterExists()
            ? 'Edit Custom Endpoint'
            : 'Add Custom Endpoint'}
        </MenuItem>
      </Menu>
    </>
  );
}

function WalletSelector() {
  const {
    accounts,
    derivedAccounts,
    hardwareWalletAccount,
    setHardwareWalletAccount,
    setWalletSelector,
    addAccount,
  } = useWalletSelector();
  const [anchorEl, setAnchorEl] = useState(null);
  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [
    addHardwareWalletDialogOpen,
    setAddHardwareWalletDialogOpen,
  ] = useState(false);
  const [deleteMnemonicOpen, setDeleteMnemonicOpen] = useState(false);
  const [exportMnemonicOpen, setExportMnemonicOpen] = useState(false);
  const classes = useStyles();

  if (accounts.length === 0) {
    return null;
  }
  return (
    <>
      <AddHardwareWalletDialog
        open={addHardwareWalletDialogOpen}
        onClose={() => setAddHardwareWalletDialogOpen(false)}
        onAdd={({ publicKey, derivationPath, account, change }) => {
          setHardwareWalletAccount({
            name: 'Hardware wallet',
            publicKey,
            importedAccount: publicKey.toString(),
            ledger: true,
            derivationPath,
            account,
            change,
          });
          setWalletSelector({
            walletIndex: undefined,
            importedPubkey: publicKey.toString(),
            ledger: true,
            derivationPath,
            account,
            change,
          });
        }}
      />
      <AddAccountDialog
        open={addAccountOpen}
        onClose={() => setAddAccountOpen(false)}
        onAdd={({ name, importedAccount }) => {
          addAccount({ name, importedAccount });
          setWalletSelector({
            walletIndex: importedAccount ? undefined : derivedAccounts.length,
            importedPubkey: importedAccount
              ? importedAccount.publicKey.toString()
              : undefined,
            ledger: false,
          });
          setAddAccountOpen(false);
        }}
      />
      <ExportMnemonicDialog
        open={exportMnemonicOpen}
        onClose={() => setExportMnemonicOpen(false)}
      />
      <DeleteMnemonicDialog
        open={deleteMnemonicOpen}
        onClose={() => setDeleteMnemonicOpen(false)}
      />
      <Tooltip title="Select Account" arrow>
        <IconButton color="inherit" onClick={(e) => setAnchorEl(e.target)}>
          <AccountIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        getContentAnchorEl={null}
      >
        {accounts.map((account) => (
          <AccountListItem
            account={account}
            classes={classes}
            setAnchorEl={setAnchorEl}
            setWalletSelector={setWalletSelector}
          />
        ))}
        {hardwareWalletAccount && (
          <>
            <Divider />
            <AccountListItem
              account={hardwareWalletAccount}
              classes={classes}
              setAnchorEl={setAnchorEl}
              setWalletSelector={setWalletSelector}
            />
          </>
        )}
        <Divider />
        <MenuItem onClick={() => setAddHardwareWalletDialogOpen(true)}>
          <ListItemIcon className={classes.menuItemIcon}>
            <UsbIcon fontSize="small" />
          </ListItemIcon>
          Import Hardware Wallet
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setAddAccountOpen(true);
          }}
        >
          <ListItemIcon className={classes.menuItemIcon}>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          Add Account
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setExportMnemonicOpen(true);
          }}
        >
          <ListItemIcon className={classes.menuItemIcon}>
            <ImportExportIcon fontSize="small" />
          </ListItemIcon>
          Export Mnemonic
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setDeleteMnemonicOpen(true);
          }}
        >
          <ListItemIcon className={classes.menuItemIcon}>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          {'Delete Mnemonic & Log Out'}
        </MenuItem>
      </Menu>
    </>
  );
}

function AccountListItem({ account, classes, setAnchorEl, setWalletSelector }) {
  return (
    <MenuItem
      key={account.address.toBase58()}
      onClick={() => {
        setAnchorEl(null);
        setWalletSelector(account.selector);
      }}
      selected={account.isSelected}
      component="div"
    >
      <ListItemIcon className={classes.menuItemIcon}>
        {account.isSelected ? <CheckIcon fontSize="small" /> : null}
      </ListItemIcon>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Typography>{account.name}</Typography>
        <Typography color="textSecondary">
          {account.address.toBase58()}
        </Typography>
      </div>
    </MenuItem>
  );
}
