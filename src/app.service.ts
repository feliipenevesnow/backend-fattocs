import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Olá equipe da Fatto, me chamo Felipe 😀!';
  }
}
