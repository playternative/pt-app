import React, { useState, useEffect, useRef } from 'react'

import { Spinner } from 'reactstrap';

import _ from 'lodash'

import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";

import Searchbar from '../../components/Searchbar'

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
import { select } from 'redux-saga/effects';

const Game_Fragment = gql`
  fragment GameFrag on Game {
    id
    name
    description
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

const DELETE_GAME = gql`
mutation deleteExistingGame($deleteGame: DeleteGameInput!) {
  deleteGame(input: $deleteGame) {
    ...on Game {
      id
    }
    ... on Error {
      message
    }
  }
}
`

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
  })
  const [newTag, setNewTag] = useState({
    name: '',
    game_id: ''
  })

  const [tags, setTags] = useState([])
  const [selectedGames, setSelectedGames] = useState([])

  const { data, loading, error, refetch } = useQuery(Game_Query);

  const [createdGame] = useMutation(CREATE_NEW_GAME);

  const [deletedGame] = useMutation(DELETE_GAME)

  const prevDataRef = useRef(data)
  useEffect(() => {

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

  const handleTagChange = (event) => {
    event.preventDefault()
    setNewTag({
      ...newTag,
      [event.target.name]: event.target.value
    });
  }

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
      })
    }
  };

  // Delete A Game
  const deleteGame = async (id) => {
    const deleted = await deletedGame({
      variables: { deleteGame: { id } }
    })

    if (deleted) {
      refetch()
    }
  }

  const renderGames = () => {
    if (gameList) {
      const list = gameList.games.map(g => {
        return (
          <Card className="mb-2" key={g.id}>
            <CardHeader className="bg-dark text-white">
              {g.name}
              <div className="float-right d-flex flex-row justify-content-center align-items-center">
                <h5 className="m-1"><Badge color="primary">{g.genre}</Badge></h5>
                <Button onClick={() => deleteGame(g.id)} color="danger" className="m-1"><i class="fas fa-trash"></i></Button>
              </div>
            </CardHeader>
            <CardBody>
              <div>
                <img alt={g.name} src={g.coverImage} style={{ height: '50px', width: '50px' }} />
              </div>
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


  const selectGameForTag = (event, game) => {
    event.preventDefault()
    const newArray = selectedGames.splice(0)
    newArray.push(game)
    setSelectedGames(newArray)
  }

  const removeSelectedGameForTag = (game) => {
    const newSelectedGames = [...selectedGames]
  _.remove(newSelectedGames, function(n) { return n.id == game.id })
  setSelectedGames(newSelectedGames)
  }

  const renderSelectedGames = () => {
    return selectedGames.map(game => {
      return (
        <Badge className="m-1" color="warning">{game.name}
          <Button onClick={() => removeSelectedGameForTag(game)} size="sm" className="ml-2" color="danger">
            <i class="fas fa-minus-circle"></i>
          </Button>
        </Badge>
      )
    })
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

  const handleTagString = (s) => {
    if (s) {
      return s.trim().split(" ").map(i => i[0].toUpperCase() + i.substr(1)).reduce((ac, i) => `${ac} ${i}`);
    }
  }

  return (
    <section className="p-5">
      <Row>
        <Col className="d-flex" sm={6}>
          <Col sm={6}>
            <Card>
              <CardHeader>Add a game</CardHeader>
              <CardBody>
                <Form onSubmit={(e) => handleGameSubmit(e, newGame)}>
                  <FormGroup>
                    <Input onChange={handleGameChange} value={newGame.name} name="name" type="text" placeholder="Game Name" />
                    <Input onChange={handleGameChange} value={newGame.description} className="mt-3" name="description" type="textarea" placeholder="Description" />
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
            <Card>
              <CardHeader>Add a Tag</CardHeader>
              <CardBody>
                <Form onSubmit={(e) => handleGameSubmit(e, newGame)}>
                  <FormGroup>
                    <Input onChange={handleTagChange} value={handleTagString(newTag.name)} name="name" type="text" placeholder="Tag Name" />
                    <CardText className="mt-3 font-weight-bold">Select a game for this tag</CardText>
                    <div>
                      <Searchbar placeholder='Search Game' data={gameList} onSelect={(e, game) => selectGameForTag(e, game)} />
                      {selectedGames && (
                        <div className="mt-3">
                          {renderSelectedGames()}
                        </div>
                      )}
                    </div>
                  </FormGroup>
                  <Button type="submit" block color="primary">Create Tag</Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
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
