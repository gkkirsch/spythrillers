import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Player from './components/Player'
import MainDisplay from './components/MainDisplay'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/tv">
          <MainDisplay />
        </Route>
        <Route path="/">
          <Player />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
