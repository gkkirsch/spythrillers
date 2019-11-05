import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useFirebase } from 'components/Firebase';
import { Wrapper } from './MainDisplayStyles';
import images from 'components/characters'
import sounds from 'audio/sounds';
import Intro from './Intro';

const GAME = Cookies.get('game');

function MainDisplay() {
  const firebase = useFirebase();
  const [game, setGame] = useState({})
  const [gameCode, setGameCode] = useState("");
  const [loading, setLoading] = useState(true);

  const updateGame = (snapshot) => {
    setGame({...snapshot.data()})
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)

    const setup = async () => {
      if (!GAME) {
        const result = await firebase.firestore.collection('game-codes').limit(1).get()
        const gameCodeRef = result.docs[0]
        const { code } = gameCodeRef.data()
        setGameCode(code)
        await firebase.set(`games.${code}`, { locationSetId: 1, gamePhase: "GATHER_FRIENDS", code })
        firebase.listen(`games.${code}`, updateGame)
        gameCodeRef.ref.delete()
        Cookies.set('game', code, { expires: 1 });
      } else {
        setGameCode(GAME)
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
