import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Player from './components/Player'
import MainDisplay from './components/MainDisplay'
import Settings from './components/Settings'
import images from 'components/characters'
import logo from 'images/spy-thrillers-small.jpg';

const optimiseImageLoading = () => {
  new Image().src = logo;
  Object.values(images).forEach((src) => {
    new Image().src = src
  });
}

function App() {
  useEffect(() => {
    optimiseImageLoading()
  })

  return (
    <Router>
      <Switch>
        <Route path="/tv">
          <MainDisplay />
        </Route>
        <Route path="/settings">
          <Settings />
        </Route>
        <Route path="/">
          <Player />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
