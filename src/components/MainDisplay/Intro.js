import React, { useState, useEffect } from 'react';
import { CountDown, Wrapper, Logo, Header, GameCode, SubText, Player, PlayersWrapper, PlayerWrapper, AnimateCode } from './MainDisplayStyles';
import { useFirebase } from 'components/Firebase';
import logo from 'images/spy-thrillers.jpg';
import images from 'components/characters'
import sounds from 'audio/sounds';

let mutePlayers = true

setTimeout(() => {
  mutePlayers = false
}, 5000)

const playCharacterSound = (snapshot) => {
  if (mutePlayers) return;
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      const avatar = change.doc.id
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
    const image = new Image()
    image.src = logo;

    setTimeout(() => {
      const audio = sounds.intro.play()
      document.body.onkeyup = (e) => {
        if(e.keyCode === 32){
          if (audio.player.paused) {
            audio.player.play()
          } else {
            audio.player.pause()
          }
        }
      }
    }, 1000)

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
        {renderStartHeader()}
      <PlayersWrapper>
        {renderPlayers()}
      </PlayersWrapper>
    </Wrapper>
  )
}

export default Intro;
