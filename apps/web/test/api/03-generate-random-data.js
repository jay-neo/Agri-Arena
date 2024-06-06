const { faker } = require("@faker-js/faker");
const fs = require("fs");
const path = require("path");

const data = {
  timestamp: faker.date.recent().toISOString(),
  ip: faker.internet.ip(),
  nitrogen: faker.number.float({ min: 0, max: 100, multipleOf: 0.01 }),
  phosphorus: faker.number.float({ min: 0, max: 100, multipleOf: 0.01 }),
  potassium: faker.number.float({ min: 0, max: 100, multipleOf: 0.01 }),
  ph: faker.number.float({ min: 0, max: 14, multipleOf: 0.01 }),
  moisture: faker.number.float({ min: 0, max: 100, multipleOf: 0.01 }),
  temperature: faker.number.float({ min: -10, max: 100, multipleOf: 0.01 }),
  humidity: faker.number.float({ min: 0, max: 100, multipleOf: 0.01 }),
  device: "123456",
};

const filePath = path.join(__dirname, "02-random-data.json");

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
