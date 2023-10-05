import { useEffect, useState } from 'react';
import './App.css';
import motokoLogo from './assets/motoko_moving.png';
import motokoShadowLogo from './assets/motoko_shadow.png';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import { backend } from './declarations/backend';
import { BrowserRouter } from "react-router-dom";
//import { configureChains, createClient, WagmiConfig } from "wagmi";
//import { Chain } from 'wagmi';
//import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import Routes from "./Routes";
//import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';

function App() {
    const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");

    /*const bitfinityTestnet : Chain = {
        id: 355113,
        name: 'Bitfinity Testnet',
        network: 'bitfinity-testnet',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: {
          default: { http: ["https://testnet.bitfinity.network"] },
          public: { http: ["https://testnet.bitfinity.network"] },
        },
        testnet: true
    };

    const { chains, provider, webSocketProvider } = configureChains(
        [bitfinityTestnet],
        [
            jsonRpcProvider({
                rpc: () => ({
                  http: "https://testnet.bitfinity.network",
                }),
            }),
        ]
    );

    const { connectors } = getDefaultWallets({
        appName: "NexaChallenge",
        projectId: "478a908eef5477c475e4d1ad12e7356d",
        chains
    });
    

    const wagmiClient = createClient({
        autoConnect: true,
        connectors,
        provider,
        webSocketProvider,
    });

    const appInfo = {
        appName: "NexaChallenge",
    };
    
*/
  return (
        <div style={{position: "absolute", width: "100%", left: 0, top: 0}}>
            <BrowserRouter>
                <Routes pages={pages} />
            </BrowserRouter>
        </div>
  );
}

export default App;
