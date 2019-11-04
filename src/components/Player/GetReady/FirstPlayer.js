import React, { useState } from 'react';
import { Cancel, CountDown, FirstPlayerWrapper, Heading, Submit } from './GetReadyStyles';
import blam from 'images/blam.png';

function FirstPlayer({game, player}) {
  let countDownStart = 3
  const [intervalId, setIntervalId] = useState(0)
  const [countDown, setCountDown] = useState(null)

  if (countDown === "starting") {
    clearInterval(intervalId)
  }

  const handleSubmit = (e) => {
    setCountDown(countDownStart);
    countDownStart = countDownStart - 1;
    const interval = setInterval(() => {
      if (countDownStart === 0) {
        return setCountDown("starting");
      }
      setCountDown(countDownStart);
      countDownStart = countDownStart - 1;
    }, 1000);
    setIntervalId(interval)
  }

  const handleSubmitCancel = () => {
    if (countDown === "starting") {
      clearInterval(intervalId)
      return;
    }
    clearInterval(intervalId)
    setCountDown("not ready")
    setTimeout(() => {
      setCountDown(null)
    }, 500)
  }

  return (
    <FirstPlayerWrapper>

      <div>
        <Heading>You are in charge!</Heading>
        <Heading>Once everyone has joined,</Heading>
        <Heading>press and hold <img alt="blam" style={{marginLeft: 10}} width="70px" height="100%" src={blam} /></Heading>
      </div>
      <CountDown>{countDown === "not ready" || countDown === "starting" ? <Cancel>{countDown}</Cancel>: countDown}</CountDown>
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
    </FirstPlayerWrapper>
  )
}

export default FirstPlayer;
