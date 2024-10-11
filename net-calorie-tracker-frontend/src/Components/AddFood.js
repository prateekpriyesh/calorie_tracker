import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import "./CTStylings.css";
import debounce from "lodash.debounce";

const AddFood = ({ userId, onClose }) => {
  const [formData, setFormData] = useState({
    date: "",
    foodName: "",
    mealType: "",
    foodGroup: "",
    serving: "",
    calorieIn: ""
  });

  const [foodOptions, setFoodOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFoodData = debounce(async inputValue => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/excel/foods`, {
          params: { search: inputValue || "", limit: 50 }
        });
        const options = res.data.map(food => ({
          value: food.name,
          label: `${food.name} - ${food.caloriesPerServing} kcal`,
          caloriesPerServing: food.caloriesPerServing
        }));
        setFoodOptions(options);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching food data:", error);
        setLoading(false);
      }
    }, 500);

    fetchFoodData("");
    return () => fetchFoodData.cancel();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFoodSelect = selectedOption => {
    if (selectedOption) {
      setFormData({
        ...formData,
        foodName: selectedOption.value,
        calorieIn:
          selectedOption.caloriesPerServing * parseFloat(formData.serving || 0)
      });
    }
  };

  const handleServingChange = e => {
    const serving = parseFloat(e.target.value);
    setFormData({
      ...formData,
      serving: serving,
      calorieIn:
        foodOptions.find(option => option.value === formData.foodName)
          ?.caloriesPerServing * serving || 0
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
      <Select
        name="foodName"
        options={foodOptions}
        onChange={handleFoodSelect}
        placeholder="Search and select food..."
        isLoading={loading}
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
        onChange={handleServingChange}
        required
        min="1"
        placeholder="Number of servings"
      />

      <label>Calories In (Calculated)</label>
      <input
        type="number"
        name="calorieIn"
        value={formData.calorieIn}
        readOnly
      />

      <button type="submit" disabled={isSubmitDisabled}>
        Add Food
      </button>
    </form>
  );
};

export default AddFood;
