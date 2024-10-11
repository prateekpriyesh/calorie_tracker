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
  const [bmr, setBMR] = useState(0);
  const [netCalories, setNetCalories] = useState(0);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userDetails, setUserDetails] = useState({});

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users`);
      const user = response.data.find(user => user._id === id);
      console.log("Fetched User Data:", user);
      if (user) {
        setUserName(user.name);
        setUserDetails(user);
        calculateBMR(user);
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

  const calculateBMR = user => {
    const weight = parseFloat(user.weight);
    const height = parseFloat(user.height);
    const age = parseInt(user.age, 10);
    const sex = user.sex ? user.sex.toLowerCase() : "";

    console.log("Calculating BMR for User:", { weight, height, age, sex });

    if (!isNaN(weight) && !isNaN(height) && !isNaN(age)) {
      let bmrValue = 0;

      if (sex === "male") {
        bmrValue = 66.473 + 13.7516 * weight + 5.0033 * height - 6.755 * age;
      } else if (sex === "female") {
        bmrValue = 655.0955 + 9.5634 * weight + 1.8496 * height - 4.6756 * age;
      } else {
        console.warn("BMR calculation: Invalid sex value:", sex);
        setBMR(0);
        return;
      }

      console.log("Calculated BMR:", bmrValue);
      setBMR(bmrValue);
    } else {
      console.warn("BMR calculation: Invalid input data:", user);
      setBMR(0);
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

  const calculateTotalDuration = () => {
    const totalMinutes = activityData.reduce((acc, item) => {
      const decimalHours = parseFloat(item.duration);
      const hoursToMinutes = Math.floor(decimalHours) * 60;
      const fractionalMinutes = (decimalHours % 1) * 60;
      return acc + hoursToMinutes + fractionalMinutes;
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
  };

  const totalDuration = calculateTotalDuration();

  return (
    <div className="user-details">
      <h1>{userName ? `${userName} Details` : `User Details`}</h1>

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
                  <th>Duration (H:M)</th>{" "}
                  {/* Show duration in hours and minutes */}
                  <th>Calories Out</th>
                </tr>
              </thead>
              <tbody>
                {activityData.map((item, index) => {
                  const [
                    hoursPart,
                    minutesPart
                  ] = item.duration.toString().split(".");

                  let hours = parseInt(hoursPart, 10);
                  let minutes = minutesPart
                    ? parseInt(minutesPart.padEnd(2, "0"), 10)
                    : 0;

                  if (minutes >= 60) {
                    hours += Math.floor(minutes / 60);
                    minutes = minutes % 60;
                  }

                  return (
                    <tr key={index}>
                      <td>{item.date}</td>
                      <td>{item.name}</td>
                      <td>{item.description}</td>
                      <td>{item.metValue}</td>
                      <td>{`${hours}h ${minutes}m`}</td>{" "}
                      {/* Display hours and minutes */}
                      <td>{item.calorieOut}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p>No activity data available</p>
          )}
        </div>

        {/* Net Calorie Section */}
        <div className="net-calories-section">
          <h2>Net Calorie</h2>
          <table>
            <tbody>
              <tr>
                <td>BMR:</td>
                <td>{bmr >= 0 ? `+${bmr.toFixed(2)}` : bmr.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Food:</td>
                <td>+{totalCaloriesIn}</td>
              </tr>
              <tr>
                <td>Activity:</td>
                <td>-{totalCaloriesOut}</td>
              </tr>
              <tr>
                <td>Total Activity Duration:</td>
                <td>{`${totalDuration.hours}h ${totalDuration.minutes}m`}</td>{" "}
                {/* Display total duration */}
              </tr>
              <tr>
                <td>Net Calories:</td>
                <td>
                  {netCalories >= 0
                    ? `+${netCalories.toFixed(2)}`
                    : netCalories.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
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
