import React from 'react';
import FirstPlayer from './FirstPlayer';
import Waiting from './Waiting';

function GetReady(props) {
  const {player} = props
  if (player.firstPlayer) return <FirstPlayer {...props} />
  return <Waiting {...props} />
}

export default GetReady;
