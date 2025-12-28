import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import itemRoutes from "./routes/item.routes";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/", itemRoutes); // "visitor" and "parcel" are types within items, now strictly mapped 
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
    res.send("Visitor Parcel System API");
});

export default app;
