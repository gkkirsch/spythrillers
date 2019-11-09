import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useFirebase } from 'components/Firebase';

const Wrapper = styled.div`
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.div`
  font-size: 30vh;
  color: #e02712;
  writing-mode: vertical-rl;
  text-orientation: upright;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #e02712;
  font-weight: 700;
  text-transform: uppercase;
`;

const Location = styled.div`
  font-size: 3vh;
  font-weight: 700;
  color: #F3DE21;
  padding: 3px 0;
  text-transform: lowercase;
  text-align: center;
	flex: 1 0 40%;
  box-sizing: border-box;
  transition: all 1s ease-out;
  margin: 8px;
  background-color: black;
  align-self: auto;
  padding: 3px 3px;
`;

const Locations = styled.div`
	display: flex;
	flex-wrap: wrap;
  justify-content: center;
`;

function Spy({game}) {
  const firebase = useFirebase();
  const [locations, setLocations] = useState([])
  const [showSpy, setShowSpy] = useState(true)
  const [showLocations, setShowLocations] = useState(false)

  useEffect(() => {
    const setup = async () => {
      const { locations } = await firebase.get(`locations.${game.locationSet}`)
      setLocations(locations)
    }
    setTimeout(() => {
      setShowSpy(false)
    }, 5000)
    setTimeout(() => {
      setShowLocations(true)
    }, 5500)
    setup()
  }, [])

  const renderLocations = () => {
    return locations.map((location) => {
      return (
        <Location>{location}</Location>
      )
    })
  }

  if (showLocations) {
    return (
      <Locations>
        {renderLocations()}
      </Locations>
    )
  }

  return (
    <Wrapper>
      {showSpy && (
        <Title>SPY</Title>
      )}
    </Wrapper>
  )
}

export default Spy;
