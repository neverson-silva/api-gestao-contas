import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { IFaturaItemRepository } from '../interfaces/fatura-item.repository.interface';
import { FaturaItem } from '../models/fatura-item.entity';
import { MesAnoDTO } from '@app/conta/dtos/mes-ano.dto';
import { Page } from '@utils/dtos/page.dto';
import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { PessoaUsuarioAutenticadoDTO } from '@app/autenticacao/dtos/usuario-autenticado.dto';
import { IPaginationOptions } from '@extensions/database/interfaces';
import { isValidValue } from '@utils/index';

@Injectable()
export class FaturaItemRepository
  extends Repository<FaturaItem>
  implements IFaturaItemRepository
{
  constructor(em: EntityManager) {
    super(FaturaItem, em);
  }

  async getFaturaItemsByMesAno(
    mesAno: MesAnoDTO,
    somenteAtivos: boolean,
    pageRequest: {
      pageOptions: IPaginationOptions;
      sortOptions?: { column: string; order: 'ASC' | 'DESC' };
    },
    searchKey: string,
    idFormaPagamento?: number,
  ): Promise<Page<FaturaItem>> {
    const query = this.createQueryBuilder('fa')
      .leftJoinAndSelect('fa.lancamento', 'lancamento')
      .leftJoinAndSelect('lancamento.pessoa', 'pessoa')
      .leftJoinAndSelect('lancamento.formaPagamento', 'formaPagamento')
      .leftJoinAndSelect('formaPagamento.dono', 'dono')
      .leftJoinAndSelect('lancamento.mes', 'mes')
      .leftJoinAndSelect('lancamento.lancamentos', 'lancamentos')
      .leftJoinAndSelect('lancamentos.pessoa', 'pessoaLancamentos')
      .leftJoinAndSelect('fa.parcela', 'parcela')
      .leftJoinAndSelect('parcela.mes', 'mesReferencia')
      .where('fa.fechamento = :fechamento', {
        fechamento: mesAno.mesReferencia,
      })
      .andWhere('lancamento.lancamentoRelacionado is null')
      .andWhere('fa.ano = :ano', { ano: mesAno.anoReferencia })
      .andWhere(
        'formaPagamento.id = coalesce(:idFormaPagamento, formaPagamento.id)',
        { idFormaPagamento },
      )
      .andWhere(
        !somenteAtivos
          ? '1=1'
          : '( (lancamento.pago <> true) or (lancamento.parcelado = true and parcela.pago <> true)) ',
      )
      .andWhere(
        searchKey === ''
          ? '1=1'
          : '(lower(lancamento.nome) like lower(:searchKey) or lower(pessoa.nome) like lower(:searchKey) or lower(formaPagamento.nome) like lower(:searchKey))',
        { searchKey: `%${searchKey}%` },
      )
      .orderBy(
        `${pageRequest.sortOptions.column ?? 'lancamento.dataCompra'}`,
        pageRequest.sortOptions.order ?? 'DESC',
      );

    const items = await query.paginate(pageRequest.pageOptions);
    return items;
  }

  async findAllByFechamentoAndAnoAndPessoa(
    mesReferencia: number,
    anoReferencia: number,
    pessoa: Pessoa | PessoaUsuarioAutenticadoDTO,
    pageRequest: {
      pageOptions: IPaginationOptions;
      sortOptions?: { column: string; order: 'ASC' | 'DESC' };
    },
    searchKey: string,
    idFormaPagamento?: number,
  ): Promise<Page<FaturaItem>> {
    const query = this.createQueryBuilder('fa')
      .leftJoinAndSelect('fa.parcela', 'pa')
      .leftJoinAndSelect('pa.mes', 'mesReferencia')
      .innerJoinAndSelect('fa.lancamento', 'lancamento')
      .innerJoinAndSelect('lancamento.pessoa', 'pessoa')
      .innerJoinAndSelect('lancamento.mes', 'mes')
      .innerJoinAndSelect('lancamento.formaPagamento', 'formaPagamento')
      .leftJoinAndSelect('formaPagamento.dono', 'dono')
      .leftJoinAndSelect(
        'lancamento.lancamentoRelacionado',
        'lancamentoRelacionado',
      )
      .leftJoinAndSelect('lancamento.lancamentos', 'lancamentos')
      .where('fa.fechamento = :fechamento', { fechamento: mesReferencia })
      .andWhere('fa.ano = :ano', { ano: anoReferencia })
      .andWhere('pessoa.id = :pessoa', { pessoa: pessoa.id })
      .andWhere(
        'formaPagamento.id = coalesce(:idFormaPagamento, formaPagamento.id)',
        { idFormaPagamento },
      )
      .andWhere(
        '(lancamento.pago <> true or lancamento.parcelado = true and pa.pago <> true)',
      )
      .andWhere(
        `( 
            :searchKey = ''
            or lancamento.nome ilike :searchKey
            or pessoa.nome ilike :searchKey
            or formaPagamento.nome ilike :searchKey
          )`,
        { searchKey: isValidValue(searchKey) ? `%${searchKey}%` : '' },
      )
      .orderBy(
        `${pageRequest.sortOptions.column ?? 'lancamento.dataCompra'}`,
        pageRequest.sortOptions.order ?? 'DESC',
      );
    const items = await query.paginate(pageRequest.pageOptions);
    return items;
  }

  async findAllByFechamentoAndAnoAndPessoaAndNotPago(
    mesReferencia: number,
    anoReferencia: number,
    pessoa: Pessoa | PessoaUsuarioAutenticadoDTO,
    pageRequest: {
      pageOptions: IPaginationOptions;
      sortOptions?: { column: string; order: 'ASC' | 'DESC' };
    },
    searchKey: string,
    idFormaPagamento?: number,
  ): Promise<Page<FaturaItem>> {
    const query = this.createQueryBuilder('fa')
      .leftJoinAndSelect('fa.parcela', 'pa')
      .leftJoinAndSelect('pa.mes', 'mr')
      .innerJoinAndSelect('fa.lancamento', 'lancamento')
      .innerJoinAndSelect('lancamento.pessoa', 'pessoa')
      .innerJoinAndSelect('lancamento.mes', 'mes')
      .innerJoinAndSelect('lancamento.formaPagamento', 'formaPagamento')
      .leftJoinAndSelect('formaPagamento.dono', 'dono')
      .leftJoinAndSelect(
        'lancamento.lancamentoRelacionado',
        'lancamentoRelacionado',
      )
      .leftJoinAndSelect('lancamento.lancamentos', 'lancamentos')
      .leftJoinAndSelect('lancamentos.pessoa', 'lancamentosPessoas')
      .where('fa.fechamento = :fechamento', { fechamento: mesReferencia })
      .andWhere('fa.ano = :ano', { ano: anoReferencia })
      .andWhere('pessoa.id = :pessoa', { pessoa: pessoa.id })
      .andWhere(
        idFormaPagamento !== null
          ? 'formaPagamento.id = :idFormaPagamento'
          : '1 = 1',
        { idFormaPagamento },
      )
      .andWhere(
        searchKey !== ''
          ? '(lower(lancamento.nome) like lower(:searchKey) or lower(pessoa.nome) like lower(:searchKey) or lower(formaPagamento.nome) like lower(:searchKey))'
          : '1 = 1',
        { searchKey: `%${searchKey}%` },
      )
      .orderBy(
        `${pageRequest.sortOptions.column ?? 'lancamento.dataCompra'}`,
        pageRequest.sortOptions.order ?? 'DESC',
      );
    const items = await query.paginate(pageRequest.pageOptions);
    return items;
  }
}
