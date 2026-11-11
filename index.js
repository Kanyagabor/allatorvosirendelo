import express from "express";
import gazdak from "./routes/gazdak.js"
import allatok from "./routes/allatok.js"

const app= express();
const PORT = 3000;

app.use("/jaratok", gazdak);
app.use("/allatok", allatok);


app.listen(PORT, ()=> console.log(`fut a szero http://localhost:${PORT}`));