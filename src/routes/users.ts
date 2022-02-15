import { Router } from "express";

import usersController from '../controllers/users'

const usersRouter = Router();

usersRouter.post("/api/users", usersController.postUser);

usersRouter.get('/api/users/:userId', usersController.getOneUser);

usersRouter.get("/api/users", usersController.getUsers);

export default usersRouter;
