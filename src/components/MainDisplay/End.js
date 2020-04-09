import React, { useState, useEffect } from 'react';
import { useFirebase } from 'components/Firebase';
import styled from 'styled-components';

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

const PlayAgain = styled.div`
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

function End({gameCode}) {
  const firebase = useFirebase();
  return (
    <Wrapper>
      <CountDown>Times up</CountDown>
      <PlayAgain>Play Again</PlayAgain>
    </Wrapper>
  )
}

export default End;
