const { faker } = require("@faker-js/faker");
const fs = require("fs");
const path = require("path");

const nitrogen = faker.number.float({ min: 30, max: 45, multipleOf: 0.01 });
const phosphorus = faker.number.float({
  min: 30,
  max: 40,
  multipleOf: 0.01,
});
const potassium = 100 - nitrogen - phosphorus;

const data = {
  timestamp: faker.date.recent().toLocaleString(),
  nitrogen: parseFloat(nitrogen.toFixed(2)),
  phosphorus: parseFloat(phosphorus.toFixed(2)),
  potassium: parseFloat(potassium.toFixed(2)),
  ph: faker.number.float({ min: 5, max: 7, multipleOf: 0.01 }),
  moisture: faker.number.float({ min: 45, max: 60, multipleOf: 0.01 }),
  temperature: faker.number.float({ min: 30, max: 45, multipleOf: 0.01 }),
  humidity: faker.number.float({ min: 45, max: 60, multipleOf: 0.01 }),
  device: "123456",
};

const filePath = path.join(__dirname, "random-data.json");

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
