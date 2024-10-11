import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import "./CTStylings.css";
import debounce from "lodash.debounce";

const AddActivity = ({ userId, userWeight = 70, onClose }) => {
  const [formData, setFormData] = useState({
    date: "",
    name: "",
    description: "",
    metValue: "",
    duration: "",
    calorieOut: ""
  });

  const [activityOptions, setActivityOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchActivityData = debounce(async inputValue => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:5000/api/excel/activities",
          {
            params: { search: inputValue || "", limit: 50 }
          }
        );

        console.log("Fetched Activities:", res.data);

        const options = res.data.map(activity => ({
          value: activity.ACTIVITY,
          label: `${activity.ACTIVITY} - ${activity.METs} MET`,
          metValue: parseFloat(activity.METs)
        }));

        setActivityOptions(options);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching activity data:", error);
        setLoading(false);
      }
    }, 500);
    fetchActivityData("");
    return () => fetchActivityData.cancel();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleActivitySelect = selectedOption => {
    if (selectedOption) {
      setFormData({
        ...formData,
        name: selectedOption.value,
        metValue: selectedOption.metValue,
        calorieOut: calculateCaloriesOut(
          selectedOption.metValue,
          formData.duration
        )
      });
    }
  };

  const calculateCaloriesOut = (metValue, duration) => {
    const durationInMinutes = parseDuration(duration);
    console.log("Calculating Calories Out:", {
      metValue,
      userWeight,
      durationInMinutes
    });
    if (
      isNaN(metValue) ||
      isNaN(userWeight) ||
      isNaN(durationInMinutes) ||
      durationInMinutes <= 0
    ) {
      return 0;
    }

    return (metValue * userWeight * durationInMinutes) / 60;
  };

  const parseDuration = duration => {
    const regex = /(\d*\.?\d+)\s*(hour|hours|h)?\s*(\d*\.?\d+)?\s*(min|minutes|m)?/i;
    const matches = duration.match(regex);

    let totalMinutes = 0;

    if (matches) {
      if (matches[1]) {
        const hours = parseFloat(matches[1]);
        totalMinutes += hours * 60;
      }
      if (matches[4]) {
        const minutes = parseFloat(matches[4]);
        totalMinutes += minutes;
      }
    }

    console.log("Parsed Duration (in minutes):", { duration, totalMinutes });
    return totalMinutes;
  };
  const handleDurationChange = e => {
    const duration = e.target.value;
    setFormData({
      ...formData,
      duration: duration,
      calorieOut: calculateCaloriesOut(formData.metValue, duration)
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
      <Select
        name="name"
        options={activityOptions}
        onChange={handleActivitySelect}
        placeholder="Search and select activity..."
        isLoading={loading}
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
      <input type="number" name="metValue" value={formData.metValue} readOnly />

      <label>Duration (e.g., "1.5 hours, 0.5 hours(30min)")</label>
      <input
        type="text"
        name="duration"
        value={formData.duration}
        onChange={handleDurationChange}
        required
        placeholder="e.g., 1.5 hours, 0.5 hours(30min)"
      />

      <label>Calories Out (Calculated)</label>
      <input
        type="number"
        name="calorieOut"
        value={formData.calorieOut}
        readOnly
      />

      <button type="submit" disabled={isSubmitDisabled}>
        Add Activity
      </button>
    </form>
  );
};

export default AddActivity;
