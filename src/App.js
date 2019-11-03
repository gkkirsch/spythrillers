import React, { useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Player from './components/Player'
import MainDisplay from './components/MainDisplay'
import images from 'components/characters'

function App() {
  useEffect(() => {
    Object.values(images).forEach((src) => {
      const image = new Image()
      image.src = src;
    });
  })

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
