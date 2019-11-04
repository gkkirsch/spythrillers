import styled, { keyframes } from 'styled-components';
import { fadeIn, fadeInLeft } from 'react-animations';

const zoomAnimation = keyframes`${fadeIn}`;
const fadeInUpBigAnimation = keyframes`${fadeInLeft}`;

export const Wrapper = styled.div`
  height: 100vh;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
`;

export const Heading = styled.div`
  text-align: center;
  display: flex;
  justify-content: center;
  transition: all 1s ease-out;
  animation: 1s ${zoomAnimation};
  font-size: 16px;
  font-weight: 700;
  color: #F3DE21;
  padding: 18px 0;
  text-transform: uppercase;
`;

export const Player = styled.img`
  width: 100%;
  min-height:1px
  padding: 6px;
`;

export const PlayerWrapper = styled.div`
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Dim = styled.span`
  filter: brightness(30%);
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const PlayerTaken = styled.img`
  width: 100%;
  min-height:1px
  padding: 6px;
  filter: grayscale(100%);
`;

export const PlayersWrapper = styled.div`
  animation: 1s ${fadeInUpBigAnimation};
  padding: 0px 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

