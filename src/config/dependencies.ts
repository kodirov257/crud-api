import { Container } from '../container';
import { UserRepository } from '../repositories/UserRepository';
import { UserService } from '../services/UserService';
import { UserController } from '../controllers/UserController';

const container: Container = Container.getInstance();

container.register(UserRepository.name, {
  useClass: UserRepository,
  singleton: true,
});

container.register(UserService.name, {
  useClass: UserService,
  singleton: true,
  dependencies: [UserRepository.name],
});

container.register(UserController.name, {
  useClass: UserController,
  singleton: true,
  dependencies: [UserService.name],
});

export default container;
