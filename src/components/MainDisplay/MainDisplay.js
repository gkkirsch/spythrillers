import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useFirebase } from 'components/Firebase';
import Intro from './Intro';
import End from './End';
import Accuse from './Accuse';
import Timer from './Timer';
import sounds from 'audio/sounds';

const DEFAULT_GAME_STATE = {
  seconds: 60 * 6, // 6 Minutes
  timer: null,
  locationSet: "default",
  gamePhase: "GATHER_FRIENDS"
}

function MainDisplay() {
  const firebase = useFirebase();
  const [game, setGame] = useState({})
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const listenGameUpdate = (snapshot) => setGame({...snapshot.data()})

  const listenPlayersUpdate = (snapshot) => {
    const updatedPlayers = snapshot.docs.map((doc) => doc.data())
    setPlayers(updatedPlayers)
  }

  const createNewGame = async () => {
    const queryResults = await firebase.firestore.collection('game-codes').limit(1).get();
    const gameCodeRef = queryResults.docs[0];
    const code = gameCodeRef.data().code;

    gameCodeRef.ref.delete();

    firebase.set(`games.${code}`, {...DEFAULT_GAME_STATE, code});

    return code;
  }

  const setupAudioShortcuts = () => {
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
  }

  const setupGame = async () => {
    let code = localStorage.getItem('gameCode');

    if (!code) {
      code = await createNewGame()
      // We need to possibly stop listening if this component unmounted.
      localStorage.setItem('gameCode', code);
    }

    firebase.listen(`games.${code}`, listenGameUpdate)
    firebase.listen(`games.${code}.players`, listenPlayersUpdate)
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
      setupAudioShortcuts()
    }, 1000)

    setupGame()
  }, [firebase])


  const renderMainDisplay = () => {
    switch (game.gamePhase) {
      case "GATHER_FRIENDS": return <Intro game={game} players={players} />
      case "TIMER": return <Timer game={game} />
      case "ACCUSE": return <Accuse game={game} players={players} />
      case "GG": return <Intro game={game} players={players} />
      default: return null
    }
  }

  if (loading) return <Wrapper />;
  return <Wrapper>{renderMainDisplay()}</Wrapper>
}

export default MainDisplay;

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

