const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "API E-TIKET Documentation",
    description: "Dokumentasi API untuk aplikasi E-TIKET",
  },
  host: "localhost:3000",
  schemes: ["http"],
  basePath: "/api",
};

const outputFile = "./swagger_output.json";
const routes = ["./api/routes/index.js"]; // entry routes utama
swaggerAutogen(outputFile, routes, doc);
