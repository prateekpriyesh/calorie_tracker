import React, { useState } from "react";
import axios from "axios";
import "./CTStylings.css";

const AddFood = ({ userId, onClose }) => {
  const [formData, setFormData] = useState({
    date: "",
    foodName: "",
    mealType: "",
    foodGroup: "",
    serving: "",
    calorieIn: ""
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

    const foodData = {
      date: formData.date,
      name: formData.foodName,
      mealType: formData.mealType,
      foodGroup: formData.foodGroup,
      serving: parseFloat(formData.serving),
      calorieIn: parseFloat(formData.calorieIn),
      userId
    };

    try {
      await axios.post("http://localhost:5000/api/foods", foodData);
      alert("Food data added successfully");
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unknown error occurred";
      alert("Error adding food data: " + errorMessage);
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

      <label>Food Name</label>
      <input
        type="text"
        name="foodName"
        value={formData.foodName}
        onChange={handleChange}
        required
      />

      <label>Meal Type</label>
      <select
        name="mealType"
        value={formData.mealType}
        onChange={handleChange}
        required
      >
        <option value="">Select</option>
        <option value="Breakfast">Breakfast</option>
        <option value="Lunch">Lunch</option>
        <option value="Dinner">Dinner</option>
        <option value="Snack">Snack</option>
      </select>

      <label>Food Group</label>
      <select
        name="foodGroup"
        value={formData.foodGroup}
        onChange={handleChange}
        required
      >
        <option value="">Select</option>
        <option value="Fruits">Fruits</option>
        <option value="Vegetables">Vegetables</option>
        <option value="Grains">Grains</option>
        <option value="Protein">Protein</option>
        <option value="Dairy">Dairy</option>
      </select>

      <label>Serving Size</label>
      <input
        type="number"
        name="serving"
        value={formData.serving}
        onChange={handleChange}
        required
      />

      <label>Calories In</label>
      <input
        type="number"
        name="calorieIn"
        value={formData.calorieIn}
        onChange={handleChange}
        required
      />

      <button type="submit" disabled={isSubmitDisabled}>
        Add Food
      </button>
    </form>
  );
};

export default AddFood;
