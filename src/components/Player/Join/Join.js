import React, { useState } from 'react';
import { Wrapper, Logo, Header, Input, Heading, Submit, Joining, Error } from './JoinStyles';
import { useFirebase } from 'components/Firebase';
import logo from 'images/spy-thrillers.jpg';
import CodeInput from './CodeInput';


function Join({onJoin, onLeave}) {
  const firebase = useFirebase();
  const [name, setName] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [error, setError] = useState("");
  const [showJoin, setShowJoin] = useState(false);
  const [joining, setJoining] = useState(false);
  const nameInput = React.createRef()

  const updateGameCode = (code) => {
    if (gameCode.length === 4) {
      nameInput.current.focus()
    }
    setGameCode(code)
  }

  const updateName = (value) => {
    if (name.length > 1 && gameCode.length > 4) {
      setShowJoin(true)
    } else {
      setShowJoin(false)
    }
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
    if (!isUnique) return [false, "What are the chances!!! Your name has been stolen. Pick another.", null]

    // Success
    const playerRef = await firebase.firestore.collection('games').doc(gameCode).collection('players').doc()
    playerRef.set({avatar: null, name: name, id: playerRef.id});
    return [true, game, playerRef.id]
  }

  const handleSubmit = async () => {
    setJoining(true)
    const [success, body, playerId] = await enterGame(gameCode)
    if (success) return onJoin(body, playerId)
    // If your game has been deleted then you shouldn't be in a game.
    onLeave()
    setError(body)
    setJoining(false)
  }
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
      {showJoin && <Submit onClick={handleSubmit}>{(joining) ? <Joining>Joining</Joining> : "Play"}</Submit>}
    </Wrapper>
  )
}

export default Join;
