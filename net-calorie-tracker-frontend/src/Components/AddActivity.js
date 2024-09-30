import React, { useState } from "react";
import axios from "axios";
import "./CTStylings.css";

const AddActivity = ({ userId, onClose }) => {
  const [formData, setFormData] = useState({
    date: "",
    name: "",
    description: "",
    metValue: "",
    duration: "",
    calorieOut: ""
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const activityData = {
      date: formData.date,
      name: formData.name,
      description: formData.description,
      metValue: parseFloat(formData.metValue),
      duration: formData.duration,
      calorieOut: parseFloat(formData.calorieOut),
      userId
    };

    try {
      await axios.post("http://localhost:5000/api/activities", activityData);
      alert("Activity data added successfully");
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unknown error occurred";
      alert("Error adding activity data: " + errorMessage);
    }
  };

  const isSubmitDisabled = Object.values(formData).some(value => !value);

  return (
    <form onSubmit={handleSubmit}>
      <label>Date</label>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      <label>Activity Name</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <label>Description</label>
      <input
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
      />

      <label>MET Value</label>
      <input
        type="number"
        name="metValue"
        value={formData.metValue}
        onChange={handleChange}
        required
      />

      <label>Duration (e.g., 1 hour, 30 min)</label>
      <input
        type="text"
        name="duration"
        value={formData.duration}
        onChange={handleChange}
        required
      />

      <label>Calories Out</label>
      <input
        type="number"
        name="calorieOut"
        value={formData.calorieOut}
        onChange={handleChange}
        required
      />

      <button type="submit" disabled={isSubmitDisabled}>
        Add Activity
      </button>
    </form>
  );
};

export default AddActivity;
