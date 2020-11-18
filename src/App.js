import React from 'react';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


import LogonScreen from './components/Logon/LogonScreen';
import GameScreen from './components/Game/GameScreen';



const outerTheme = createMuiTheme(
  {
    palette: {
      background: {
        paper: '#e6faeb'
      },
      primary: {
        main: '#4caf50',
      },
      secondary: {
        main: '#c62828',
      },
    },
    typography: {
      button: {
        //fontSize: 'calc(10px + 2vmin)'
      },
      //fontSize: 'calc(10px + 2vmin)',
    },
  }
);


export default function App() {

  //before leaving warning
  if (process.env.NODE_ENV === 'production') {
    window.addEventListener("beforeunload", (ev) => {
      ev.preventDefault();
      return ev.returnValue = 'Are you sure you want to close?';
    });
  };

  return (
    <ThemeProvider theme={outerTheme}>
      <Router>
        <div className="App">
          <header className="App-header">
            <Switch>
              <Route exact path="/">
                <LogonScreen />
              </Route>
              <Route path="/Game">
                <GameScreen />
              </Route>
              <Route path="*">
                <h1>Er is iets misgegaan...</h1>
              </Route>
            </Switch>
          </header>
        </div>
      </Router>
    </ThemeProvider>
  );
}