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
      const usersWithBMR = response.data.map(user => ({
        ...user,
        bmr: calculateBMR(user) // Calculate BMR for each user
      }));
      setUserData(usersWithBMR);
    };
    fetchUsers();
  }, []);

  // Function to calculate BMR
  const calculateBMR = user => {
    const weight = parseFloat(user.weight);
    const height = parseFloat(user.height);
    const age = parseInt(user.age, 10);
    const sex = user.sex ? user.sex.toLowerCase() : ""; // Ensure sex is in lowercase

    // Calculate BMR based on sex
    if (!isNaN(weight) && !isNaN(height) && !isNaN(age)) {
      let bmrValue = 0;

      if (sex === "male") {
        bmrValue = 66.473 + 13.7516 * weight + 5.0033 * height - 6.755 * age;
      } else if (sex === "female") {
        bmrValue = 655.0955 + 9.5634 * weight + 1.8496 * height - 4.6756 * age;
      }

      return bmrValue; // Return calculated BMR
    }

    return 0; // Return 0 if data is invalid
  };

  const onDelete = async id => {
    await axios.delete(`http://localhost:5000/api/users/${id}`);
    setUserData(userData.filter(user => user._id !== id));
  };

  const onNewUserEntry = async newUser => {
    const response = await axios.post(
      "http://localhost:5000/api/users",
      newUser
    );
    setUserData([
      ...userData,
      { ...response.data, bmr: calculateBMR(response.data) }
    ]); // Calculate and set BMR for new user
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
              <th>Weight (kg)</th>
              <th>Height (cm)</th>
              <th>Sex</th>
              <th>Age</th>
              <th>BMR (kcal/day)</th> {/* New column for BMR */}
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
                <td>{calculateBMR(user).toFixed(2)} kcal/day</td>{" "}
                {/* Display BMR */}
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
