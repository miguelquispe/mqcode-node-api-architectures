import { createApp } from "./app";

const PORT = process.env.PORT || 3000;
const app = createApp();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
