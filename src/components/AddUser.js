import { Button, Dropdown, DropdownButton, Form, FormControl } from "react-bootstrap";
import { accountService } from '../services';
import { useHistory } from 'react-router-dom';
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

function AddUser() {
    const [selectedAddress, setSelectedAddress] = useState("");
    const [formData, setFormData] = useReducer(formReducer, {user: "00x0000000000000000000000000000000000000000", role: "User"});
    const history = useHistory();

    useEffect(() => {
        // subscribe to selectedAddress from header component
        const subscription = accountService.getData().subscribe(data => {
            // set account in local state
            setSelectedAddress(data.account);
        });

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

        switch (formData.role) {
            case "User":
                try {
                    const PO = PropertyOwnership(web3, contractAddress);
                    const res = await PO.methods.addNewUser(formData.user).send({
                        from: selectedAddress
                    });
                    window.alert(`New User added.`)
                } catch (err) {
                    window.alert(err.toString().split("!")[0])
                }
                break;
            case "Admin":
                try {
                    const PO = PropertyOwnership(web3, contractAddress);
                    const res = await PO.methods.addNewAdmin(formData.user).send({
                        from: selectedAddress
                    });
                    window.alert(`New Admin added.`)
                } catch (err) {
                    window.alert(err.toString().split("!")[0])
                }
                break;
            case "SuperAdmin":
                try {
                    const PO = PropertyOwnership(web3, contractAddress);
                    const res = await PO.methods.addNewSuperAdmin(formData.user).send({
                        from: selectedAddress
                    });
                    window.alert(`New Super Admin added.`)
                } catch (err) {
                    window.alert(err.toString().split("!")[0])
                }
                break;
            default:
                break;
        }
    }
  
    const handleApproval = async (event) => {
        event.preventDefault();
        try {
            const PO = PropertyOwnership(web3, contractAddress);
            const res = await PO.methods.approveUsers(formData.user).send({
                from: selectedAddress
            });
            window.alert(`User approved.`)
        } catch (err) {
            window.alert(err.toString().split("!")[0])
        }
    }
  
    const handleRejection = async (event) => {
        event.preventDefault();

        switch (formData.role) {
            case "SuperAdmin":
                try {
                    const PO = PropertyOwnership(web3, contractAddress);
                    const res = await PO.methods.removeSuperAdmin(formData.user).send({
                        from: selectedAddress
                    });
                    window.alert(`Super Admin removed with address ${formData.user}.`)
                } catch (err) {
                    console.log(err.toString());
                    window.alert(err.toString().split("!")[0])
                };
                break;
            case "Admin":
                try {
                    const PO = PropertyOwnership(web3, contractAddress);
                    const res = await PO.methods.removeUsers(formData.user).send({
                        from: selectedAddress
                    });
                    window.alert(`Admin removed with address ${formData.user}.`)
                } catch (err) {
                    console.log(err.toString());
                    window.alert(err.toString().split("!")[0])
                };
                break;
            case "User":
                try {
                    const PO = PropertyOwnership(web3, contractAddress);
                    const res = await PO.methods.removeUsers(formData.user).send({
                        from: selectedAddress
                    });
                    window.alert(`User removed with address ${formData.user}.`)
                } catch (err) {
                    console.log(err.toString());
                    window.alert(err.toString().split("!")[0])
                };
                break;
            default:
                break;
        }
        try {
            const PO = PropertyOwnership(web3, contractAddress);
            const res = await PO.methods.approveUsers(formData.user).send({
                from: selectedAddress
            });
            window.alert(`New Super Admin added.`)
        } catch (err) {
            window.alert(err.toString().split("!")[0])
        }
    }

    return (
        <div>
            <button onClick={() => history.goBack()} className='btn btn-dark my-3'>Back</button>
            <center>
                <DropdownButton className="ml-auto" variant="outline-light" title={formData.role} onSelect={(eventKey, e)=>{setFormData({name: e.target.name, value: eventKey})}}>
                    <Dropdown.Item name="role" eventKey='User'>User</Dropdown.Item>
                    <Dropdown.Item name="role" eventKey='Admin'>Admin</Dropdown.Item>
                    <Dropdown.Item name="role" eventKey='SuperAdmin'>Super Admin</Dropdown.Item>
                </DropdownButton>
                <hr />
                <div className="row">
                    <div className="col-6">
                        <Form className="my-3">
                            <Form.Group>
                                <Form.Label>Add {formData.role}</Form.Label>
                                <FormControl name="user" onChange={handleChange} type="text" placeholder="ADDRESS" className="mr-sm-2 my-3 col-6" />
                                <Button onClick={handleSubmit} variant="outline-light">Add</Button>
                            </Form.Group>
                        </Form>
                    </div>
                    <div className="col-6">
                        <Form className="my-3">
                            <Form.Group>
                                <Form.Label>Approve {formData.role}</Form.Label>
                                <FormControl name="user" onChange={handleChange} type="text" placeholder="ADDRESS" className="mr-sm-2 my-3 col-6" />
                                <Button onClick={handleApproval} variant="outline-light">Approve</Button>
                            </Form.Group>
                        </Form>
                    </div>
                    <div className="col-6">
                        <Form className="my-3">
                            <Form.Group>
                                <Form.Label>Remove {formData.role}</Form.Label>
                                <FormControl name="user" onChange={handleChange} type="text" placeholder="ADDRESS" className="mr-sm-2 my-3 col-6" />
                                <Button onClick={handleRejection} variant="outline-light">Remove</Button>
                            </Form.Group>
                        </Form>
                    </div>
                </div>
            </center>
        </div>
    );

}

export default AddUser;
