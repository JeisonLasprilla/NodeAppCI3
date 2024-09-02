import {object, string} from "zod";

const userChema = object ({
    name: string({required_error: "Name is requiered"}),
    email: string({required_error: "Email is requiered"})
        .email("Not a valid email addresss"),
    password: string({required_error: "password is requiered"})
        .min(8, "Password must be at least 8characteres long"),
})

export default userChema;