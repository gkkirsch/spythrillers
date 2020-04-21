import React, { useEffect } from 'react';
import { useFirebase } from 'components/Firebase';
import {
  Settings,
  Wrapper,
  Logo,
  Header,
  CountDown,
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
  const firebase = useFirebase();

  useEffect(() => {
    players.forEach((player) => {
      firebase.set(`games.${game.code}.players.${player.id}`, { spy: false, accusedSomeone: false })
    })
  }, [firebase, players])

  useEffect(() => {
    firebase.set(`games.${game.code}`, { timer: game.seconds * 1000})
  }, [firebase, game.seconds])

  useEffect(() => {
    setTimeout(() => mutePlayers = false, 5000)

    const setup = async () => {
      firebase.listen(`games.${game.code}.selectedAvatars`, listenSelectedAvatars)
    }

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
    if (game.countDown) return (
      <AnimateCode>
        <SubText>game starting in</SubText>
        <CountDown>{game.countDown}</CountDown>
      </AnimateCode>
    )
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
