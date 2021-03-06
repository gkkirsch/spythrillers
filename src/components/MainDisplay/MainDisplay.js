import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useFirebase } from 'components/Firebase';
import Intro from './Intro';
// import End from './End';
import Accuse from './Accuse';
import Timer from './Timer';
import sounds from 'audio/sounds';

const DEFAULT_GAME_STATE = {
  seconds: 60 * 6, // 6 Minutes
  timer: null,
  locationSet: "default",
  gamePhase: "GATHER_FRIENDS"
}

const getRandom = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

function MainDisplay() {
  const firebase = useFirebase();
  const [game, setGame] = useState({})
  const [players, setPlayers] = useState([]);
  const [accusers, setAccusers] = useState([]);
  const [supporters, setSupporters] = useState([]);
  const [spy, setSpy] = useState(null);
  const [loading, setLoading] = useState(true);

  const listenGameUpdate = (snapshot) => setGame({...snapshot.data()})

  const listenPlayersUpdate = (snapshot) => {
    const updatedPlayers = snapshot.docs.map((doc) => doc.data())
    setPlayers(updatedPlayers)
  }

  const listenSupportersUpdate = (snapshot) => {
    const supporters = snapshot.docs.map((doc) => doc.data())
    setSupporters(supporters)
  }

  const listenAccusersUpdate = (snapshot) => {
    const accusers = snapshot.docs.map((doc) => doc.data())
    setAccusers(accusers)
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

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
      setupAudioShortcuts()
    }, 1000)

    const createNewGame = async () => {
      const queryResults = await firebase.firestore.collection('game-codes').limit(1).get();
      const gameCodeRef = queryResults.docs[0];
      const code = gameCodeRef.data().code;

      gameCodeRef.ref.delete();

      firebase.set(`games.${code}`, {...DEFAULT_GAME_STATE, code});

      return code;
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
      firebase.listen(`games.${code}.supporters`, listenSupportersUpdate)
      firebase.listen(`games.${code}.accusers`, listenAccusersUpdate)
    }

    setupGame()
  }, [firebase])

  useEffect(() => {
    const actions = async () => {
      switch (game.gamePhase) {
        case "GG":
          firebase.set(`games.${game.code}`, { location: null, accusedPlayer: null, started: false})
          if (spy) {
            firebase.set(`games.${game.code}.players.${spy.id}`, { spy: false })
          }
        case "TIMER":
          if (!game.started && !players.length == 0) {
            const newSpy = getRandom(players);
            setSpy(newSpy)
            firebase.set(`games.${game.code}.players.${newSpy.id}`, { spy: true })

            const { locations } = await firebase.get("locations.default")
            const location = getRandom(locations);
            firebase.set(`games.${game.code}`, { started: true, location, loading: false });
          }
          firebase.deleteCollection(`games.${game.code}.accusers`)
          firebase.deleteCollection(`games.${game.code}.supporters`)
        default: return null
      }
    }
    actions()
  }, [game.gamePhase])

  const handleGamePhaseChange = (phase) => {
    firebase.set(`games.${game.code}`, { gamePhase: phase })
  }

  const renderMainDisplay = () => {
    switch (game.gamePhase) {
      case "GATHER_FRIENDS": return <Intro game={game} players={players} />
      case "TIMER": return <Timer game={game} changeGamePhase={handleGamePhaseChange} />
      case "ACCUSE": return <Accuse changeGamePhase={handleGamePhaseChange} game={game} players={players} accusers={accusers} supporters={supporters} />
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

