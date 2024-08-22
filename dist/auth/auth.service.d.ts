import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";
import { User } from "./schemas/user.schema";
import { SignUpDto } from "src/deck/dto/signup.dto";
import { LoginDto } from "src/deck/dto/login.dto";
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<User>, jwtService: JwtService);
    signUp(signUpDto: SignUpDto): Promise<{
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
    }>;
}
