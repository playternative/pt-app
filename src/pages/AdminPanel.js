import React, { useState, useEffect, useRef } from 'react'

import { Spinner } from 'reactstrap';

import _ from 'lodash'

import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";

import {
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  CardText,
  CardHeader,
  Badge,
  Alert,
} from 'reactstrap'

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

const Game_Query = gql`
  query games {
     games {
      ...GameFrag
    }
  }
  ${Game_Fragment}
`;


const CREATE_NEW_GAME = gql`
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

const AdminPanel = () => {
  const [gameList, setGameList] = useState()
  const [newGame, setNewGame] = useState({
    name: '',
    description: '',
    coverImage: '',
    genre: ''
  })
  const [tags, setTags] = useState([])

  const { data, loading, error, refetch } = useQuery(Game_Query);
  const [createdGame] = useMutation(CREATE_NEW_GAME);

  const prevDataRef = useRef(data)
  useEffect(() => {
    // Initial
    setGameList(data)

    if (!_.isEqual(data, prevDataRef.current)) {
      console.log('here')
      setGameList(data)
    }

    prevDataRef.current = data
  }, [data])

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
      console.log('game created!')
    }

  };

  const renderGames = () => {
    if (gameList) {
      const list = gameList.games.map(g => {
        return (
          <Card className="mb-2" key={g.id}>
            <CardHeader className="bg-dark text-white">{g.name}<Badge color="primary" className="float-right">{g.genre}</Badge></CardHeader>
            <CardBody>
              <CardText>{g.description}</CardText>
            </CardBody>
          </Card>
        )
      })
      return list
    }
  }

  const handleExistingTag = (event, tag) => {
    event.preventDefault()
    const newTagArray = [...tags]
    newTagArray.push(tag.name)

    const dupeCheck = tags.includes(tag.name)

    if (dupeCheck) return null

    setTags(newTagArray)
  }

  const renderAvailableTags = () => {
    const tags = data.allGames.map(t => {
      return t.tags.map(i => {
        return (
          <Button onClick={(e) => handleExistingTag(e, i)} className="m-1" color="dark">{i.name}</Button>
        )
      })

    })
    return tags
  }

  const handleAddTag = (event) => {
    event.preventDefault()
  }

  const renderGameTags = () => {
    if (tags) {
      const badges = tags.map(i => {
        return (
          <h4><Badge pill color="warning" className="m-1">{i}</Badge></h4>
        )
      })
      return badges
    }
  }


  //   <div className="mt-4 text-center">
  //   <Label className="font-weight-bold">Create a tag</Label>
  //   <Input className="mt-3" name="tags" type="text" placeholder="Tags" />
  //   <Button onClick={(e) => handleAddTag(e)} className="mt-3" block color="primary">Add Tag</Button>
  // </div>
  // {loading ?
  //   <Spinner style={{ width: '3rem', height: '3rem' }} />
  //   :
  //   <div className="text-center mt-4">
  //     <span className="mt-3 text-center font-weight-bolder">Existing Tags</span>
  //     <Row className="mt-3">
  //       <Col sm={12}>
  //         {renderAvailableTags()}
  //       </Col>
  //     </Row>
  //   </div>
  // }
  // <div className="mt-4 d-flex flex-column justify-content-center align-items-center">
  //   {tags.length <= 0 ?
  //     <Alert>There are currently no tags on this game.</Alert>
  //     :
  //     <>
  //       <span className="text-center font-weight-bolder">Tags on this game</span>
  //       <Row>
  //         {renderGameTags()}
  //       </Row>
  //     </>}
  // </div>

  let body = document.body, html = document.documentElement;
  let windowHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

  return (
    <section className="p-5">
      <Row>
        <Col sm={6}>
          <Card>
            <CardHeader>Add a game</CardHeader>
            <CardBody>
              <Form onSubmit={(e) => handleGameSubmit(e, newGame)}>
                <FormGroup>
                  <Input onChange={handleGameChange} value={newGame.name} name="name" type="text" placeholder="Game Name" />
                  <Input onChange={handleGameChange} value={newGame.description} className="mt-3" name="description" type="textarea" placeholder="Description" />
                  <Input onChange={handleGameChange} value={newGame.genre} className="mt-3" name="genre" type="text" placeholder="Genre the game belongs to" />
                  <div className="mt-4">
                    <Label className="font-weight-bold" for="coverImage">Cover Image</Label>
                    <Input onChange={handleGameChange} value={newGame.coverImage} type="file" name="coverImage" id="coverImage" />
                  </div>
                </FormGroup>
                <Button type="submit" block color="primary">Create</Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
        <Col style={{ maxHeight: windowHeight / 1.3, overflowY: 'auto' }} sm={6}>
          <Card>
            <CardHeader className="bg-dark text-white text-center font-weight-bolder">Game List</CardHeader>
            <CardBody>
              {loading ?
                <Spinner style={{ width: '3rem', height: '3rem' }} />
                :
                renderGames()
              }
            </CardBody>
          </Card>
        </Col>
      </Row>
    </section>
  )
}

export default AdminPanel
