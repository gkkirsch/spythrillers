import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useFirebase } from 'components/Firebase';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import sounds from 'audio/sounds';

function toTime(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function Settings() {
  const GAME = Cookies.get('gameCode');
  const firebase = useFirebase();
  const [seconds, setSeconds] = useState(null)

  const getSeconds = () => {
    if (!seconds) return null;
    const millis = seconds * 1000;
    return toTime(millis)
  }

  useEffect(() => {
    async function fetchData() {
      const game = await firebase.get(`games.${GAME}`);
      setSeconds(game.seconds)
    }
    fetchData();
  }, [])

  const add30 = () => {
    sounds["tick"].play()
    const newSec = seconds + 10
    setSeconds(newSec)
    firebase.set(`games.${GAME}`, { seconds: newSec }, {merge: true})
  }

  const minus30 = () => {
    if (seconds <= 30) return seconds
    sounds["tick"].play()
    const newSec = seconds - 10
    setSeconds(newSec)
    firebase.set(`games.${GAME}`, { seconds: newSec }, {merge: true})
  }

  return (
    <Wrapper>
      <Back to="/tv">x</Back>
      <Form>
        <Label>Timer</Label>
        <Timer>
          <Add30 onClick={add30}>+ 10</Add30><Time>{getSeconds()}</Time><Add30 onClick={minus30}>- 10</Add30>
        </Timer>
      </Form>
    </Wrapper>
  );
}

export default Settings;

const Time = styled.div`
  display: inline;
  width: 109px;
`;

const Back = styled(Link)`
  text-decoration: none;
  padding: 8px;
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  font-size: 48px;
  color: #e02712;
  line-height: 18px;
  // text-transform: uppercase;
  font-weight: 700;
  &:hover {
   color: #F3DE21
  }
`;

const Label = styled.div`
  font-size: 48px;
  color: #e02712;
  font-weight: 700;
  text-transform: uppercase;
`;

const Form = styled.div`
  min-width: 50%;
  display: flex;
  justify-content: space-between;
`;

const Timer = styled.div`
  font-size: 48px;
  color: #F3DE21;
  font-weight: 700;
  text-transform: uppercase;
  display: flex;
  align-items: center;
`;

const Wrapper = styled.div`
  transition: all 1s ease-out;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #14171C;
  height: 100vh;
  width: 100%;
`;

export const Add30 = styled.div`
  margin-left: 18px;
  margin-right: 18px;
  transition: all 1s ease-out;
  font-size: 24px;
  font-weight: 800;
  border-radius: 3px;
  align-items: center;
  display: flex;
  background-color: #e52010;
  justify-content: center;
  color: #F3DE21;
  padding: 12px 12px;
  user-select: none;
  cursor: pointer;
  display: inline;
  text-transform: uppercase;
`;
