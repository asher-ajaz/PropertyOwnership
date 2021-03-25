// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.2;

contract PropertyOwnership {

    address public creatorAdmin;
    uint public propId;
	enum Status { NotExist, Pending, Approved, Rejected }

	struct PropertyDetail {
		Status status;
		uint value;
		address currOwner;
	}

	// Dictionary of all the properties, mapped using their { propertyId: PropertyDetail } pair.
	mapping(uint => PropertyDetail) public properties;
	mapping(uint => address) public propOwnerChange;

    mapping(address => int) public users;
    mapping(address => bool) public verifiedUsers;

	modifier onlyOwner(uint _propId) {
		require(properties[_propId].currOwner == msg.sender, "Owner is authorized for this transaction only!");
		_;
	}

	modifier verifiedUser(address _user) {
	    require(verifiedUsers[_user], "Owner must be a verified user!");
	    _;
	}

	modifier verifiedAdmin() {
		require(users[msg.sender] >= 2 && verifiedUsers[msg.sender], "Super Admin and Admin are authorized for this transaction!");
		_;
	}

	modifier verifiedSuperAdmin() {
	    require(users[msg.sender] == 3 && verifiedUsers[msg.sender], "Super Admin is authorized for this transaction only!");
	    _;
	}

	// Initializing the User Contract.
	constructor() {
	    propId = 1;
		creatorAdmin = msg.sender;
		users[creatorAdmin] = 3;
		verifiedUsers[creatorAdmin] = true;
	}

	// Create a new Property.
	function createProperty(uint _value, address _owner) public verifiedAdmin verifiedUser(_owner) returns (uint) {
		properties[propId] = PropertyDetail(Status.Pending, _value, _owner);
		uint id = propId;
		propId++;
		return id;
	}

	// Approve the new Property.
	function approveProperty(uint _propId) public verifiedSuperAdmin returns (bool){
		require(properties[_propId].currOwner != msg.sender, "Owner of a property is not allowed to approve it!");
		properties[_propId].status = Status.Approved;
		return true;
	}

	// Reject the new Property.
	function rejectProperty(uint _propId) public verifiedSuperAdmin returns (bool){
		require(properties[_propId].currOwner != msg.sender, "Owner of a property is not allowed to reject it!");
		properties[_propId].status = Status.Rejected;
		return true;
	}

	// Request Change of Ownership.
	function changeOwnership(uint _propId, address _newOwner) public onlyOwner(_propId) verifiedUser(_newOwner) returns (bool) {
		require(properties[_propId].currOwner != _newOwner, "New owner's address must differ from current owner's address!");
		require(propOwnerChange[_propId] == address(0), "This property already has a pending change of ownership request!");
		propOwnerChange[_propId] = _newOwner;
		return true;
	}

	// Approve change in Onwership.
	function approveChangeOwnership(uint _propId) public verifiedSuperAdmin returns (bool) {
	    require(propOwnerChange[_propId] != address(0), "A change of ownership is not requested for this property!");
	    properties[_propId].currOwner = propOwnerChange[_propId];
	    propOwnerChange[_propId] = address(0);
	    return true;
	}

	// Change the price of the property.
    function changeValue(uint _propId, uint _newValue) public onlyOwner(_propId) returns (bool) {
        require(propOwnerChange[_propId] == address(0), "This property has a pending change of ownership request!");
        properties[_propId].value = _newValue;
        return true;
    }

	// Get a property's details.
	function getPropertyDetails(uint _propId) public view returns (Status, uint, address) {
		return (properties[_propId].status, properties[_propId].value, properties[_propId].currOwner);
	}
	
	// Get all properties details.
	function getProperties() public view returns (Status[] memory, uint[] memory, address[] memory) {
        Status[] memory statuses = new Status[](propId);
        uint[] memory values = new uint[](propId);
	    address[] memory owners = new address[](propId);
        
        for (uint i = 0; i < propId; i++) {
            statuses[i] = properties[i].status;
            values[i] = properties[i].value;
            owners[i] = properties[i].currOwner;
        }
        
        return (statuses, values, owners);
	}

	// Add new user.
	function addNewUser(address _newUser) public verifiedAdmin returns (bool) {
	    require(users[_newUser] == 0, "User exists already!");
	    users[_newUser] = 1;
	    return true;
	}

	// Add new Admin.
	function addNewAdmin(address _newAdmin) public verifiedSuperAdmin returns (bool) {
	    require(users[_newAdmin] != 3, "User is a Super Admin!");
	    require(users[_newAdmin] < 2, "User is an Admin already!");
	    users[_newAdmin] = 2;
	    return true;
	}

	// Add new SuperAdmin.
	function addNewSuperAdmin(address _newSuperAdmin) public verifiedSuperAdmin returns (bool) {
	    require(creatorAdmin == msg.sender, "Creator Admin is authorized for this transaction only!");
	    require(users[_newSuperAdmin] < 3, "User is authorized as Super Admin already!");
	    users[_newSuperAdmin] = 3;
	    return true;
	}
	
	// Remove User or Admin.
	function removeUsers(address user) public verifiedSuperAdmin returns (bool) {
	    require(users[user] != 3, "User is a Super Admin!");
	    require(users[user] != 0, "User doesn't exist!");
	    users[user] = 0;
	    verifiedUsers[user] = false;
	    return true;
	}
	
	// Remove Super Admin.
	function removeSuperAdmin(address user) public verifiedSuperAdmin returns (bool) {
	    require(creatorAdmin == msg.sender, "Creator Admin is authorized for this transaction only!");
	    require(users[user] == 3, "User is not a Super Admin!");
	    require(users[user] != 0, "User doesn't exist!");
	    users[user] = 0;
	    verifiedUsers[user] = false;
	    return true;
	}

	// Approve User.
	function approveUsers(address _newUser) public verifiedSuperAdmin returns (bool) {
	    require(users[_newUser] != 0, "A request is not made for this user!");
	    verifiedUsers[_newUser] = true;
	    return true;
	}
}
