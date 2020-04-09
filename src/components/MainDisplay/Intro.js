import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { CountDown, Wrapper, Logo, Header, GameCode, SubText, Player, PlayersWrapper, PlayerWrapper, AnimateCode } from './MainDisplayStyles';
import { useFirebase } from 'components/Firebase';
import styled, { keyframes } from 'styled-components';
import { merge, tada, fadeInUp, pulse, zoomIn, fadeIn } from 'react-animations';
import logo from 'images/spy-thrillers.jpg';
import images from 'components/characters'
import sounds from 'audio/sounds';

let mutePlayers = true

const playCharacterSound = (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      const avatar = change.doc.id
      if (mutePlayers) return;
      if (avatar) return sounds[avatar].play()
    }
  })
}

function Intro({gameCode}) {
  const firebase = useFirebase();
  const [countDown, setCountDown] = useState(null);
  const [players, setPlayers] = useState([]);
  let order = 1

  const updateGame = (snapshot) => {
    if (snapshot.exists) {
      const {countDown} = snapshot.data()
      setCountDown(countDown)
    }
  }

  const updatePlayers = (snapshot) => {
    const currentPlayers = snapshot.docs.reduce((acc, player) => {
      if (player.data().avatar) {
        return [...acc, ...[{...player.data(), id: player.id, order: order}]]
      }
      order = order + 1;
      return acc;
    }, [])
    setPlayers([...players, ...currentPlayers])
}

  useEffect(() => {
    setTimeout(() => {
      mutePlayers = false
    }, 5000)
    return () => {
      mutePlayers = true
    }
  }, [])

  useEffect(() => {

    const image = new Image()
    image.src = logo;

    const setup = async () => {
      firebase.listen(`games.${gameCode}`, updateGame)
      firebase.listen(`games.${gameCode}.players`, updatePlayers)
      firebase.listen(`games.${gameCode}.selectedAvatars`, playCharacterSound)
    }
    setup()
  }, [firebase])

  const renderPlayers = () => {
    const sortedPlayers = players.sort((a, b) =>  a.order - b.order);
    return sortedPlayers.map((player) => {
      return (
        <PlayerWrapper key={player.id}>
          {player.name}
          <Player src={images[player.avatar]} />
        </PlayerWrapper>
      )
    })
  }

  const renderStartHeader = () => {
    if (countDown) return (
      <Header>
        <CountDown>{countDown}</CountDown>
      </Header>
    )

    return (
      <Header>
        <Logo src={logo} />
        <AnimateCode>
          <SubText>
            enter the secret code
          </SubText>
          <GameCode>
            {gameCode}
          </GameCode>
        </AnimateCode>
      </Header>
    )
  }

  return (
    <Wrapper>
      <SetCountDown to="/settings">
        Settings
      </SetCountDown>
        {renderStartHeader()}
      <PlayersWrapper>
        {renderPlayers()}
      </PlayersWrapper>
    </Wrapper>
  )
}

export default Intro;

const SetCountDown = styled(Link)`
  text-decoration: none;
  padding: 8px;
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  font-size: 14px;
  color: #e02712;
  font-weight: 700;
  text-transform: uppercase;
  &:hover {
   color: #F3DE21
  }
`;
