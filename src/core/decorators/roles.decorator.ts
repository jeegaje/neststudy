import { Reflector } from '@nestjs/core';
import { RolesEnum } from '../enum/roles.enum';

export const Roles = Reflector.createDecorator<RolesEnum[]>()
