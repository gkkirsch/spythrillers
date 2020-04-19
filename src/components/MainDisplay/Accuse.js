import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useFirebase } from 'components/Firebase';
import images from 'components/characters'
import { slideInLeft } from 'react-animations';
const slideLeft = keyframes`${slideInLeft}`;

function Accuse({game}) {
  const firebase = useFirebase();
  const [ yay, setYay ] = useState(0);
  const [ yayAll, setYayAll ] = useState([]);
  const [ nayAll, setNayAll ] = useState([]);
  const [ nay, setNay ] = useState(0);
  const [ playerCount, setPlayerCount ] = useState(10);
  const accusedPlayer = game.accusedPlayer

  const updateYay = (snapshot) => {
    setYay(snapshot.size)
    setYayAll(snapshot.docs)
  }

  const updateNay = (snapshot) => {
    setNay(snapshot.size)
    setNayAll(snapshot.docs)
  }

  const renderYay = () => {
    const count = new Array(yay).fill(undefined)
    return count.map(() => {
      return <Yay>SPY!</Yay>
    })
  }

  const renderNay = () => {
    const count = new Array(nay).fill(undefined)
    return count.map(() => {
      return <Nay>NOT SPY!</Nay>
    })
  }

  useEffect(() => {
    const setup = async () => {
      firebase.listen(`games.${game.code}.yay`, updateYay)
      firebase.listen(`games.${game.code}.nay`, updateNay)
      const players = await firebase.collectionAsList(`games.${game.code}.players`)

      setPlayerCount(players.length)
    }
    setup()
  }, [])

  const renderAccused = () => {
    return (
      <PlayerWrapper key={accusedPlayer.id}>
        {accusedPlayer.name}
        <Player src={images[accusedPlayer.avatar]} />
        {renderYay()}
        {renderNay()}
      </PlayerWrapper>
    )
  }

  if ((playerCount -1) <= (yay + nay)) {
      const yayCount = new Array(yay).length
      if (yayCount !== (playerCount -1)) {
      setTimeout(() => {
        nayAll.forEach((i) => {
          i.ref.delete()
        })
        yayAll.forEach((i) => {
          i.ref.delete()
        })

        firebase.set(`games.${game.code}`, { gamePhase: "TIMER", accusedPlayer: null }, { merge: true })
    }, 1000)
      }
  }

  const yayCount = new Array(yay).length
  if (yayCount == (playerCount -1)) {
        nayAll.forEach((i) => {
          i.ref.delete()
        })
        yayAll.forEach((i) => {
          i.ref.delete()
        })
    firebase.set(`games.${game.code}`, { gamePhase: "GG", accusedPlayer: null }, { merge: true })
  }

  return (
    <Wrapper>
      <PlayersWrapper>
          {renderAccused()}
      </PlayersWrapper>
    </Wrapper>
  )
}

export default Accuse;

const Yay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #e02712;
  font-size: 2em;
  font-weight: 700;
`;


const Nay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #F3DE21;
  font-size: 2em;
  font-weight: 700;
`;

const SubTitle = styled.div`
  user-select: none;
  font-size: 1em;
  margin: 16px;
  font-weight: 700;
  text-transform: uppercase;
  color: #F3DE21;
`

const PlayersWrapper = styled.div`
  animation: .3s ${slideLeft};
  padding-top: 16px;
  padding-bottom: 16px;
  align-items: center;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;


const Player = styled.img`
  width: 65%;
  margin-bottom: 24px;
`;

const PlayerWrapper = styled.div`
  transform : translate3d(0, 0, 0);
  font-size: 2em;
  margin: 16px;
  font-weight: 700;
  text-transform: uppercase;
  color: #F3DE21;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.div`
  user-select: none;
  margin-top: 16px;
  font-size: 2em;
  color: #e02712;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  color: #e02712;
  font-weight: 700;
  text-transform: uppercase;
`;

