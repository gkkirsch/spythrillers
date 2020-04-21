import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import styled from 'styled-components';
import { useFirebase } from 'components/Firebase';
import Join from './Join';
import GetReady from './GetReady';
import Spy from './Spy/Spy';
import Accuse from './Accuse/Accuse';
import Detective from './Detective/Detective';

const CountDown = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 304px;
  color: #e02712;
  font-weight: 700;
  text-transform: uppercase;
`;

const Wrapper = styled.div`
  background-color: #14171C;
  height: 100vh;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
`;


function Player() {
  const [loading, setLoading] = useState(true)
  const [game, setGame] = useState({})
  const [player, setPlayer] = useState({})
  const [players, setPlayers] = useState([])
  const firebase = useFirebase();

  const listenGameUpdate = (snapshot) => {
    setGame({...snapshot.data()})
    setLoading(false)
  }

  const listenPlayerUpdate = (snapshot) => {
    if (snapshot.exists) {
      setPlayer({...snapshot.data()})
    }
  }

  const listenPlayersUpdate = (snapshot) => {
    const updatedPlayers = snapshot.docs.map((doc) => doc.data())
    setPlayers(updatedPlayers)
  }

  useEffect(() => {
    const getExistingGame = async () => {
      const code = localStorage.getItem('gameCode');
      const playerId = localStorage.getItem('playerId')
      if (!code || !playerId) {
        // localStorage.removeItem('playerId')
        setLoading(false) ;
        return;
      }

      // The player had a game, but it might not still be going
      const curGame = await firebase.get(`games.${code}`)
      setLoading(false)

      if (curGame) {
        firebase.listen(`games.${code}`, listenGameUpdate);
        firebase.listen(`games.${code}.players.${playerId}`, listenPlayerUpdate);
        firebase.listen(`games.${code}.players`, listenPlayersUpdate)
        return;
      }

      // localStorage.removeItem('playerId')
      // localStorage.removeItem('gameCode')
      setLoading(false)
    }

    getExistingGame()
  }, [firebase])

  const handleJoin = async (gameCode, name, avatar) => {
    firebase.set(`games.${gameCode}.selectedAvatars.${avatar}`, {used: true});
    const players = await firebase.collectionAsList(`games.${gameCode}.players`)

    const firstPlayer = !players.length
    const playerId = await firebase.create(`games.${gameCode}.players`, {avatar, name, firstPlayer});

    firebase.listen(`games.${gameCode}`, listenGameUpdate)
    firebase.listen(`games.${gameCode}.players.${playerId}`, listenPlayerUpdate)

    localStorage.setItem('playerId', playerId)
    localStorage.setItem('gameCode', gameCode)
  }

  const handleLeave = () => {
    localStorage.removeItem('playerId')
    localStorage.removeItem('gameCode')
    setGame({})
  }

  const renderGamePhase = () => {
    if (game.loading) return null;
    switch (game.gamePhase) {
      case "GATHER_FRIENDS":
        if (game.countDown && !player.firstPlayer) return <CountDown>{game.countDown}</CountDown>
        return <GetReady game={game} player={player} />;
      case "TIMER":
        if (player.spy) return <Spy game={game} currentPlayer={player} players={players} />
        return <Detective game={game} currentPlayer={player} players={players} />
      case "ACCUSE":
        return <Accuse game={game} player={player} />;
      case "GG":
        if (game.countDown && !player.firstPlayer) return <CountDown>{game.countDown}</CountDown>
        return <GetReady game={game} player={player} />;
      default:
        return null;
    }
  }

  if (loading) return <Wrapper></Wrapper>;
  if (!player) return <Wrapper></Wrapper>;

  return (
    <Wrapper>
      {!game.gamePhase && <Join onJoin={handleJoin} />}
      {game.gamePhase && renderGamePhase()}
    </Wrapper>
  )
}
export default Player;
