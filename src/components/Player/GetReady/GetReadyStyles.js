import styled, { keyframes } from 'styled-components';
import { fadeIn } from 'react-animations';

const zoomAnimation = keyframes`${fadeIn}`;

export const FirstPlayerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly
`;

export const Heading = styled.div`
  text-align: center;
  display: flex;
  justify-content: center;
  transition: all 1s ease-out;
  animation: 1s ${zoomAnimation};
  font-size: 24px;
  font-weight: 700;
  padding: 4px;
  color: #F3DE21;
  text-transform: uppercase;
`;

export const CountDown = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 350px;
  font-size: 304px;
  color: #e02712;
`;

export const Cancel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 350px;
  font-size: 40px;
  color: #e02712;
`;

export const Submit = styled.div`
  :active {
    transform: scale(.7, .7);
    transition: all .5s;
  }
  transition: all 1s ease-out;
  font-size: 50px;
  font-weight: 800;
  margin-top: 8px;
  width: 144px;
  border-radius: 3px;
  align-items: center;
  height: 35px;
  display: flex;
  background-color: #282c34;
  justify-content: center;
  color: #F3DE21;
  padding: 18px 0;
  text-transform: uppercase;
  -webkit-user-select: none !important;
  -webkit-touch-callout: none !important;
`;
