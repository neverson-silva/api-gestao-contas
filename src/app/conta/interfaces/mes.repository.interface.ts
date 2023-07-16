import { Mes } from '@app/conta/models/mes.entity';
import { IRepository, ManagebleRepository } from '@infra/interfaces/repository';

export type IMesRepository = IRepository<Mes> & ManagebleRepository;
