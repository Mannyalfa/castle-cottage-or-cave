import React from "react";
import { Jumbotron, Container } from "react-bootstrap";

function Home() {
    return (
        <Jumbotron fluid className="text-light bg-transparent">
            <Container>
                <div className="col-lg-12 h-100 d-table" id="tagline">
                    <br></br>
                    <br></br>
                <img src="https://fontmeme.com/permalink/210923/d4829f7ede0d5fc27d8985a35ab55b11.png" alt="its-time-to-come-home" border="0"></img>                </div>
            </Container>
        </Jumbotron>
    );
};

export default Home;

