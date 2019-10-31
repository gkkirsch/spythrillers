import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useFirebase } from 'components/Firebase';

const Wrapper = styled.div`
  height: 100vh;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
`;

const Avatar = styled.div`
  width: 25px;
  height: 25px;
  background-color: gray;
`;

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
    const unsubscribe = firebase.listen(`games.${game.code}.selectedAvatars`, avatarSelected)
    const getAvatars = async () => {
      const result = await firebase.collectionAsList('avatars')
      setAvatars(result)
    }
    getAvatars()

    return () => unsubscribe();
  }, [firebase, game.code])

  const handleAvatarClick = (avatarName) => () => {
    firebase.set(`games.${game.code}.selectedAvatars.${avatarName}`, {used: true})
    firebase.set(`games.${game.code}.players.${player.id}`, {avatar: avatarName}, {merge: true})
  }

  const renderAvatars = () => {
    return availableAvatars().map((avatar) => {
      if (!avatar.used) {
        return (
          <Avatar key={avatar.id} id={avatar.id} onClick={handleAvatarClick(avatar.id)}>
            {avatar.id}
          </Avatar>
        )
      }
      return (
        <Avatar taken key={avatar.id} id={avatar.id}>
          {avatar.id}
        </Avatar>
      )
    })
  }

  return (
    <Wrapper>
      Select Your Character
      {renderAvatars()}
    </Wrapper>
  )
}
export default SelectCharacter;
