import express, {Request, Response} from "express";
import UserController from "../controllers/user.controller";
import validateSchema from "../middlewares/validateSchema";
import userSchema from "../schemas/user.schema";
import userController from "../controllers/user.controller";
import auth from "../middlewares/auth"

export const router = express.Router();


router.get("/profile", auth, UserController.getUser);

router.post("/", validateSchema(userSchema), userController.create);

router.post("/", UserController.create);

router.get("/", UserController.getAll);

router.get("/:id/group/:groupid", (req: Request, res: Response) =>{
    res.send(`get user with id ${req.params.id} y group ID: ${req.params.groupid}`);
});

router.get("/:id", UserController.getUser);

router.put("/:id", UserController.update);

router.delete("/:id", UserController.delete);

router.post("/login", UserController.login);