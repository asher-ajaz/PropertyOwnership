import React from 'react'
import {Container} from 'react-bootstrap';
import {BrowserRouter as Router, Route} from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import AddUser from "./components/AddUser"
import AddProperty from "./components/AddProperty"
import Properties from "./components/Properties"
import Property from "./components/Property"

function App() {
  return (
    <Router>
      <Header/>
      <main className="py-3">
        <Container>
          <Route path="/" component={Properties} exact/>
          <Route path="/property" component={Property} exact/>
          <Route path="/add/property" component={AddProperty} exact/>
          <Route path="/add/user" component={AddUser} exact/>
        </Container>
      </main>
      <Footer/>
    </Router>
  );
}

export default App;
