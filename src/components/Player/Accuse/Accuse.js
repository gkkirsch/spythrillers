import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useFirebase } from 'components/Firebase';
import images from 'components/characters'
import { slideInLeft } from 'react-animations';
const slideLeft = keyframes`${slideInLeft}`;

function Accuse({game, player}) {
  const firebase = useFirebase();
  const [ vote, setVote ] = useState({});
  const accusedPlayer = game.accusedPlayer

  useEffect(() => {
    const setup = async () => {
    }
    setup()
  }, [])

  const handleSpyClick = () => {
    firebase.addToList(`games.${game.code}.yay`, player)
    setVote("YAY")
  }

  const handleNotSpyClick = () => {
    firebase.addToList(`games.${game.code}.nay`, player)
    setVote("NAY")
  }

  const renderAccused = () => {
    return (
      <PlayerWrapper key={accusedPlayer.id}>
        {accusedPlayer.name}
        <Player src={images[accusedPlayer.avatar]} />
      </PlayerWrapper>
    )
  }

  if  (player.id == accusedPlayer.id) {
    return <CenterSpy>YOUR BEING ACCUSED</CenterSpy>
  }

  if (vote === "YAY") {
    return <CenterSpy><div>voted</div><div>SPY!</div></CenterSpy>
  }

  if (vote === "NAY") {
    return <CenterNotSpy><div>voted</div><div> NOT SPY</div></CenterNotSpy>
  }

  return (
    <Wrapper>
      <PlayerOption onClick={handleSpyClick}>SPY!</PlayerOption>
      <PlayersWrapper>
        {renderAccused()}
      </PlayersWrapper>
      <PlayerOption onClick={handleNotSpyClick}>NOT SPY</PlayerOption>
    </Wrapper>
  )
}

export default Accuse;

const CenterNotSpy = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #e02712;
  background-color: #F3DE21;
  font-size: 2em;
  font-weight: 700;
  height: 100%;
  width: 100%;
`;


const CenterSpy = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #F3DE21;
  background-color: #e02712;
  font-size: 2em;
  font-weight: 700;
  height: 100%;
  width: 100%;
`;

const PlayerOption = styled.div`
  font-weight: 700;
  margin-top: 32px;
  margin-bottom: 32px;
  background-color: #F3DE21;
  padding: 8px;
  text-transform: upper-case;
  font-size: 2em;
  color: #e02712;
  cursor: pointer;
  &:active {
    color: #F3DE21;
    background-color: #e02712;
  }
  &:hover {
    color: #F3DE21;
    background-color: #e02712;
  }
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

