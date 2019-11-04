import React, { useState, useEffect } from 'react';
import { useFirebase } from 'components/Firebase';
import images from 'components/characters'
import waiting from 'images/waiting.jpg'
import { AdSpace, Heading, WaitingWrapper, Player, StandOut, PlayerWrapper } from './GetReadyStyles';

function Waiting({game, player}) {
  const firebase = useFirebase();
  const [loading, setLoading] = useState(true);
  const [firstPlayer, setFirstPlayer] = useState({});

  useEffect(() => {
    const getFirstPlayer = async () => {
      const firstPlayerRef = firebase.getRef(`games.${game.code}.players`)
      const firstPlayer = await firstPlayerRef.where("firstPlayer", "==", true).get()
      setLoading(false)
      setFirstPlayer(firstPlayer.docs[0].data())
    }
    getFirstPlayer()
  }, [])

  if (loading) return <div />
  return (
    <WaitingWrapper>
      <div>
        <Heading>
          Waiting for&nbsp;<StandOut style={{color: '#dc2613'}}>{firstPlayer.name}</StandOut>&nbsp;<PlayerWrapper><Player src={images[firstPlayer.avatar]} /></PlayerWrapper>
        </Heading>

        <Heading>
          &nbsp;to start the game
        </Heading>
      </div>
      <AdSpace style={{paddingTop: 8}}><img width="70%" src={waiting} /></AdSpace>
    </WaitingWrapper>
  )
}

export default Waiting;
