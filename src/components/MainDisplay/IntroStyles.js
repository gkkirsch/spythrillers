import styled, { keyframes } from 'styled-components';
import { Link } from "react-router-dom";
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
  width: 100%;
`;

export const CountDown = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3vw;
  color: #F3DE21;
  font-weight: 700;
  text-transform: uppercase;
`;

export const Header = styled.div`
  transition: all 1s ease-out;
  position: relative;
  width: 35%;
`;

export const Logo = styled.img`
  transition: all 1s ease-out;
  animation: 1s ${zoomAnimation};
  max-width: 100%;
  height: auto;
  margin-bottom: 8px;
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
  min-height: 240px;
  width: 95%;
  padding-top: 16px;
  padding-bottom: 16px;
  flex-wrap: wrap;
  display: flex;
  justify-content: center;
  transition: all 1s;
`;

export const Player = styled.img`
  width: 55%;
`;

export const AnimateCode = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: 1s ${fadeInAnimation};
`;

export const PlayerWrapper = styled.div`
  animation: 1s ${bounceAnimation};
  font-size: 1.5vw;
  width: 16%;
  font-weight: 700;
  margin-top: 32px;
  text-transform: uppercase;
  color: #F3DE21;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Settings = styled(Link)`
  text-decoration: none;
  padding: 8px;
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  font-size: 14px;
  color: #e02712;
  font-weight: 700;
  text-transform: uppercase;
  &:hover {
   color: #F3DE21
  }
`;
