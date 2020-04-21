import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import styled, { keyframes } from 'styled-components';
import { useFirebase } from 'components/Firebase';
import images from 'components/characters'
import { slideInLeft } from 'react-animations';
const slideLeft = keyframes`${slideInLeft}`;

function Spy({game, currentPlayer, players}) {
  const firebase = useFirebase();
  const [locations, setLocations] = useState([])
  const [showLocations, setShowLocations] = useState(false)

  useEffect(() => {
    const setup = async () => {
      const { locations } = await firebase.get(`locations.${game.locationSet}`)
      setLocations(locations)
    }
    setup()
  }, [])

  const handleAccuseClick = (accusedPlayer) => () => {
    firebase.set(`games.${game.code}`, { gamePhase: "ACCUSE", accusedPlayer })
    firebase.set(`games.${game.code}.players.${currentPlayer.id}`, { accusedSomeone: true })
  }

  const renderLocations = () => {
    return locations.map((location) => {
      return (
        <Location>{location}</Location>
      )
    })
  }

  const handleEndClick = () => {
    firebase.set(`games.${game.code}`, { gamePhase: "GG" })
  }

  if (!showLocations) {
    return (
    <Wrapper>
      <ViewAccuse onClick={() => setShowLocations(true)}>
        <V>V</V>
        <V>I</V>
        <V>E</V>
        <V>W</V>
        <S></S>
        <V>A</V>
        <V>C</V>
        <V>C</V>
        <V>U</V>
        <V>S</V>
        <V>E</V>
      </ViewAccuse>
      <Title>You are the SPY</Title>
      <EndGame onClick={handleEndClick}>END GAME</EndGame>
      <SubTitle>Locations</SubTitle>
      <Locations>
        {renderLocations()}
      </Locations>
    </Wrapper>
    )
  }

  const renderPlayers = () => {
    const sortedPlayers = players.sort((a, b) =>  a.order - b.order);
    const filteredPlayers = sortedPlayers.filter((filteredPlayer) => {
      return filteredPlayer.id != currentPlayer.id
    })
    return filteredPlayers.map((player) => {
      return (
        <PlayerWrapper key={player.id} onClick={handleAccuseClick(player)}>
          {player.name}
          <Player src={images[player.avatar]} />
        </PlayerWrapper>
      )
    })
  }

  return (
    <Wrapper>
      <ViewLocations onClick={() => setShowLocations(false)}>
        <V>V</V>
        <V>I</V>
        <V>E</V>
        <V>W</V>
        <S></S>
        <V>L</V>
        <V>O</V>
        <V>C</V>
        <V>A</V>
        <V>T</V>
        <V>I</V>
        <V>O</V>
        <V>N</V>
        <V>S</V>
      </ViewLocations>
      <Title>You are the SPY</Title>
      <EndGame onClick={handleEndClick}>END GAME</EndGame>
        {currentPlayer.accusedSomeone &&
          <SubTitle>You have already accused someone.</SubTitle>
        }
        {!currentPlayer.accusedSomeone &&
        <>
          <SubTitle>Tap Player to Accuse</SubTitle>
          <PlayersWrapper>
            {renderPlayers()}
          </PlayersWrapper>
        </>
        }
    </Wrapper>
  )
}

export default Spy;

const EndGame = styled.div`
  user-select: none;
  cursor: pointer;
  font-weight: 700;
  margin-top: 32px;
  margin-bottom: 32px;
  background-color: #F3DE21;
  padding: 8px;
  font-size: 2em;
  font-size: 2em;
  color: #e02712;
  &:active {
    color: #F3DE21;
    background-color: #e02712;
  }
  &:hover {
    color: #F3DE21;
    background-color: #e02712;
  }
`;

const S = styled.div`
  margin-top: 8px;
  margin-bottom: 8px;
`;

const V = styled.div`
  cursor: pointer;
  text-transform: uppercase;
`;

const ViewAccuse = styled.div`
  user-select: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 50%;
  margin-top: -100px;
  left: 10px;
  font-size: 1em;
  color: gray;
`

const ViewLocations = styled.div`
  user-select: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 50%;
  margin-top: -100px;
  left: 10px;
  font-size: 1em;
  color: gray;
`

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
  justify-content: flex-start;
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

const Location = styled.div`
  user-select: none;
  font-size: 2em;
  font-weight: 700;
  color: #F3DE21;
  text-transform: lowercase;
  text-align: center;
  box-sizing: border-box;
  transition: all 1s ease-out;
  margin: 8px;
  background-color: black;
  align-self: auto;
  padding: 6px 6px;
`;

const Locations = styled.div`
  animation: .3s ${slideLeft};
  flex-direction: column;
  justify-content: center;
  margin-top: 32px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

