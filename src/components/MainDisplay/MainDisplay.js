import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useFirebase } from 'components/Firebase';
import { Wrapper } from './MainDisplayStyles';
import Intro from './Intro';
import End from './End';
import Accuse from './Accuse';
import Timer from './Timer';
import sounds from 'audio/sounds';

const GAME = Cookies.get('game');

function MainDisplay() {
  const firebase = useFirebase();
  const [game, setGame] = useState({})
  const [gameCode, setGameCode] = useState("");
  const [loading, setLoading] = useState(true);

  const updateGame = (snapshot) => {
    setGame({...snapshot.data()})
    const {countDown} = snapshot.data()
    if (countDown === 1) {
      // firebase.set(`games.${gameCode}.`)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)

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
      if (!GAME) {
        const result = await firebase.firestore.collection('game-codes').limit(1).get()
        const gameCodeRef = result.docs[0]
        const { code } = gameCodeRef.data()
        setGameCode(code)
        await firebase.set(`games.${code}`, { seconds: 60 * 2, timer: 0, locationSet: "default", gamePhase: "GATHER_FRIENDS", code })
        firebase.listen(`games.${code}`, updateGame)
        gameCodeRef.ref.delete()
        Cookies.set('game', code, { expires: 1 });
      } else {
        setGameCode(GAME)
        const players = await firebase.collectionAsList(`games.${GAME}.players`)
        players.forEach((player) => {
          firebase.set(`games.${GAME}.players.${player.id}`, { spy: false }, { merge: true })
        })
        firebase.listen(`games.${GAME}`, updateGame)
      }
    }
    setup()
  }, [firebase])


  const renderMainDisplay = () => {
    if (loading) return <Wrapper />
    switch (game.gamePhase) {
      case "GATHER_FRIENDS":
        return <Intro gameCode={gameCode} />
      case "TIMER":
        return <Timer game={game} />
      case "ACCUSE":
        return <Accuse game={game} />
      case "GG":
        return <End gameCode={gameCode} />
      default:
        return null

    }
  }

  return (
    <Wrapper>
      {renderMainDisplay()}
    </Wrapper>
  )
}

export default MainDisplay;
