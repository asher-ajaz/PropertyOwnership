# PropertyOwnership

**Different Operations In the App**

**1.Intialising Contract**

**Output**

- msg.sender is made as creatorAdmin
- msg.sender is made as superAdmin
- msg.sender is made as verified user

**2.Create a new Property.**

**parameters**

- CreateProperty- property Id, propoerty value, property owner address

**prerequisites**

- msg.sender should be admin
- property owner should be verified user

**Output**

 mark property Id, Status as Pending, propoerty value, property owner address

**3.Approve the new Property.**

**parameters**

- approveProperty- property Id

**prerequisites**

- msg.sender should be superadmin
- current owner should not be msg.sender

**Output**

mark property Satus as Approved

**4.Reject the new Property.**

**parameters**

- rejectProperty- property Id

**prerequisites**

- msg.sender should be superadmin
- current owner should not be msg.sender

**Output** 

Mark property Satus as Rejected

**5. Request Change of Ownership.**

**parameters**

- changeOwnership- property Id, new owner address

**prerequisites**

- msg.sender should be the current owner
- new owner should be verified user
- current owner is not the new owner
- No pending ownership change request should exist.

**Output**

mark property Ownership change request

**6.Approve change in Onwership.**

**parameters**

- ApproveChangeOwnership- property Id

**prerequisites**

- msg.sender should be superadmin
- ownership change request must exist

**Output**

mark new owner address as current owner

**7.Change the price of the property.**

**parameters**

- changeValue- propoerty Id, new property value

**prerequisites**

- msg.sender should be the current owner
- No pending ownership change request should exist.

**Output**

change property value

**8.Get the property details.**

**parameters**

- GetPropertyDetails- propoerty Id

**Output**

Status, propoerty value, property owner address

**9.Add new user.**

**parameters**

- addNewUser- address

**prerequisites**

- msg.sender should be admin
- No pending request for the address should exist.(user or admin or superadmin)
- address should not be a verified user.(user or admin or superadmin)

**Output**
mark address as user

**10.Add new admin.**

**parameters**

- AddNewAdmin- address

**prerequisites**

- msg.sender should be superadmin
- No pending request for the address should exist.(user or admin or superadmin)
- address should not be a verified user.(user or admin or superadmin)

**Output**

mark address as Admin

**11.Add new SuperAdmin**

**parameters**

- addNewSuperAdmin- address

**prerequisites**

- msg.sender should be superadmin
- No pending request for the address should exist.(user or admin or superadmin)
- address should not be a verified user.(user or admin or superadmin)

**Output**

mark address as SuperAdmin

**12. Approve Pending User.**

**parameters**

- approveUsers- address

**prerequisites**

- msg.sender should be superadmin
- Pending request should exist for address

**Output**

mark address as Verified user
