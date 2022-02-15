import User from '../models/user';

const usersController: any = {};

usersController.postUser = (req: any, res: any, next: any) => {
  let userEmail = req.body.useremail;
  let user = new User(userEmail);
  user
    .save()
    .then((user) => res.json(user))
    .catch((error) => res.json(error));
};

usersController.getUsers = (req: any, res: any, next: any) => {
  User.fetchAll()
    .then((rows) => res.json(rows))
    .catch((error) => res.json(error));
};

usersController.getOneUser = (req: any, res: any, next: any) => {
  let userId = req.params.userId;
  User.fetchById(userId)
    .then((rows) => {
      res.json(rows[0]);
    })
    .catch((error) => res.json(error));
};

export default usersController;
