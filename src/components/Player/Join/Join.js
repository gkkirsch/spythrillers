import React, { useState, useEffect } from 'react';
import { Wrapper, Logo, Header, Input, Heading, Submit, Joining, Error } from './JoinStyles';
import { useFirebase } from 'components/Firebase';
import logo from 'images/spy-thrillers-small.jpg';
import CodeInput from './CodeInput';
import SelectCharacter from './SelectCharacter';

function Join({onJoin}) {
  const firebase = useFirebase();
  const [name, setName] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [step, setStep] = useState("ENTER_CODE");
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

  const validGame = async (gameCode) => {
    const game = await firebase.get(`games.${gameCode}`)
    if (!game) return [false, "A game with that code hasn't been started."]

    const isUnique = await nameIsUnique()
    if (!isUnique) return [false, "What are the chances!!! Someone else's mother used that same name."]
    return [true, null]
  }

  const handleSubmit = async () => {
    if (gameCode.length !== 5) return setError("You can't just not enter a secret code...")
    if (name.length < 2) return setError("Your name has to be more than a single letter. C'mon GEEZ.")
    if (name.length > 10) return setError("Your name is a little lengthy, don't be offended just shorten it.")
    setJoining(true)
    const [valid, error] = await validGame(gameCode)
    if (valid) setStep("SELECT_CHARACTER")
    // If your game has been deleted then you shouldn't be in a game.
    setError(error)
    setJoining(false)
  }

  if (loading) return <Wrapper />
  if (step === "SELECT_CHARACTER") return <SelectCharacter onJoin={onJoin} gameCode={gameCode} name={name} />
  if (step === "ENTER_CODE") {
    return (
      <Wrapper>
        <Header>
          <Logo src={logo} />
        </Header>
        <Heading>Enter Secret Code</Heading>
        <CodeInput value={gameCode} onChange={updateGameCode} />
        <Heading>First Name</Heading>
        <Input ref={nameInput} value={name} onChange={(e) => updateName(e.target.value)}/>
        <Error>{ error }</Error>
        <Submit onClick={handleSubmit}>{(joining) ? <Joining>Joining</Joining> : "Play"}</Submit>
      </Wrapper>
    )
  }
}

export default Join;
