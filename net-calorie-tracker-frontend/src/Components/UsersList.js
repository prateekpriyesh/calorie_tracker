import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NewUserEntryModal from "./NewUserEntryModal";

const UsersList = () => {
  const [userData, setUserData] = useState([]);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get("http://localhost:5000/api/users");
      setUserData(response.data);
    };
    fetchUsers();
  }, []);

  const onDelete = async id => {
    await axios.delete(`http://localhost:5000/api/users/${id}`);
    setUserData(userData.filter(user => user._id !== id));
  };

  const onNewUserEntry = async newUser => {
    const response = await axios.post(
      "http://localhost:5000/api/users",
      newUser
    );
    setUserData([...userData, response.data]);
  };

  const onView = id => {
    navigate(`/userDetail/${id}`);
  };

  return (
    <div>
      <h2>Users List</h2>
      <button onClick={() => setShowNewUserModal(true)}>Add New User</button>
      {userData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Weight</th>
              <th>Height</th>
              <th>Sex</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userData.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.weight}</td>
                <td>{user.height}</td>
                <td>{user.sex}</td>
                <td>{user.age}</td>
                <td>
                  <button onClick={() => onView(user._id)}>View</button>
                  <button onClick={() => onDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found</p>
      )}
      {showNewUserModal && (
        <NewUserEntryModal
          onSubmit={onNewUserEntry}
          onClose={() => setShowNewUserModal(false)}
        />
      )}
    </div>
  );
};

export default UsersList;
