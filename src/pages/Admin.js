import React, { useState, useEffect } from 'react'
import gql from "graphql-tag"
import { Mutation } from 'react-apollo';
import { useQuery, useMutation } from "@apollo/react-hooks";

import _ from 'lodash'

import escapeHtml from 'escape-html'
import { Node, Text } from 'slate'

import { Spinner, Container, Row, Col, Card, CardHeader, CardBody, FormGroup, Form, Input, Label, Button, CardImg } from 'reactstrap'

import { RichEditor } from '../components/'

import { editorSerialize } from '../utils/EditorSerialize'
import { Editable } from 'slate-react';

// Fragments

const User_Fragment = gql`
  fragment UserFrag on User {
    id
    username
    admin
    email
  }
`;

const Game_Fragment = gql`
  fragment GameFrag on Game {
    id
    name
    description
  }
`

// Queries

const User_Query = gql`
  query users {
    users {
      ...UserFrag
    }
  }
  ${User_Fragment}
`

const Game_Query = gql`
  query games {
    games {
      ...GameFrag
    }
  }
  ${Game_Fragment}
`

// Mutations

// We are simply creating a game with a name so we return an ID to further instantly edit the game
const CREATE_NEW_GAME = gql`
  mutation createNewGame($createGame: CreateGameInput!) {
    createGame(input: $createGame) {
      ... on Game {
        id
        name
      }
      ... on Error {
        message
      }
    }
  }
`

const UPLOAD_FILE = gql`
  mutation fileUpload($file: Upload!) {
    fileUpload(file: $file) {
      ...on File {
        id
        url
        filename
        mimetype
        encoding
      }
      ... on Error {
        message
      }
    }
  }
`

/// For game creation, as soon as you enter in a game name it should instantly save and create an ID for the game, then retrieve all the info,
// and act as an edit for the game. Add anotther game boolean "Published" and flip it to true once `Publish` button is pressed. 
// Game lists would only render published games. 

const Admin = () => {
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState()
  const [games, setGames] = useState()
  const [userCount, setUserCount] = useState()
  const [gameCount, setGameCount] = useState(0)
  const [tags, setTags] = useState([])
  const [genres, setGenres] = useState([])
  const [newGame, setNewGame] = useState({ name: null })
  const [editGame, setEditGame] = useState({
    id: null,
    name: null,
    description: null,
  })
  const [newFile, setNewFile] = useState({
    file: null,
    url: null,
    game_id: null
  })
  const [filePreview, setFilePreview] = useState()

  // Editor
  const [editorDescription, setEditorDescription] = useState()

  // useMutations
  const [createdGame] = useMutation(CREATE_NEW_GAME)
  const [uploadFile] = useMutation(UPLOAD_FILE, {
    onCompleted: data => data
  })

  const resolveQueries = () => {
    const users = useQuery(User_Query)
    const games = useQuery(Game_Query)
    return {
      userResponse: users,
      gameResponse: games
    }
  }

  const response = resolveQueries()

  useEffect(() => {
    setUsers(response.userResponse.data)
    setGames(response.gameResponse.data)
  }, [response])

  useEffect(() => {
    const nonAdmins = users?.users.filter(user => !user.admin)
    setUserCount(nonAdmins?.length)
    setGameCount(games?.games.length)
  }, [users, games])

  useEffect(() => {
    const data = response.gameResponse.data
    const foundGame = data?.games.filter(g => {
      if (g.name === newGame.name) {
        return g
      }
    })
    if (foundGame) {
      let abstractedGame = foundGame[0]
      setEditGame({
        id: abstractedGame?.id,
        name: abstractedGame?.name
      })
      // Reset new game
      setNewGame({
        name: '',
      })
      setLoading(false)
    }
  }, [response.gameResponse])

  const handleGameOnChange = event => {
    event.preventDefault()
    setNewGame({
      ...newGame,
      [event.target.name]: event.target.value
    })
  }

  const handleGameNameSubmit = async (e, input) => {
    e.preventDefault();
    const created = await createdGame({
      variables: { createGame: { name: input.name } }
    })

    if (created) {
      response.gameResponse.refetch()
    }
    setLoading(true)
  }

  // Uploading
  const handleFile = async ( event ) => {

    const {
      target: {
        validity,
        files: [file],
      }
    } = event

    if (validity.valid) {
     const uploaded = await uploadFile({
        variables: { file }
      })

      const { data } = uploaded
      setFilePreview(`${data.fileUpload.url}`)
    }
  }

  const UploadFile = () => {
    return (
      <Input type="file" required onChange={event => handleFile(event)} />
    )
  }

  // Tags
  const removeTags = indexToRemove => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)]);
  };

  const addTags = event => {
    if (
      event.target.value !== "" &&
      tags.find(tag => tag === event.target.value) == null
    ) {
      setTags([...tags, event.target.value]);
    }
    event.target.value = "";
  }

  // Genres
  const removeGenres = indexToRemove => {
    setGenres([...genres.filter((_, index) => index !== indexToRemove)]);
  };

  const addGenres = event => {
    if (
      event.target.value !== "" &&
      genres.find(genre => genre === event.target.value) == null
    ) {
      setGenres([...genres, event.target.value]);
    }
    event.target.value = "";
  }

  const handleBuildSubmit = (event) => {
    event.preventDefault()

    const serialized = editorSerialize(editorDescription)

    if (serialized) {
      setEditorDescription(serialized)
    }
  }

  return (
    <section style={{ background: 'rgba(20, 34, 64, 0.5)', color: '#F2D98D' }} className="w-100">
      <Container>
        <Row>
          <Col sm={12} className="p-5">
            <Row>
              <Col className="d-flex flex-column justify-content-center align-items-center">
                <span># Of Games</span>
                <div className="ana-box">{gameCount}</div>
              </Col>
              <Col className="d-flex flex-column justify-content-center align-items-center">
                <span># Of Users</span>
                <div className="ana-box">{userCount}</div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <hr style={{ display: 'block', height: '1.5px', border: 0, borderTop: '1px solid #142240', padding: 0 }} className="py-2 w-50" />
      <Container>
        <Row>
          <Col sm={12} className="text-center py-3">
            <h3>Game Creation</h3>
            {editGame.id && (
              <h4><span style={{ color: '#D9308D' }} className="font-weight-bolder my-3">[Unpublished]</span> {editGame.name}</h4>
            )}
          </Col>
        </Row>
      </Container>
      <Row className="p-3">
        {!editGame.id && (
          <Col sm={12} style={{ color: '#F2D98D' }} className="d-flex justify-content-center align-items-center">
            <Card style={{ background: '#142240' }} className="w-50 text-center rounded shadow">
              <CardBody>
                <Form onSubmit={(e) => handleGameNameSubmit(e, newGame)} className="d-flex flex-column justify-content-center align-items-center">
                  <FormGroup className="w-50">
                    <h4 className="py-2">What is the name for this game?</h4>
                    <Input className="my-2" onChange={handleGameOnChange} value={newGame.name} name="name" type="text" placeholder="Game Name" />
                  </FormGroup>
                  <Button className="w-50 g-btn" type="submit">Build Game Template</Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        )}
        {editGame.id && (
          <>
            {loading ? <Spinner style={{ width: '3rem', height: '3rem' }} color="primary" /> : (
              <Col sm={12} style={{ color: '#F2D98D' }} className="d-flex justify-content-center align-items-center">
                <Card style={{ background: '#142240' }} className="w-75 rounded shadow">
                  <CardBody>
                    <Form className="d-flex flex-column justify-content-center align-items-center">
                      <FormGroup className="w-50">
                        <h4 className="text-center">Game Name</h4>
                        <Input className="my-2" value={editGame.name} name="name" type="text" />
                        <RichEditor setEditorDescription={setEditorDescription} />
                        <Card style={{  background: '#142240'  }} className="my-4">
                          {filePreview && (
                          <CardImg top src={filePreview} alt="Image" />
                          )}
                          <CardBody>
                            <h5 className="mb-3">Add Cover Image</h5>
                            {UploadFile()}
                          </CardBody>
                        </Card>
                        <Card style={{ background: '#142240' }}>
                          <CardBody>
                             <h6>Add Carousel Images</h6>
                            <Row>
                              <Col sm={3}>
                                <Card style={{ minHeight: 144 }}>
                                  <CardBody className="d-flex justify-content-center align-items-center">
                                  <i class="fas fa-3x fa-plus-circle"></i>
                                  </CardBody>
                                </Card>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </FormGroup>
                      <Button className="w-50 g-btn" onClick={handleBuildSubmit}>Publish</Button>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            )}
          </>
        )}
        {/* <Col sm={4}>
          <Card className="bg-transparent">
            <CardHeader style={{ background: '#142240', color: '#F2D98D' }} className="text-center">PLAYternative Tags</CardHeader>
            <CardBody>
              <div className="tag-input">
                <ul id="tags">
                  {tags.map((tag, index) => (
                    <li key={index} className="tag">
                      <span>#{tag}</span>
                      <i className="fas fa-times tag-close-icon ml-2" onClick={() => removeTags(index)}></i>
                    </li>
                  ))}
                </ul>
                <Input
                  className="bg-transparent"
                  type="text"
                  onKeyUp={event => (event.key === "Enter" ? addTags(event) : null)}
                  placeholder="Press enter to add more tags"
                />
              </div>
            </CardBody>
          </Card>
          <Card className="bg-transparent mt-3">
            <CardHeader style={{ background: '#142240', color: '#F2D98D' }} className="text-center">PLAYternative Genres</CardHeader>
            <CardBody>
              <div className="tag-input">
                <ul id="tags">
                  {genres.map((genre, index) => (
                    <li key={index} className="tag">
                      <span>{genre}</span>
                      <i className="fas fa-times tag-close-icon ml-2" onClick={() => removeGenres(index)}></i>
                    </li>
                  ))}
                </ul>
                <Input
                  className="bg-transparent"
                  type="text"
                  onKeyUp={event => (event.key === "Enter" ? addGenres(event) : null)}
                  placeholder="Press enter to add more genres"
                />
              </div>
            </CardBody>
          </Card>
        </Col> */}
      </Row>
    </section>
  )
}

export default Admin