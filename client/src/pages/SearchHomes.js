import React, { useState, useEffect } from "react";
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from "react-bootstrap";
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
      const data = await response.json()
      const homeResults= [ ...data.data.results];
 
      const homes = homeResults.map((home) => ({
        address: home.location.address.line,
        photo: home.photo[0] ? home.photo[0].href :"",
        bed: home.description.beds,
        bed_max: home.description.beds_max,
        bed_min: home.description.beds_min,
        bath_max: home.description.baths_max,
        bath_min: home.description.baths_min,
        rent_max: home.list_price_max,
        rent_min: home.list_price_min,
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
        <div>
          </div>
          
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={6}>
                <Form.Control
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="--Search Parameter Input--"
                />
                <Form.Control
                  name="stateId"
                  value={stateId}
                  onChange={(e) => setStateId(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="--Search Parameter Input--"
                />
              </Col>
              <Col xs={12} md={2}>
                <Button type="submit" variant="dark" size="lg">
                  <FaSearch/>
                </Button>
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
