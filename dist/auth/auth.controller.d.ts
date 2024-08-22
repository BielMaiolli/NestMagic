import { AuthService } from './auth.service';
import { SignUpDto } from 'src/deck/dto/signup.dto';
import { LoginDto } from 'src/deck/dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signUp(signUpDto: SignUpDto): Promise<{
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
    }>;
}
