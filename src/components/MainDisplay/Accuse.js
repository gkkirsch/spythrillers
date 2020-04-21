import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useFirebase } from 'components/Firebase';
import images from 'components/characters'
import { slideInLeft } from 'react-animations';
const slideLeft = keyframes`${slideInLeft}`;

function Accuse({game, players, accusers, supporters, changeGamePhase}) {
  const firebase = useFirebase();

  const totalPlayers = players.length
  const totalAccusers = accusers.length
  const totalSupporters = supporters.length
  const neededVotes = totalPlayers - 1

  const renderAccusers = () => {
    return accusers.map(() => {
      return <Yay>SPY!</Yay>
    })
  }

  const renderSupporters = () => {
    return supporters.map(() => {
      return <Nay>NOT SPY!</Nay>
    })
  }

  const renderVotes = () => {
    const { accusedPlayer } = game;
    return (
      <PlayerWrapper key={accusedPlayer.id}>
        {accusedPlayer.name}
        <Player src={images[accusedPlayer.avatar]} />
        {renderAccusers()}
        {renderSupporters()}
      </PlayerWrapper>
    )
  }

  if (neededVotes == (totalAccusers + totalSupporters)) {
    if (totalAccusers !== neededVotes) {
      setTimeout(() => { changeGamePhase("TIMER") }, 1000)
    }

    if (totalAccusers == neededVotes) {
      setTimeout(() => { changeGamePhase("GG") }, 1000)
    }
  }

  return (
    <Wrapper>
      <PlayersWrapper>
        {renderVotes()}
      </PlayersWrapper>
    </Wrapper>
  )
}

export default Accuse;

const Yay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #e02712;
  font-size: 2em;
  font-weight: 700;
`;


const Nay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #F3DE21;
  font-size: 2em;
  font-weight: 700;
`;

const SubTitle = styled.div`
  user-select: none;
  font-size: 1em;
  margin: 16px;
  font-weight: 700;
  text-transform: uppercase;
  color: #F3DE21;
`

const PlayersWrapper = styled.div`
  animation: .3s ${slideLeft};
  padding-top: 16px;
  padding-bottom: 16px;
  align-items: center;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;


const Player = styled.img`
  width: 65%;
  margin-bottom: 24px;
`;

const PlayerWrapper = styled.div`
  transform : translate3d(0, 0, 0);
  font-size: 2em;
  margin: 16px;
  font-weight: 700;
  text-transform: uppercase;
  color: #F3DE21;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.div`
  user-select: none;
  margin-top: 16px;
  font-size: 2em;
  color: #e02712;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  color: #e02712;
  font-weight: 700;
  text-transform: uppercase;
`;

