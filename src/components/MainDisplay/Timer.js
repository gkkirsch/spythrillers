import React, { useState, useEffect } from 'react';
import { useFirebase } from 'components/Firebase';
import styled from 'styled-components';
import useCountdown from 'react-use-countdown';
import sounds from 'audio/sounds';

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

const getRandom = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

function Timer({game}) {
  const firebase = useFirebase();
  const mili = useCountdown(() => Date.now() + game.timer);
  const secondsLeft = mili / 1000;
  // const [timer, setTimer] = useState(180)
  const [spy, setSpy] = useState({})

  useEffect(() => {
    const setup = async () => {
      const players = await firebase.collectionAsList(`games.${game.code}.players`)
      const spy = getRandom(players)
      setSpy(spy)
      await firebase.set(`games.${game.code}.players.${spy.id}`, { spy: true }, { merge: true })
      const { locations } = await firebase.get(`locations.${game.locationSet}`)
      const location = getRandom(locations)
      firebase.set(`games.${game.code}`, { location }, { merge: true })
    }
    if (!game.accused) setup()
  }, [])

  if (secondsLeft <= 60) {
    if (secondsLeft % 2 === 0) {
      sounds["tick"].play()
    }
  }
  if (secondsLeft <= 30) {
    if (secondsLeft % 2 === 0) {
      sounds["tick"].play()
    } else {
      sounds["tock"].play()
    }
  }
  if (mili === 0) {
    firebase.set(`games.${game.code}.players.${spy.id}`, { spy: false }, { merge: true })
    firebase.set(`games.${game.code}`, { gamePhase: "GG", location: null }, { merge: true })
  }

  firebase.set(`games.${game.code}`, { timer: mili }, { merge: true })

  return (
    <CountDown>{new Date(mili).toISOString().substr(11, 8).replace(/^[0:]+/, "")}</CountDown>
  )
}

export default Timer;
