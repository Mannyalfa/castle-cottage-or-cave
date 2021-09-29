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
import { searchRentals } from "../utils/API";
import { saveHomeIds, getSavedHomeIds } from "../utils/localStorage";
import { useMutation } from "@apollo/react-hooks";
import { SAVE_HOME } from "../utils/mutations";
import { FaSearch } from "react-icons/fa";
import { saveRecord } from "../utils/idb"

const SearchHomes = () => {
  const [searchedHomes, setSearchedHomes] = useState([]);
  const [city, setCity] = useState("");
  const [stateId, setStateId] = useState("");
  const [bed, setBed] = useState("");
  const [bath, setBath] = useState("");
  const [rent_max, setRentMax] = useState("");
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
      const response = await searchRentals(city, stateId, bed, bath, rent_max);

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
        bath: home.description.baths,
        bath_max: home.description.baths_max,
        bath_min: home.description.baths_min,
        rent: home.list_price,
        rent_max: home.list_price_max,
        rent_min: home.list_price_min,
        pet_policy: home.pet_policy.text,
        href: home.href,
      }));

      setSearchedHomes(homeData);
      setCity("");
      setStateId("");
      setBed("");
      setBath("");
      setRentMax("");
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
      saveRecord(homeToSave.homeId);
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className="text-light bg-transparent">
        <Container>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={10} md={12} lg={12} className="searchBar">
                <Row>
                  <Col xs={8} md={3} className="searchBarElement">
                    <Form.Control
                      name="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      type="text"
                      size="md"
                      placeholder="Enter a City"
                    />
                  </Col>
                  <Col xs={4} md={2} className="searchBarElement">
                    <Form.Control
                      name="stateId"
                      as="select"
                      value={stateId}
                      onChange={(e) => setStateId(e.target.value)}
                      type="text"
                      size="md"
                      placeholder="St"
                    >
                      <option key="blankChoice" value="0">
                        State
                      </option>
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      <option value="AZ">Arizona</option>
                      <option value="AR">Arkansas</option>
                      <option value="CA">California</option>
                      <option value="CO">Colorado</option>
                      <option value="CT">Connecticut</option>
                      <option value="DE">Delaware</option>
                      <option value="DC">District Of Columbia</option>
                      <option value="FL">Florida</option>
                      <option value="GA">Georgia</option>
                      <option value="HI">Hawaii</option>
                      <option value="ID">Idaho</option>
                      <option value="IL">Illinois</option>
                      <option value="IN">Indiana</option>
                      <option value="IA">Iowa</option>
                      <option value="KS">Kansas</option>
                      <option value="KY">Kentucky</option>
                      <option value="LA">Louisiana</option>
                      <option value="ME">Maine</option>
                      <option value="MD">Maryland</option>
                      <option value="MA">Massachusetts</option>
                      <option value="MI">Michigan</option>
                      <option value="MN">Minnesota</option>
                      <option value="MS">Mississippi</option>
                      <option value="MO">Missouri</option>
                      <option value="MT">Montana</option>
                      <option value="NE">Nebraska</option>
                      <option value="NV">Nevada</option>
                      <option value="NH">New Hampshire</option>
                      <option value="NJ">New Jersey</option>
                      <option value="NM">New Mexico</option>
                      <option value="NY">New York</option>
                      <option value="NC">North Carolina</option>
                      <option value="ND">North Dakota</option>
                      <option value="OH">Ohio</option>
                      <option value="OK">Oklahoma</option>
                      <option value="OR">Oregon</option>
                      <option value="PA">Pennsylvania</option>
                      <option value="RI">Rhode Island</option>
                      <option value="SC">South Carolina</option>
                      <option value="SD">South Dakota</option>
                      <option value="TN">Tennessee</option>
                      <option value="TX">Texas</option>
                      <option value="UT">Utah</option>
                      <option value="VT">Vermont</option>
                      <option value="VA">Virginia</option>
                      <option value="WA">Washington</option>
                      <option value="WV">West Virginia</option>
                      <option value="WI">Wisconsin</option>
                      <option value="WY">Wyoming</option>
                    </Form.Control>
                  </Col>
                  <Col xs={3} md={2} className="searchBarElement">
                    <Form.Control
                      name="bed"
                      as="select"
                      value={bed}
                      onChange={(e) => setBed(e.target.value)}
                      type="text"
                      pattern="[0-9]*"
                      size="md"
                      placeholder="Beds"
                    >
                      <option key="blankChoice" value="0">
                        Beds
                      </option>
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5+</option>
                    </Form.Control>
                  </Col>
                  <Col xs={3} md={2} className="searchBarElement">
                    <Form.Control
                      name="bath"
                      as="select"
                      value={bath}
                      onChange={(e) => setBath(e.target.value)}
                      type="text"
                      pattern="[0-9]*"
                      size="md"
                      placeholder="Baths"
                    >
                      <option key="blankChoice" value="0">
                        Baths
                      </option>
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5+</option>
                    </Form.Control>
                  </Col>
                  <Col xs={4} md={2} className="searchBarElement">
                    <Form.Control
                      name="rent_max"
                      pattern="[0-9]*"
                      value={rent_max}
                      onChange={(e) => setRentMax(e.target.value)}
                      type="text"
                      size="md"
                      placeholder="Max Rent"
                    />
                  </Col>
                  <Col xs={1} className="searchBarElement">
                    <Button type="submit" variant="dark" size="md">
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
                    Bedrooms:{" "}
                    {home.bed
                      ? `${home.bed}`
                      : `${home.bed_min} to ${home.bed_max}`}
                  </p>
                  <p className="small">
                    Bathrooms:{" "}
                    {home.bath
                      ? `${home.bath}`
                      : `${home.bath_min} to ${home.bath_max}`}
                  </p>
                  <p className="small">
                    Rent:{" "}
                    {home.rent
                      ? `${home.rent}`
                      : `${home.rent_min} to ${home.rent_max}`}
                  </p>
                  <p>
                    {home.pet_policy ? `Pet Policy: ${home.pet_policy}` : ""}
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
                {error && (
                  <div id="fail">
                    <strong>SAVE FAILED</strong>
                  </div>
                )}
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchHomes;
