import React, { useEffect, useState, useReducer } from 'react';
import { useHistory } from 'react-router-dom';
import { accountService } from '../services';
import { Form, FormControl, Button } from "react-bootstrap";
import web3 from '../ethereum/web3Truffle';
import ContractAddresses from "../ethereum/config/deployedAddress.json";
import PropertyOwnership from "../ethereum/instance/PropertyOwnership";
const contractAddress = ContractAddresses[0];

const formReducer = (state, event) => {
  return {
    ...state,
    [event.name]: event.value
  }
}

function AddProperty() {
    const [selectedAddress, setSelectedAddress] = useState("");
    const [formData, setFormData] = useReducer(formReducer, {val: '', owner: ''});
    const history = useHistory();

    useEffect(() => {
        // subscribe to selectedAddress from header component
        const accSubscription = accountService.getData().subscribe(data => {
            // set account in local state
            setSelectedAddress(data.account);
        });

        // return unsubscribe method to execute when component unmounts
        return accSubscription.unsubscribe;
    }, []);
  
    const handleChange = event => {
      setFormData({
        name: event.target.name,
        value: event.target.value
      });
    }
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
          const PO = PropertyOwnership(web3, contractAddress);
          const propId = await PO.methods.propId().call();
          const res = await PO.methods.createProperty(formData.val, formData.owner).send({
              from: selectedAddress
          });
          window.alert(`New property registered with Id#${propId}.`)
      } catch (err) {
          window.alert(err.toString().split("!")[0])
      }
    }

    return (
        <div>
            <button onClick={() => history.goBack()} className='btn btn-dark my-3'>Back</button>
            <center>
                <Form className="my-3 p-3">
                    <FormControl name="val" onChange={handleChange} type="text" placeholder="VALUE IN ETHER" className="mr-sm-2 my-3 col-6" />
                    <FormControl name="owner" onChange={handleChange} type="text" placeholder="OWNER'S ADDRESS" className="mr-sm-2 my-3 col-6" />
                    <Button onClick={handleSubmit} variant="outline-light">Submit</Button>
                </Form>
            </center>
        </div>
    );
}

export default AddProperty;
