import React from 'react'
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
    return (
        <footer>
            <Container>

                <Row>
                    <Col className="text-center py-4">
                        Property Ownership &copy; registry
                    </Col>
                </Row>
                
            </Container>
        </footer>
    )
}

export default Footer
