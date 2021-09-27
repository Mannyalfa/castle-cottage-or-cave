import React, { useState, useEffect } from "react";
import {
  Jumbotron,
  Container,
  Col,
  Form,
  Button,
  Card,
  CardColumns,
  Row,
} from "react-bootstrap";
import Auth from "../utils/auth";
import { saveHome, searchRentals } from "../utils/API";
import { saveHomeIds, getSavedHomeIds } from "../utils/localStorage";
import { useMutation } from "@apollo/react-hooks";
import { SAVE_HOME } from "../utils/mutations";
import { FaSearch } from 'react-icons/fa';

const SearchHomes = () => {
  const [searchedHomes, setSearchedHomes] = useState([]);
  const [city, setCity] = useState("");
  const [stateId, setStateId] = useState("");
  const [saveHome, { error }] = useMutation(SAVE_HOME);
  const [savedHomeIds, setSavedHomeIds] = useState(getSavedHomeIds());

  useEffect(() => {
    return () => saveHomeIds(savedHomeIds);
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!city && !stateId) {
      return false;
    }

    try {
      const response = await searchRentals(city, stateId);
      if (!response.ok) {
        throw new Error("something went wrong!");
      }
      const data = await response.json();
      console.log(
        data.data.results[0].description,
        data.data.results[0].location
      );

      const { items } = await response.json();
      const homeData = items.map((home) => ({
        homeId: home.id,
        authors: home.volumeInfo.authors || ["No author to display"],
        title: home.volumeInfo.title,
        description: home.volumeInfo.description,
        image: home.volumeInfo.imageLinks?.thumbnail || "",
      }));

      setSearchedHomes(homeData);
      setCity("");
      setStateId("");
    } catch (err) {
      console.error(err);
    }
  };


  const handleSaveHome = async (homeId) => {
    const homeToSave = searchedHomes.find((home) => home.homeId === homeId);

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await saveHome({
        variables: { body: homeToSave },
      });

      setSavedHomeIds([...savedHomeIds, homeToSave.homeId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className="text-light bg-transparent">
        <Container>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={6} className="searchBar">
                <Row>
                  <Col xs={12} md={7} className="searchBarElement">
                    <Form.Control
                      name="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      type="text"
                      size="lg"
                      placeholder="City"
                    />
                  </Col>
                  <Col xs={12} md={3} className="searchBarElement">
                    <Form.Control
                      name="stateId"
                      value={stateId}
                      onChange={(e) => setStateId(e.target.value)}
                      type="text"
                      size="lg"
                      placeholder="State"
                    />
                  </Col>
                  <Col xs={12} md={2} className="searchBarElement">
                    <Button type="submit" variant="dark" size="lg">
                      <FaSearch />
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedHomes.length
            ? `Viewing ${searchedHomes.length} results:`
            : "Lets search for you next home"}
        </h2>
        <CardColumns>
          {searchedHomes.map((home) => {
            return (
              <Card key={home.homeId} border="dark">
                {home.image ? (
                  <Card.Img
                    src={home.image}
                    alt={`The cover for ${home.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{home.title}</Card.Title>
                  <p className="small">Authors: {home.authors}</p>
                  <Card.Text>{home.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedHomeIds?.some(
                        (savedHomeId) => savedHomeId === home.homeId
                      )}
                      className="btn-block btn-info"
                      onClick={() => handleSaveHome(home.homeId)}
                    >
                      {savedHomeIds?.some(
                        (savedHomeId) => savedHomeId === home.homeId
                      )
                        ? "SAVED IN YOUR HOMES"
                        : "SAVE"}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchHomes;
