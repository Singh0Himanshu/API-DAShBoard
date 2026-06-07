import { AuthService } from "../service/authService.js";
import { AuthController } from "../controller/authController.js";
import MongoUserRepository from "../repository/UserRepository.js";


class Container{

    static init(){
        const repositories = {
            userRepository: MongoUserRepository
        }

        const Services = {
            authService : new AuthService(repositories.userRepository)
        }

        const controller = {
            authController : new AuthController(Services.authService)
        }

        return {
            repositories,
            Services,
            controller
        };
    }
}

const initialised = Container.init();
export { Container };
export default initialised;