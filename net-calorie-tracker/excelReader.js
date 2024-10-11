const xlsx = require("xlsx");
const path = require("path");

const readExcelFile = filePath => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);
  return jsonData;
};

const foodFilePath = path.join(__dirname, "data", "food-calories.xlsx");
const activityFilePath = path.join(__dirname, "data", "MET-values.xlsx");

const foodData = readExcelFile(foodFilePath);
const activityData = readExcelFile(activityFilePath);

module.exports = {
  foodData,
  activityData
};
