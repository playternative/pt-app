import React from 'react'
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

import { Row } from 'reactstrap'

const Game_Query = gql`
  query games {
    allGames: games {
      name
      genre
    }
  }
`;

const GameList = () => {

  return (
    <>game list</>
  )
}

export default GameList
