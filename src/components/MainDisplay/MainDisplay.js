import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Wrapper, Logo, Header, GameCode, SubText, Player, PlayersWrapper, PlayerWrapper, AnimateCode } from './MainDisplayStyles';
import { useFirebase } from 'components/Firebase';
import logo from 'images/spy-thrillers.jpg';
import images from 'components/characters'
import sounds from 'audio/sounds';

const GAME = Cookies.get('game');
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

function MainDisplay() {
  const firebase = useFirebase();
  const [gameCode, setGameCode] = useState("");
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  let order = 1

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
      setLoading(false)
      const audio = sounds.intro.play()
      document.body.onkeyup = (e) => {
        if(e.keyCode == 32){
          if (audio.player.paused) {
            audio.player.play()
          } else {
            audio.player.pause()
          }
        }
      }
    }, 1000)

    const setup = async () => {
      if (!GAME) {
        const result = await firebase.firestore.collection('game-codes').limit(1).get()
        const gameCodeRef = result.docs[0]
        const { code } = gameCodeRef.data()
        setGameCode(code)
        const gameSet = await firebase.set(`games.${code}`, { locationSetId: 1, gamePhase: "GATHER_FRIENDS", code })
        firebase.listen(`games.${code}.players`, updatePlayers)
        firebase.listen(`games.${code}.selectedAvatars`, playCharacterSound)
        gameCodeRef.ref.delete()
        Cookies.set('game', code, { expires: 1 });
      } else {
        setGameCode(GAME)
        firebase.listen(`games.${GAME}.players`, updatePlayers)
        firebase.listen(`games.${GAME}.selectedAvatars`, playCharacterSound)
      }
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
  if (loading) return <Wrapper />
  return (
    <Wrapper>
      <Header>
        <Logo src={logo} />
      </Header>
      <AnimateCode>
        <SubText>
          enter secret code
        </SubText>
        <GameCode>
          {gameCode}
        </GameCode>
      </AnimateCode>
      <PlayersWrapper>
        {renderPlayers()}
      </PlayersWrapper>
    </Wrapper>
  )
}

export default MainDisplay;
