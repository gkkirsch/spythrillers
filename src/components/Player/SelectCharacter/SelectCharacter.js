import React, { useState, useEffect } from 'react';
import {
  Heading,
  Wrapper,
  PlayersWrapper,
  PlayerWrapper,
  Player,
  PlayerTaken,
  Dim
} from './SelectCharacterStyles.js';
import { useFirebase } from 'components/Firebase';
import images from 'components/characters'

function SelectCharacter({game, player}) {
  const firebase = useFirebase();
  const [avatars, setAvatars] = useState([])
  const [usedAvatars, setUsedAvatars] = useState([])

  const avatarSelected = (snapshot) => {
    if (snapshot.empty) {
      setUsedAvatars({})
      return;
    }
    const usedAvatars = snapshot.docs.reduce((acc, ref) => {
      const data = {[ref.id]: {...ref.data(), id: ref.id}}
      const resultAcc = {...acc, ...data}
      return resultAcc;
    }, {})
    setUsedAvatars(usedAvatars)
  }

  const availableAvatars = () => {
    return avatars.map((avatar) => {
      const used = usedAvatars[avatar.id] || {}
      return {...avatar, ...used}
    })
  }

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    const unsubscribe = firebase.listen(`games.${game.code}.selectedAvatars`, avatarSelected)
    const getAvatars = async () => {
      const result = await firebase.collectionAsList('avatars')
      setAvatars(result)
    }
    getAvatars()

    return () => unsubscribe();
  }, [firebase, game.code])

  const handleAvatarClick = (avatarName) => async () => {
    firebase.set(`games.${game.code}.selectedAvatars.${avatarName}`, {used: true}, {merge: true})
    const players = await firebase.collectionAsList(`games.${game.code}.players`)
    if (players.length == 1) {
      firebase.set(`games.${game.code}.players.${player.id}`, {avatar: avatarName, firstPlayer: true}, {merge: true})
    } else {
      firebase.set(`games.${game.code}.players.${player.id}`, {avatar: avatarName, firstPlayer: false}, {merge: true})
    }
  }

  const renderAvatars = () => {
    return availableAvatars().map((avatar) => {
      if (!avatar.used) {
        return (
          <PlayerWrapper>
            <Player key={avatar.id} onClick={handleAvatarClick(avatar.id)} src={images[avatar.id]} />
          </PlayerWrapper>
        )
      }
      return (
        <Dim>
          <PlayerTaken key={avatar.id} src={images[avatar.id]} />
        </Dim>
      )
    })
  }

  return (
    <Wrapper>
      <Heading>
        Select Your Character
      </Heading>
      <PlayersWrapper>
        {renderAvatars()}
      </PlayersWrapper>
    </Wrapper>
  )
}
export default SelectCharacter;
