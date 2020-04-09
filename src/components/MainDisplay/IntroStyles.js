import styled, { keyframes } from 'styled-components';
import { merge, tada, fadeInUp, pulse, zoomIn, fadeIn } from 'react-animations';

const bounceAnimation = keyframes`${merge(tada, fadeInUp)}`;
const pulseAnimation = keyframes`${pulse}`;
const zoomAnimation = keyframes`${zoomIn}`;
const fadeInAnimation = keyframes`${fadeIn}`;

export const Wrapper = styled.div`
  transition: all 1s ease-out;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #14171C;
  height: 100vh;
`;

export const Header = styled.div`
  transition: all 1s ease-out;
  position: relative;
  width: 45%;
`;

export const Logo = styled.img`
  transition: all 1s ease-out;
  animation: 1s ${zoomAnimation};
  max-width: 100%;
  height: auto;
`;

export const GameCode = styled.div`
  transition: all 1s ease-out;
  animation: 1.6s ${pulseAnimation} infinite;
  animation-delay: 7s;
  text-transform: uppercase;
  color: #F3DE21;
  font-weight: 700;
  font-size: 3vw;
`;

export const SubText = styled.div`
  padding-top: 16px;
  text-transform: uppercase;
  color: #F3DE21;
  font-weight: 700;
  font-size: 1vw;
`;

export const PlayersWrapper = styled.div`
  width: 75%;
  padding-top: 16px;
  padding-bottom: 16px;
  display: flex;
  justify-content: flex-start;
`;

export const Player = styled.img`
  width: 65%;
`;

export const AnimateCode = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: 1s ${fadeInAnimation};
`;

export const PlayerWrapper = styled.div`
  animation: 1s ${bounceAnimation};
  font-size: 2vw;
  font-weight: 700;
  text-transform: uppercase;
  color: #F3DE21;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
