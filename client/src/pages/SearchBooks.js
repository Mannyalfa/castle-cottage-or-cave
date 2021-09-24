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
import { saveBook, searchRentals } from "../utils/API";
import { saveBookIds, getSavedBookIds } from "../utils/localStorage";
import { useMutation } from "@apollo/react-hooks";
import { SAVE_BOOK } from "../utils/mutations";
import { FaSearch } from "react-icons/fa";

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [city, setCity] = useState("");
  const [stateId, setStateId] = useState("");
  const [saveBook, { error }] = useMutation(SAVE_BOOK);
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  useEffect(() => {
    return () => saveBookIds(savedBookIds);
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
      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ["No author to display"],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || "",
      }));

      setSearchedBooks(bookData);
      setCity("");
      setStateId("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBook = async (bookId) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await saveBook({
        variables: { body: bookToSave },
      });

      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
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
              <Col xs={12} md={6}>
                <Row>
                  <Col xs={12} md={4}>
                    <Form.Control
                      name="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      type="text"
                      size="lg"
                      placeholder="City"
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Control
                      name="stateId"
                      value={stateId}
                      onChange={(e) => setStateId(e.target.value)}
                      type="text"
                      size="lg"
                      placeholder="State"
                    />
                  </Col>
                </Row>
              </Col>
              <Col>
                <Button type="submit" variant="dark" size="lg">
                  <FaSearch />
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : "Lets search for you next home"}
        </h2>
        <CardColumns>
          {searchedBooks.map((book) => {
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
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedBookIds?.some(
                        (savedBookId) => savedBookId === book.bookId
                      )}
                      className="btn-block btn-info"
                      onClick={() => handleSaveBook(book.bookId)}
                    >
                      {savedBookIds?.some(
                        (savedBookId) => savedBookId === book.bookId
                      )
                        ? "SAVED IN YOUR BOOKS"
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

export default SearchBooks;
