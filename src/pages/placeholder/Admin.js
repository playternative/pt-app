import React, { useState, useEffect } from 'react'
import gql from "graphql-tag"
import { useQuery, useMutation } from "@apollo/react-hooks"

import _ from 'lodash'

import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardText,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner
} from 'reactstrap'

import RichEditor from '../../components/Editor'

const Game_Fragment = gql`
  fragment GameFrag on Game {
    id
    name
    description
    genre
    coverImage
    tags {
      name
    }
  }
`;

const Create_Game = gql`
  mutation createNewGame($createGame: CreateGameInput!) {
    createGame(input: $createGame) {
      ... on Game {
        ...GameFrag
      }
      ... on Error {
        message
      }
    }
  }
  ${Game_Fragment}
`;

const Admin = () => {
  const [newGame, setNewGame] = useState({
    name: '',
    description: '',
    coverImage: '',
    genre: ''
  })

  const [createdGame] = useMutation(Create_Game);


  const handleGameChange = event => {
    event.preventDefault();
    setNewGame({
      ...newGame,
      [event.target.name]: event.target.value
    });

    

  };

  const handleGameSubmit = async (e, input) => {
    e.preventDefault();
    const game = await createdGame({
      variables: { createGame: input }
    });

    if (game) {
      refetch()
      setNewGame({
        name: '',
        description: '',
        coverImage: '',
        genre: ''
      })
    }
  };

  return (
    <section className="p-5">
        <Row>
            <Col sm={6}>
            <Card>
                <CardHeader>Create a Game</CardHeader>
                <CardBody>
                <Form onSubmit={(e) => handleGameSubmit(e, newGame)}>
                  <FormGroup>
                    <Input onChange={handleGameChange} value={newGame.name} name="name" type="text" placeholder="Game Name" />
                    <Input onChange={handleGameChange} value={newGame.description} className="mt-3" name="description" type="textarea" placeholder="Description" />
                    <Input onChange={handleGameChange} value={newGame.genre} className="mt-3" name="genre" type="text" placeholder="Genre the game belongs to" />
                    <div className="mt-4">
                      <Label className="font-weight-bold" for="coverImage">Cover Image</Label>
                      <Input onChange={handleGameChange} value={newGame.coverImage} type="file" name="coverImage" id="coverImage" />
                      {newGame.coverImage && (
                        <img alt={newGame.name} src={newGame.coverImage} style={{ height: '50px', width: '50px' }} />
                      )}
                    </div>
                  </FormGroup>
                  <Button type="submit" block color="primary">Create</Button>
                </Form>
                </CardBody>
              </Card>
            </Col>
            <Col sm={6}>
              <RichEditor />
            </Col>
        </Row>
    </section>
  )
}

export default Admin