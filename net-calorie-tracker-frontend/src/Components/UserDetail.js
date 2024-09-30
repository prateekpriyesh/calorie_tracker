import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AddFood from "./AddFood";
import AddActivity from "./AddActivity";
import Modal from "./Modal";
import "./CTStylings.css";
import "./UserDetails.css";

const UserDetail = () => {
  const { id } = useParams();
  const [foodData, setFoodData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [bmr, setBMR] = useState(-1800);
  const [netCalories, setNetCalories] = useState(0);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users`);
      const user = response.data.find(user => user._id === id);
      if (user) {
        setUserName(user.name);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchFoodData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/foods/${id}`);
      setFoodData(response.data);
    } catch (error) {
      console.error("Error fetching food data:", error);
    }
  };

  const fetchActivityData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/activities/${id}`
      );
      setActivityData(response.data);
    } catch (error) {
      console.error("Error fetching activity data:", error);
    }
  };

  const totalCaloriesIn = foodData.reduce(
    (acc, item) => acc + item.calorieIn,
    0
  );

  const totalCaloriesOut = activityData.reduce(
    (acc, item) => acc + item.calorieOut,
    0
  );

  useEffect(() => {
    fetchUserData();
    fetchFoodData();
    fetchActivityData();
  }, [id]);

  useEffect(() => {
    const netCal = bmr + totalCaloriesIn - totalCaloriesOut;
    setNetCalories(netCal);
  }, [bmr, totalCaloriesIn, totalCaloriesOut]);

  const handleFoodModalClose = () => {
    setIsFoodModalOpen(false);
    fetchFoodData();
  };

  const handleActivityModalClose = () => {
    setIsActivityModalOpen(false);
    fetchActivityData();
  };

  return (
    <div className="user-details">
      <h1>{userName ? `User ${userName} Details` : `User Details`}</h1>

      <div className="actions">
        <button onClick={() => setIsFoodModalOpen(true)}>Add Food Data</button>
        <button onClick={() => setIsActivityModalOpen(true)}>
          Add Activity Data
        </button>
      </div>

      <div className="data-sections">
        <div className="food-data-section">
          <h2>Food Data</h2>
          {foodData.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Meal Type</th>
                  <th>Food Group</th>
                  <th>Serving</th>
                  <th>Calories In</th>
                </tr>
              </thead>
              <tbody>
                {foodData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.date}</td>
                    <td>{item.mealType}</td>
                    <td>{item.foodGroup}</td>
                    <td>{item.serving}</td>
                    <td>{item.calorieIn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No food data available</p>
          )}
        </div>

        <div className="activity-data-section">
          <h2>Activity Data</h2>
          {activityData.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Activity Name</th>
                  <th>Description</th>
                  <th>MET Value</th>
                  <th>Duration</th>
                  <th>Calories Out</th>
                </tr>
              </thead>
              <tbody>
                {activityData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.date}</td>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>{item.metValue}</td>
                    <td>{item.duration}</td>
                    <td>{item.calorieOut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No activity data available</p>
          )}
        </div>

        <div className="net-calories-section">
          <h2>Net Calorie</h2>
          <p>BMR: {bmr}</p>
          <p>Food: {totalCaloriesIn}</p>
          <p>Activity: {totalCaloriesOut}</p>
          <p>Net Calories: {netCalories}</p>
        </div>
      </div>

      {/* Conditional rendering of the food modal */}
      {isFoodModalOpen && (
        <Modal onClose={handleFoodModalClose}>
          <AddFood userId={id} onClose={handleFoodModalClose} />
        </Modal>
      )}
      {isActivityModalOpen && (
        <Modal onClose={handleActivityModalClose}>
          <AddActivity userId={id} onClose={handleActivityModalClose} />
        </Modal>
      )}
    </div>
  );
};

export default UserDetail;
