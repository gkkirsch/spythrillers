import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import styled from 'styled-components';
import { useFirebase } from 'components/Firebase';
import Join from './Join';
import SelectCharacter from './SelectCharacter';
import GetReady from './GetReady';

const Wrapper = styled.div`
  background-color: #14171C;
  height: 100vh;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
`;


function Player() {
  const [game, setGame] = useState({})
  const [player, setPlayer] = useState({})
  const [loading, setLoading] = useState(true)
  const firebase = useFirebase();

  const updateGame = (snapshot) => {
    setGame({...snapshot.data()})
    setLoading(false)
  }

  const updatePlayer = (snapshot) => {
    if (snapshot.exists) {
      setPlayer({...snapshot.data()})
    }
  }

  useEffect(() => {
    setLoading(true)

    const alreadyInGame = async () => {
      const gameCode = Cookies.get('gameCode')
      const playerId = Cookies.get('playerId')
      // If player isn't in a game currently
      if (!gameCode) {
        Cookies.remove('playerId')
        setLoading(false) ;
        return;
      }

      // The player had a game, but it might not still be going
      const curGame = await firebase.get(`games.${gameCode}`)

      if (curGame) {
        console.log("you are already in a game", curGame)
        // setGame(curGame)
        firebase.listen(`games.${gameCode}`, updateGame)
        firebase.listen(`games.${gameCode}.players.${playerId}`, updatePlayer)
        // Start listening to the game
        // setPlayer({name: Cookies.get('name')})
      } else {
        // If they are not then clear their cookies
        Cookies.remove('playerId')
        Cookies.remove('gameCode')
        setLoading(false)
      }
    }
    alreadyInGame()
  }, [firebase])

  const handleJoin = (game, playerId) => {
    Cookies.set('playerId', playerId, { expires: 1 })
    Cookies.set('gameCode', game.code, { expires: 1 })
    firebase.listen(`games.${game.code}`, updateGame)
    firebase.listen(`games.${game.code}.players.${playerId}`, updatePlayer)
    // setPlayer({name: name})
  }

  const handleLeave = () => {
    Cookies.remove('playerId')
    Cookies.remove('gameCode')
    setGame({})
  }

  const renderGamePhase = () => {
    if (!player.avatar) return <SelectCharacter game={game} player={player} />
    switch (game.gamePhase) {
      case "GATHER_FRIENDS":
        return <GetReady game={game} player={player} />;
      default:
        return null;
    }
  }

  if (loading) return <Wrapper></Wrapper>;

  return (
    <Wrapper>
      {!game.gamePhase && <Join onJoin={handleJoin} onLeave={handleLeave} />}
      {game.gamePhase && renderGamePhase()}
    </Wrapper>
  )
}
export default Player;
