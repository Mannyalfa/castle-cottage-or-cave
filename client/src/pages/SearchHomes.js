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
import { FaSearch } from "react-icons/fa";
import { CheckResultAndHandleErrors } from "graphql-tools";

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

      const data = await response.json();
      const items = [...data.data.results];

      const homeData = items.map((home) => ({
        homeId: home.property_id,
        address: home.location.address.line,
        city: home.location.address.city,
        state: home.location.address.state_code,
        photo: home.photos[0] ? home.photos[0].href : "",
        bed: home.description.beds,
        bed_max: home.description.beds_max,
        bed_min: home.description.beds_min,
        bath_max: home.description.baths_max,
        bath_min: home.description.baths_min,
        rent_max: home.list_price_max,
        rent_min: home.list_price_min,
        href: home.href,
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
            : "Lets search for your next home"}
        </h2>
        <CardColumns>
          {searchedHomes.map((home) => {
            return (
              <Card key={home.homeId} border="dark">
                {home.photo ? (
                  <Card.Img
                    src={home.photo}
                    alt={`The photo for ${home.address}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>
                    {home.address} {home.city} {home.state}
                  </Card.Title>
                  <p className="small">
                    Bedrooms: {home.bed_min} to {home.bed_max}
                  </p>
                  <p className="small">
                    Bathrooms: {home.bath_min} to {home.bath_max}
                  </p>
                  <p className="small">
                    Rent: {home.rent_min} to {home.rent_max}
                  </p>
                  <Card.Text>
                    <a
                      href={home.href}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      More Info
                    </a>
                  </Card.Text>
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
