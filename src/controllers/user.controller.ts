import {Request, Response} from "express"
import UserService from "../services/User.service";
import { UserDocument, UserInput } from "../models/user.module";
import { userExistsError, NotAuthorizedError } from "../exceptions";

class userController{

public async create(req: Request, res:Response){

    try{
        const user: UserDocument = await UserService.create( req.body as UserInput);
        res.status(201).json(user);
    }catch(error){
        if(error instanceof userExistsError){
            res.status(400).json({messge: "user already exists"});
            return;
        }
        res.status(501);
    }
   

}

public async update(req: Request, res:Response){
    try{
        const user: UserDocument | null= await UserService.update(req.params.id,req.body as UserInput);
        if(!user)
            res.status(404).json({error: "not found", message: `User with id ${req.params.id} not found`})
        res.json(user);
       } catch(error){
   
           res.status(500).json(error);
       
   
       }

}

public async getUser(req: Request, res:Response){
    try{
        const user: UserDocument | null= await UserService.findById(req.params.id);
        if(!user)
            res.status(404).json({error: "not found", message: `User with id ${req.params.id} not found`})
        res.json(user);
       } catch(error){
   
           res.status(500).json(error);
       
   
       }
   

}

public async getAll(req: Request, res:Response){

    try{
     const users: UserDocument[] = await UserService.findAll();
     res.json(users);
    } catch(error){

        res.status(500).json(error);
    

    }

    


}

public async delete(req: Request, res:Response){
    res.send("delete user");

}

public async login(req: Request, res:Response){

    try{
        const userObj = await UserService.login(req.body);
        res.status(201).json(userObj);
    }catch(error){
        if(error instanceof NotAuthorizedError){
            res.status(400).json({messge: "user already exists"});
            return;
        }
        res.status(501).json(error);
    }
   

}

}

export default new userController();
