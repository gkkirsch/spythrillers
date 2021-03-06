import React, { useState } from 'react';
import { useFirebase } from 'components/Firebase';
import { Cancel, CountDown, FirstPlayerWrapper, Heading, Submit } from './GetReadyStyles';
import blam from 'images/blam.png';

function FirstPlayer({game, player}) {
  let countDownStart = 3
  const [intervalId, setIntervalId] = useState(0)
  const [countDown, setCountDown] = useState(null)
  const firebase = useFirebase();

  if (countDown === 0) {
    clearInterval(intervalId)
  }

  const handleSubmit = (e) => {
    setCountDown(countDownStart);
    firebase.set(`games.${game.code}`, {countDown: countDownStart}, {merge: true})
    countDownStart = countDownStart - 1;
    const interval = setInterval(() => {
      if (countDownStart === 0) {
        firebase.set(`games.${game.code}`, {gamePhase: "TIMER"}, {merge: true})
      }
      firebase.set(`games.${game.code}`, {countDown: countDownStart}, {merge: true})
      setCountDown(countDownStart);
      countDownStart = countDownStart - 1;
    }, 1000);
    setIntervalId(interval)
  }

  const handleSubmitCancel = () => {
    if (countDown === 0) {
      clearInterval(intervalId)
      return;
    }
    clearInterval(intervalId)
    firebase.set(`games.${game.code}`, {countDown: null}, {merge: true})
    setCountDown("not ready")
    setTimeout(() => {
      setCountDown(null)
    }, 500)
  }

  const renderCountdown = () => {
    if (countDown === "not ready") return <CountDown><Cancel>canceled</Cancel></CountDown>
    return <CountDown></CountDown>
  }

  return (
    <FirstPlayerWrapper>
      <div>
        <Heading>You are in charge!</Heading>
        <Heading>Once everyone has joined,</Heading>
        <Heading>press and hold <img alt="blam" style={{marginLeft: 10}} width="70px" height="100%" src={blam} /></Heading>
      </div>
      <Submit
        onContextMenu={(e) => e.preventDefault()}
        onTouchStart={handleSubmit}
        onMouseDown={handleSubmit}
        onMouseUp={handleSubmitCancel}
        onTouchCancel={handleSubmitCancel}
        onTouchEnd={handleSubmitCancel}
        onPointerUp={handleSubmitCancel}
      >
        <img alt="blam" width="120px" src={blam} />
      </Submit>
        {renderCountdown()}
    </FirstPlayerWrapper>
  )
}

export default FirstPlayer;
