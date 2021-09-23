import React, { useState, useEffect } from "react";
import { Jumbotron, Container, CardColumns, Card, Button } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";
import { getMe, deleteBook } from "../utils/API";
import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";
const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);
  const userData = data?.me || {};
  const userDataLength = Object.keys(userData).length;

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({ variables: { bookId: bookId } });


      removeBookId(bookId);
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
        <div id="listing">
          </div>
          <h1>Your saved listings</h1>
        </Container>
      </Jumbotron>
      <Container>
      <h2>
          {userData.savedBooks.length
            ? `You have ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "home" : "homes"
              }:`
            : "You have no saved homes"}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;