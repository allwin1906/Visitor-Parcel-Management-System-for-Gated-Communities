import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import itemRoutes from "./routes/item.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/items", itemRoutes); // "visitor" and "parcel" are types within items

app.get("/", (req, res) => {
    res.send("Visitor Parcel System API");
});

export default app;
