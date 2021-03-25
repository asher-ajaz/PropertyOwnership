import { Table, Button, Form, FormControl, Row, Col } from "react-bootstrap";
import { ArrowRight } from 'react-bootstrap-icons';
import { accountService } from '../services';
import { useLocation, useHistory } from 'react-router-dom';
import web3 from '../ethereum/web3Truffle';
import ContractAddresses from "../ethereum/config/deployedAddress.json";
import PropertyOwnership from "../ethereum/instance/PropertyOwnership";
import { useEffect, useReducer, useState } from "react";
const contractAddress = ContractAddresses[0];

const formReducer = (state, event) => {
  return {
    ...state,
    [event.name]: event.value
  }
}

function Property() {
    const [selectedAddress, setSelectedAddress] = useState("");
    const [formData, setFormData] = useReducer(formReducer, {val: "0", owner: "0"});
    const [prop, setProp] = useReducer(formReducer, {id: "0", status: "0", value: "0",
     currOwner: "0x0000000000000000000000000000000000000000", req: 0});
    let location = useLocation();
    const history = useHistory();

    useEffect(() => {
        console.log("Fetching Property")
        // subscribe to selectedAddress from header component
        const subscription = accountService.getData().subscribe(data => {
            // set account in local state
            setSelectedAddress(data.account);
        });

        const getProp = async () => {
            try {
                setProp({name: "id", value: location.id});
                const PO = PropertyOwnership(web3, contractAddress);
                const res = await PO.methods.getPropertyDetails(location.id).call();
                setProp({name: "status", value: res[0]});
                setProp({name: "value", value: res[1]});
                setProp({name: "currOwner", value: res[2]});

                if (res[0] == 2) {
                    try {
                        const PO = PropertyOwnership(web3, contractAddress);
                        let req = await PO.methods.propOwnerChange(location.id).call();
                        if (req != "0x0000000000000000000000000000000000000000") {
                            setProp({name: "req", value: 1})
                        }
                    } catch (err) {
                        console.log(`propOwnerChange call errored: ${err.toString()}`);
                    }
                }
            } catch (err) {
                console.log(`getPropertyDetails call errored: ${err.toString()}`);
            }
        }
        getProp();

        // return unsubscribe method to execute when component unmounts
        return subscription.unsubscribe;
    }, []);
  
    const handleChange = event => {
      setFormData({
        name: event.target.name,
        value: event.target.value
      });
    }
  
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (prop.status == 2) {
            if (formData.owner != 0) {
                try {
                    const PO = PropertyOwnership(web3, contractAddress);
                    const res = await PO.methods.changeOwnership(prop.id, formData.owner).send({
                        from: selectedAddress
                    });
                    window.alert(`Requested change of ownership for property with Id#${prop.id} to address ${formData.owner}.`)
                    setProp({name: "req", value: 1})
                } catch (err) {
                    console.log(JSON.stringify(err).toString());
                    window.alert(err.toString().split("!")[0])
                }
            } else if (formData.val != 0) {
                try {
                    const PO = PropertyOwnership(web3, contractAddress);
                    const res = await PO.methods.changeValue(prop.id, formData.val).send({
                        from: selectedAddress
                    });
                    window.alert(`Value of property with Id#${prop.id} changed to ${formData.val} ETH.`)
                    setProp({name: "value", value: formData.val});
                } catch (err) {
                    console.log(err.toString());
                    window.alert(err.toString().split("!")[0])
                }
            } else if (prop.req != 0) {
                try {
                    const PO = PropertyOwnership(web3, contractAddress);
                    let req = await PO.methods.propOwnerChange(prop.id).call();
                    const res = await PO.methods.approveChangeOwnership(prop.id).send({
                        from: selectedAddress
                    });
                    window.alert(`Change of ownership request approved for property with Id#${prop.id} to address ${req}.`)
                    setProp({name: "req", value: 0})
                    setProp({name: "currOwner", value: req})
                } catch (err) {
                    console.log(err.toString());
                    window.alert(err.toString().split("!")[0])
                }
            } else {
                window.alert(`Insert into required field for a transaction!`)
            }
        }
    }

    const handleApproval = async (event) => {
        event.preventDefault();
        try {
            const PO = PropertyOwnership(web3, contractAddress);
            const res = await PO.methods.approveProperty(prop.id).send({
                from: selectedAddress
            });
            window.alert(`Property with Id#${prop.id} approved.`)
            setProp({name: "status", value: 2});
        } catch (err) {
            window.alert(err.toString().split("!")[0])
        }
    }

    const handleRejection = async (event) => {
        event.preventDefault();
        try {
            const PO = PropertyOwnership(web3, contractAddress);
            const res = await PO.methods.rejectProperty(prop.id).send({
                from: selectedAddress
            });
            window.alert(`Property with Id#${prop.id} rejected.`)
            setProp({name: "status", value: 3});
        } catch (err) {
            window.alert(err.toString().split("!")[0])
        }
    }

    return(
        <div>
            <button onClick={() => history.goBack()} className='btn btn-dark my-3'>Back</button>

            <h3><center>Property Details</center></h3><br/>
            
            <Table striped bordered hover className="my-3 p-3">
                <thead>
                
                    <th>Id</th>
                    <th>Owner's Address</th>
                    <th>Value</th>
                    <th>Status</th>
                
                </thead>
                <tbody>

                    <tr>
                        <td>{prop.id==0 ? "NA" : prop.id}</td>
                        <td>{prop.currOwner=="0x0000000000000000000000000000000000000000" ? "NA" : prop.currOwner}</td>
                        <td>{prop.value==0 ? "NA" : `${prop.value} ETH`}</td>
                        <td>{prop.status==1?"Pending":(prop.status==2?"Approved":(prop.status==3?"Rejected":"NA"))}</td>
                    </tr>
                    
                </tbody>
            </Table>
            
            <center>
                {prop.status == 2 ? (prop.req ?
                <Button onClick={handleSubmit} variant="outline-light">Accept Change of Ownership</Button>
                :
                <div>
                    <Form inline className="my-3 p-3">
                        <Form.Group className="mx-auto" as={Row}>
                            <Form.Label column sm="12">Change Property Value</Form.Label>
                            <Col sm="12">
                                <FormControl name="val" onChange={handleChange} type="text" placeholder="VALUE IN ETHER" className="my-3 col-6" />
                                <Button onClick={handleSubmit} variant="outline-light"><ArrowRight/></Button>
                            </Col>
                        </Form.Group>
                        <Form.Group className="mx-auto" as={Row}>
                            <Form.Label column sm="12">Request Change of Ownership</Form.Label>
                            <Col sm="12">
                                <FormControl name="owner" onChange={handleChange} type="text" placeholder="NEW OWNER'S ADDRESS" className="my-3 col-6" />
                                <Button onClick={handleSubmit} variant="outline-light"><ArrowRight/></Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </div>
                ) :
                (prop.status == 1 ?
                <center>
                    <Form inline className="my-3 p-3">
                        <Button className="col-2 mx-auto" onClick={handleApproval} variant="success">Approve</Button>
                        <Button className="col-2 mx-auto" onClick={handleRejection} variant="danger">Reject</Button>
                    </Form>
                </center>
                :
                <div></div>
                )}
            </center>
        </div>
    );
}

export default Property;
