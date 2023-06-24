import {
  IRepository,
  ManagebleRepository,
} from 'src/infra/interfaces/repository';
import { Mes } from '../models/mes.entity';

export type IMesRepository = IRepository<Mes> & ManagebleRepository;
