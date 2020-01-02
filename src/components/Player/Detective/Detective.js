import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Location = styled.div`
  text-align: center;
  display: flex;
  justify-content: center;
  transition: all 1s ease-out;
  font-size: 4vh;
  font-weight: 700;
  color: #F3DE21;
  padding: 3px 0;
  text-transform: uppercase;
`;

function Detective({location}) {
  return (
    <Wrapper>
      <Location>{location}</Location>
    </Wrapper>
  )
}

export default Detective;
