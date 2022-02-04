import express from "express";

import pg from "../db";

const usersRouter = express.Router();

usersRouter.post("/api/users", (req, res) => {
  let userEmail = req.body.useremail;
  pg("users")
    .insert({ email: userEmail })
    .then(() => res.json(userEmail))
    .catch((error) => res.json(error));
});

usersRouter.get("/api/users", (req, res) => {
  pg.select()
    .from("users")
    .then((rows) => res.json(rows))
    .catch((error) => res.json(error));
});

export default usersRouter;
