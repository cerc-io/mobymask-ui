import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import MetaMaskOnboarding from "@metamask/onboarding";
import chainList from "../utils/chainList";
import Button from "../components/Button";

import { useAtom } from "jotai";
import { providerAtom } from "../atoms/providerAtom";
import { Typography } from "@mui/material";
import useSnap from "../hooks/useSnap";
import { connectSnap, getSnap, shouldDisplayReconnectButton } from "../utils/snap";
import { ConnectButton, InstallFlaskButton, ReconnectButton } from "../components/SnapButtons";

export default function LazyConnect(props) {
  const { actionName, chainId } = props;
  let { opts = {} } = props;
  const { needsAccountConnected = true, needsSnapConnected = false } = opts;
  const [provider, setInjectedProvider] = useAtom(providerAtom);
  const [accounts, setAccounts] = useState([]);
  const [userChainId, setUserChainId] = useState(false);
  const [, setLoading] = useState(false);
  const [snapState, setSnapState] = useSnap(provider);

  if (!provider && MetaMaskOnboarding.isMetaMaskInstalled()) {
    setInjectedProvider(window.ethereum);
  }

  const chainName = chainId ? chainList[Number(chainId)] : null;
  // Get accounts;
  useEffect(() => {
    if (!provider) {
      return;
    }
    getAccounts().then(setAccounts).catch(console.error);

    async function getAccounts() {
      try {
        const _accounts = await provider.request({ method: "eth_accounts" });
        if (_accounts.length > 0) {
          setAccounts(_accounts);
        }
      } catch (err) {
        console.log("Getting accounts failed!", err);
      }
    }

    provider.on("accountsChanged", setAccounts);

    return () => {
      provider.removeListener("accountsChanged", setAccounts);
    };
  }, [provider]);

  // Get current selected network:
  useEffect(() => {
    if (!provider) {
      return;
    }
    getUserChainId().then(setUserChainId).catch(console.error);

    async function getUserChainId() {
      const chainId = await provider.request({ method: "eth_chainId" });
      return Number(chainId);
    }

    provider.on("chainChanged", setUserChainId);

    return () => {
      provider.removeListener("chainChanged", setUserChainId);
    };
  }, [provider]);

  const needsToSwitchChain = Number(userChainId) !== chainId;
  const needsToConnectAccount =
    needsAccountConnected && (!accounts || accounts.length === 0);
  console.log()
  const needsToConnectSnap = needsSnapConnected && !snapState.installedSnap;
  const requiresAction = needsToSwitchChain || needsToConnectAccount || needsToConnectSnap;

  if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
    return (
      <Box textAlign="center">
        <Button
          marginTop="30px"
          color="#fff"
          borderRadius="100px"
          padding="12px 20px"
          style={{
            background: "linear-gradient(90deg, #334FB8 0%, #1D81BE 100%)",
          }}
          label="Get MetaMask"
          onClick={() => {
            const onboarding = new MetaMaskOnboarding();
            onboarding.startOnboarding();
          }}
        />
      </Box>
    );
  }

  if (requiresAction) {
    return (
      <Box>
        {createChecklist({
          setLoading,
          provider,
          needsToConnectAccount,
          hasWallet: MetaMaskOnboarding.isMetaMaskInstalled(),
          chainId: chainId,
          userChainId,
          setUserChainId,
          chainName,
          setAccounts,
          needsAccountConnected,
          actionName,
          accounts,
          snapState,
          setSnapState,
          needsToConnectSnap
        })}
      </Box>
    );
  }

  const { children } = props;

  const childrenWithProps = React.Children.map(children, (child) => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { provider });
    }
    return child;
  });
  return <Box textAlign="center">{childrenWithProps}</Box>;
}

function createChecklist(checklistOpts) {
  const {
    chainId,
    userChainId,
    chainName,
    setAccounts,
    provider,
    loading,
    setLoading,
    needsToConnectAccount,
    actionName,
    hasWallet,
    snapState,
    setSnapState,
    needsToConnectSnap
  } = checklistOpts;

  const needsToSwitchChain = !!chainId && Number(userChainId) !== chainId;

  if (!hasWallet) {
    return null;
  }

  const connectWalletFn = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (needsToConnectAccount) {
        await connectAccountFn();
      }

      if (needsToSwitchChain) {
        await connectChainFn();
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const connectAccountFn = async () => {
    const _accounts = await provider.request({
      method: "eth_requestAccounts",
    });
    setAccounts(_accounts);
  };

  const connectChainFn = async () => {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x" + chainId.toString(16) }],
    });
  };

  const btnTextFn = () => {
    let labelText = "Connect Wallet";
    if (needsToConnectAccount) {
      labelText = "Connect Wallet";
    }
    if (!needsToConnectAccount && needsToSwitchChain) {
      labelText = `Switch to the ${chainName} network`;
    }
    return labelText;
  };

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      setSnapState(state => ({ ...state, installedSnap }));
    } catch (e) {
      console.error(e);
      setSnapState(state => ({ ...state, error: e }));
    }
  };

  return (
    <Box marginTop="30px">
      <Typography
        variant="body2"
        width="96%"
        maxWidth="670px"
        margin="auto"
        color="#666F85"
      >
        You need a few things to {actionName}.
      </Typography>
      <Box textAlign="center">
        {needsToConnectAccount && (
          <Button
            marginTop="20px"
            color="#fff"
            borderRadius="100px"
            padding="12px 20px"
            style={{
              background: "linear-gradient(90deg, #334FB8 0%, #1D81BE 100%)",
            }}
            label={loading ? "Connecting" : btnTextFn()}
            onClick={connectWalletFn}
          ></Button>
        )}
        &nbsp;
        {needsToConnectSnap && (
          <>
            {!snapState.isFlask && (
              <InstallFlaskButton />
            )}
            {!snapState.installedSnap && (
              <ConnectButton
                onClick={handleConnectClick}
                disabled={!snapState.isFlask}
              />
            )}
            {shouldDisplayReconnectButton(snapState.installedSnap) && (
              <ReconnectButton
                onClick={handleConnectClick}
                disabled={!snapState.installedSnap}
              />
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
