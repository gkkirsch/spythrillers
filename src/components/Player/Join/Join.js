import React, { useState, useEffect } from 'react';
import { Wrapper, Logo, Header, Input, Heading, Submit, Joining, Error } from './JoinStyles';
import { useFirebase } from 'components/Firebase';
import logo from 'images/spy-thrillers-small.jpg';
import CodeInput from './CodeInput';

// function toggleFullScreen() {
//   try {
//     var doc = window.document;
//     var docEl = doc.documentElement;
//
//     var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
//
//     if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
//       requestFullScreen.call(docEl);
//     }
//   } catch {
//   }
// }

function Join({onJoin, onLeave}) {
  const firebase = useFirebase();
  const [name, setName] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const nameInput = React.createRef()

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  })

  const updateGameCode = (code) => {
    if (gameCode.length === 4 && code.length === 5) {
      nameInput.current.focus()
    }
    setGameCode(code.toLowerCase())
  }

  const updateName = (value) => {
    setName(value)
  }

  const nameIsUnique = async () => {
    const exists = await firebase.exists(`games.${gameCode}.players.${name}`)
    return !exists
  }

  const enterGame = async (gameCode) => {
    const game = await firebase.get(`games.${gameCode}`)
    if (!game) return [false, "A game with that code hasn't been started.", null]

    const isUnique = await nameIsUnique()
    if (!isUnique) return [false, "What are the chances!!! Someone else's mother used that same name.", null]

    // Success
    const playerRef = await firebase.firestore.collection('games').doc(gameCode).collection('players').doc()
    playerRef.set({avatar: null, name: name, id: playerRef.id});
    return [true, game, playerRef.id]
  }

  const handleSubmit = async () => {
    if (name.length < 2 || gameCode.length !== 5) return setError("Name needs to be more than a single letter, \n and don't forget the secret code")
    setJoining(true)
    const [success, body, playerId] = await enterGame(gameCode)
    if (success) return onJoin(body, playerId)
    // If your game has been deleted then you shouldn't be in a game.
    onLeave()
    setError(body)
    setJoining(false)
  }

  if (loading) return <Wrapper />

  return (
    <Wrapper>
      <Header>
        <Logo src={logo} />
      </Header>
      <Heading>
        Enter Secret Code
      </Heading>
      <CodeInput
        value={gameCode}
        onChange={updateGameCode}
      />
      <Heading>
        First Name
      </Heading>
      <Input ref={nameInput} value={name} onChange={(e) => updateName(e.target.value)}/>
      <Error>
        { error }
      </Error>
      <Submit onClick={handleSubmit}>{(joining) ? <Joining>Joining</Joining> : "Play"}</Submit>
    </Wrapper>
  )
}

export default Join;
