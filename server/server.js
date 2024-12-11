// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const routes = require("./routes");

// dotenv.config();

// const app = express();
// //katodo, lägg port i env
// //const PORT = process.env.PORT || 3000;
// const PORT = 3000;

// //middleware
// app.use(cors());
// app.use(express.json());

// app.use("/api", routes);

// app.use((err, req, res, next) => {
//   console.error("An unexpected error occurred:", err);
//   res.status(500).json({ message: "Internal server error" });
// });

// //start server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
