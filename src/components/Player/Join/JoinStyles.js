import styled, { keyframes } from 'styled-components';
import { fadeIn, slideInRight, pulse } from 'react-animations';
const zoomAnimation = keyframes`${fadeIn}`;
const pulseAnimation = keyframes`${pulse}`;
const slideInRightAnimation = keyframes`${slideInRight}`;

export const Joining = styled.div`
  animation: 1s ${pulseAnimation} infinite;
`;

export const Error = styled.div`
  text-align: center;
  color: #e22816;
  padding: 16px;
  font-size: 15px;
  font-weight: 800;
`;

export const Wrapper = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #14171C;
  height: 100vh;
`;

export const Header = styled.div`
  display: flex;
  justify-content: center;
  transition: all 1s ease-out;
  position: relative;
  padding-top: 24px;
  margin-right: 8px;
  margin-left: 8px;
`;

export const Logo = styled.img`
  transition: all 1s ease-out;
  animation: 1s ${zoomAnimation};
  max-width: 100%;
  height: auto;
`;

export const Heading = styled.div`
  transition: all 1s ease-out;
  animation: 1s ${zoomAnimation};
  font-size: 16px;
  font-weight: 700;
  color: #F3DE21;
  padding: 18px 0;
  text-transform: uppercase;
`;

export const Submit = styled.div`
  transition: all 1s ease-out;
  animation: .3s ${slideInRightAnimation};
  font-size: 24px;
  font-weight: 800;
  margin-top: 8px;
  width: 134px;
  border-radius: 3px;
  align-items: center;
  height: 13px;
  display: flex;
  background-color: #e52010;
  justify-content: center;
  color: #F3DE21;
  padding: 18px 0;
  text-transform: uppercase;
`;

export const Input = styled.input`
  :focus {
    outline: none;
  }
  :active {
    outline: none;
    border: none;
  }
  display: block;
  color: #54B2DE;
  height: 37px;
  padding: 6px 16px;
  font-size: 13px;
  line-height: 1.846;
  text-transform: uppercase;
  font-weight: 700;
  background-color: black;
  background-image: none;
  border-radius: 3px;
  border: none;
  border-radius: 0;
  -webkit-appearance: none;
  height: 47px;
  font-size: 29px;
  width: 240px;
`;
