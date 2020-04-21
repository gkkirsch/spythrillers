import React, { useEffect } from 'react';
import { useFirebase } from 'components/Firebase';
import styled from 'styled-components';
import useCountdown from 'react-use-countdown';
import sounds from 'audio/sounds';

const getRandom = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

const playSounds = (timer) => {
  if (timer <= 6000) {
    if (timer % 2 === 0) sounds["tick"].play()
  }

  if (timer <= 3000) {
    if (timer % 2 === 0) {
      sounds["tick"].play()
    } else {
      sounds["tock"].play()
    }
  }
}

const formatCountDown = (timer) => {
  const dateString = new Date(timer).toISOString();
  const minutes = dateString.substr(11, 8);
  return minutes.replace(/^[0:]+/, "");
}

function Timer({changeGamePhase, game}) {
  const firebase = useFirebase();
  const timer = useCountdown(() => Date.now() + game.timer);

  firebase.set(`games.${game.code}`, { timer });

  if (timer === 0) changeGamePhase("GG");

  playSounds(timer);

  return <CountDown>{formatCountDown(timer)}</CountDown>
}

export default Timer;

const CountDown = styled.div`
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 350px;
  font-size: 304px;
  color: #e02712;
  font-weight: 700;
  text-transform: uppercase;
`;
