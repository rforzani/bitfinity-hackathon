import { useEffect, useState } from 'react';
import './App.css';
import motokoLogo from './assets/motoko_moving.png';
import motokoShadowLogo from './assets/motoko_shadow.png';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import { backend } from './declarations/backend';
import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";

function App() {
    const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");

  return (
        <BrowserRouter>
            <Routes pages={pages} />
        </BrowserRouter>
  );
}

export default App;
