import React, { useState, useEffect } from 'react';
import {Link} from'react-router-dom';
import web3 from '../ethereum/web3Truffle';
import { accountService } from '../services';
import { Container, Form, FormControl, Nav, Navbar, Dropdown, DropdownButton, Row, Col, Tooltip, OverlayTrigger } from "react-bootstrap";
import { Clipboard } from 'react-bootstrap-icons';

const Header = () => {
  const [addresses, setAddresses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [id, setId] = useState("");

  useEffect(() => { // gets called at only first time render of react application.
    async function fetchData() {
      const accounts = await web3.eth.getAccounts();
      setAddresses(accounts);
      setSelectedAddress(accounts[0]);
      accountService.setData(selectedAddress);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const accountsBalance = []
      for (let i = 0; i < addresses.length; i++) {
        let balance = await web3.eth.getBalance(addresses[i]);
        balance = Number(web3.utils.fromWei(balance)).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 5});
        accountsBalance.push(balance)
      }
      setBalances(accountsBalance)
    }
    fetchData();
  }, [selectedAddress]);
  
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Copy to clipboard
    </Tooltip>
  );

  return (
    <header>
      <Navbar bg="dark"  variant="dark" expand="lg" collapseOnSelect>
        
          <Container>
            <Navbar.Brand className="btn-dark" href="/">Property Ownership</Navbar.Brand>
            <Nav.Item>
              <Nav.Link as={Link} to={'/add/user'}>Add User</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to={'/add/property'}>Add Property</Nav.Link>
            </Nav.Item>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Form inline className="ml-auto">
                <FormControl name="inp" onChange={e => {setId(e.target.value);}} type="text" placeholder="Property Id" className="mr-sm-2" />
                <Link className="btn btn-dark my-1" to={{pathname:'/property', id: id}}>{`Search`}</Link>
              </Form>
              <DropdownButton className="mx-1 my-1" variant="dark" title={`Account ${addresses.indexOf(selectedAddress)+1}`} onSelect={ eventKey => { setSelectedAddress(eventKey); accountService.setData(selectedAddress); } }>
                {addresses.map((value, index) => <Dropdown.Item name={index} eventKey={value}><Row><Col sm="10">{`Account ${index+1}`} <br/> {`${balances[index]} ETH`}</Col><OverlayTrigger placement="right" overlay={renderTooltip}><Clipboard className="my-auto" onClick={e=>navigator.clipboard.writeText(value)}/></OverlayTrigger></Row></Dropdown.Item>)}
              </DropdownButton>
            </Navbar.Collapse>
          </Container>
      
      </Navbar>
    </header>
  );
};

export default Header;
