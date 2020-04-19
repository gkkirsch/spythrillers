import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useFirebase } from 'components/Firebase';
import {
  Settings,
  CountDown,
  Wrapper,
  Logo,
  Header,
  GameCode,
  SubText,
  Player,
  PlayersWrapper,
  PlayerWrapper,
  AnimateCode
} from './IntroStyles';
import logo from 'images/spy-thrillers.jpg';
import images from 'components/characters'
import sounds from 'audio/sounds';

let mutePlayers = true

const listenSelectedAvatars = (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      const avatar = change.doc.id
      if (mutePlayers) return;
      if (avatar) return sounds[avatar].play()
    }
  })
}

function Intro({game, players}) {
  const firebase = useFirebase(`games.${game.code}`);

  const setup = async () => {
    firebase.listen("selectedAvatars", listenSelectedAvatars)
  }

  useEffect(() => {
    players.forEach((player) => {
      firebase.set(`players.${player.id}`, { spy: false, accusedSomeone: false })
    })
  }, [players])

  useEffect(() => {
    firebase.set({ timer: game.seconds * 1000})
  }, [game.seconds])

  useEffect(() => {
    setTimeout(() => mutePlayers = false, 5000)

    setup()

    return () => mutePlayers = true
  }, [firebase])

  const renderPlayers = () => {
    return players.map((player) => {
      return (
        <PlayerWrapper key={player.id}>
          {player.name}
          <Player src={images[player.avatar]} />
        </PlayerWrapper>
      )
    })
  }

  const renderEnterCode = () => {
    if (game.countDown) return <SubText>{game.countDown}</SubText>
    return (
      <AnimateCode>
        <SubText>enter the secret code</SubText>
        <GameCode>{game.code}</GameCode>
      </AnimateCode>
    )
  }

  return (
    <Wrapper>
      <Settings to="/settings">Settings</Settings>
      <Header>
        <Logo src={logo} />
        {renderEnterCode()}
      </Header>
      <PlayersWrapper>
        {renderPlayers()}
      </PlayersWrapper>
    </Wrapper>
  )
}

export default Intro;
