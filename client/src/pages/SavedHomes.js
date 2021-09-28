import React from "react";
import { Jumbotron, Container, CardColumns, Card, Button } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_ME } from "../utils/queries";
import { REMOVE_HOME } from "../utils/mutations";
import Auth from "../utils/auth";
import { removeHomeId } from "../utils/localStorage";

const SavedHomes = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeHome, { error }] = useMutation(REMOVE_HOME);
  const userData = data?.me || {};

  const handleDeleteHome = async (homeId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeHome({ variables: { homeId: homeId } });


      removeHomeId(homeId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>Just a sec...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className="text-light bg-transparent">
        <Container>
          <div id="listing" ></div>
          <h1>Your saved listings</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedHomes.length
            ? `You have ${userData.savedHomes.length} saved ${
                userData.savedHomes.length === 1 ? "home" : "homes"
              }:`
            : "You have no saved homes"}
        </h2>
        <CardColumns>
          {userData.savedHomes.map((home) => {
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
                    Bedrooms: {home.bed ? `${home.bed}` : `${home.bed_min} to ${home.bed_max}`}
                  </p>
                  <p className="small">
                    Bathrooms: {home.bath ? `${home.bath}` : `${home.bath_min} to ${home.bath_max}`}
                  </p>
                  <p className="small">
                    Rent: {home.rent ? `${home.rent}` : `${home.rent_min} to ${home.rent_max}`}
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
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteHome(home.homeId)}
                  >
                    Delete
                  </Button>
                </Card.Body>
                {error && <div>Delete failed</div>}
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedHomes;
