import { PessoaUsuarioAutenticadoDTO } from '@app/autenticacao/dtos/usuario-autenticado.dto';
import { MesAnoDTO } from '@app/conta/dtos/mes-ano.dto';
import { FaturaItem } from '@app/fatura/models/fatura-item.entity';
import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { IPaginationOptions } from '@extensions/database/interfaces';
import { IRepository } from '@infra/interfaces/repository';
import { Page } from '@utils/dtos/page.dto';

export interface IFaturaItemRepository extends IRepository<FaturaItem> {
  getFaturaItemsByMesAno(
    mesAno: MesAnoDTO,
    somenteAtivos: boolean,
    pageRequest: {
      pageOptions: IPaginationOptions;
      sortOptions?: { column: string; order: 'ASC' | 'DESC' };
    },
    searchKey: string,
    idFormaPagamento?: number,
  ): Promise<Page<FaturaItem>>;

  findAllByFechamentoAndAnoAndPessoaAndNotPago(
    mesReferencia: number,
    anoReferencia: number,
    pessoa: Pessoa | PessoaUsuarioAutenticadoDTO,
    pageRequest: {
      pageOptions: IPaginationOptions;
      sortOptions?: { column: string; order: 'ASC' | 'DESC' };
    },
    searchKey: string,
    idFormaPagamento?: number,
  ): Promise<Page<FaturaItem>>;

  findAllByFechamentoAndAnoAndPessoa(
    mesReferencia: number,
    anoReferencia: number,
    pessoa: Pessoa | PessoaUsuarioAutenticadoDTO,
    pageRequest: {
      pageOptions: IPaginationOptions;
      sortOptions?: { column: string; order: 'ASC' | 'DESC' };
    },
    searchKey: string,
    idFormaPagamento?: number,
  ): Promise<Page<FaturaItem>>;
}
