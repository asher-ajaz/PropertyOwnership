import React, {useState, useEffect} from 'react'
import { Table } from "react-bootstrap";
import {Link} from'react-router-dom'
import web3 from '../ethereum/web3Truffle';
import ContractAddresses from "../ethereum/config/deployedAddress.json";
import PropertyOwnership from "../ethereum/instance/PropertyOwnership";
const contractAddress = ContractAddresses[0];

function Properties() {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        const fetchProperties = async () => {
            console.log("Fetching Properties")
            try {
                const PO = PropertyOwnership(web3, contractAddress);
                const res = await PO.methods.getProperties().call();
                let propertiesArr = []
                for (let i = 1; i < res[0].length; i++) {
                    const propertiesObj = {
                        status: res[0][i],
                        value: res[1][i],
                        currOwner: res[2][i]
                    }
                    propertiesArr.push(propertiesObj)
                }
                setProperties(propertiesArr);
            } catch (err) {
                console.log(err);
            }
        }

        fetchProperties();
    }, [])
    
    return(
        <div>
            <h2 className="my-3 p-3"><center>Registered Properties</center></h2>
            
            <Table striped bordered hover className="my-3 p-3">
                <thead>
                
                    <th>Id</th>
                    <th>Owner's Address</th>
                    <th>Value</th>
                    <th>Status</th>
                
                </thead>
                <tbody>

                    {properties.map((property)=>(
                        <tr>
                            <td><Link to={{pathname:'/property', id: properties.indexOf(property)+1}}>{properties.indexOf(property)+1}</Link></td>
                            <td><Link to={{pathname:'/property', id: properties.indexOf(property)+1}}>{property.currOwner}</Link></td>
                            <td><Link to={{pathname:'/property', id: properties.indexOf(property)+1}}>{`${property.value} ETH`}</Link></td>
                            <td><Link to={{pathname:'/property', id: properties.indexOf(property)+1}}>{property.status==1?"Pending":(property.status==2?"Approved":(property.status==3?"Rejected":"NA"))}</Link></td>
                        </tr>
                    ))}
                    
                </tbody>
            </Table>

        </div>
    );
}

export default Properties;
