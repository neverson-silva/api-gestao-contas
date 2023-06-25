// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import * as cryptojs from 'crypto-js';
import { isValidValue } from '@utils/index';
import { UsuarioAutenticadoDto } from '@app/autenticacao/dtos/usuario-autenticado.dto';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  private readonly publicKey: string;
  private readonly enableEncryptation: boolean;
  constructor(configService: ConfigService) {
    this.enableEncryptation =
      configService.getAt('app.security.enableEncryptation') == 'true';

    if (this.enableEncryptation) {
      this.publicKey = configService.getAt('app.security.publicKey');
    }
  }
  obterChave(usuario?: UsuarioAutenticadoDto): string {
    const composicao = usuario
      ? `${usuario?.id}|${usuario?.login}|${usuario?.pessoa.id}|${usuario?.pessoa.nome}|${usuario?.pessoa.sobrenome}`
      : this.publicKey;
    return cryptojs.enc.Base64.stringify(cryptojs.enc.Utf8.parse(composicao));
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const chave = this.obterChave(request.usuario);

    // Transformar o body, query string e headers
    request.body = this.decrypData(request.body, chave);
    request.query = this.decrypData(request.query, chave);
    request.headers = this.decrypData(request.headers, chave);

    return next.handle().pipe(
      map((data) => {
        return this.encryptData(data, chave);
      }),
    );
  }

  // Função auxiliar para transformar os dados
  decrypData(value: any, chave: string): any {
    if (this.enableEncryptation) {
      if (!isValidValue(value)) {
        return value;
      }
      try {
        const decriptado = cryptojs.AES.decrypt(
          Buffer.from(value?.data ?? value, 'base64').toString('utf-8'),
          chave,
        );
        const plainText = decriptado.toString(cryptojs.enc.Utf8);
        return JSON.parse(plainText);
      } catch (e) {
        return value;
      }
    }
    return value;
  }

  // Função auxiliar para transformar os dados
  encryptData(data: any, chave: string) {
    if (this.enableEncryptation) {
      if (!isValidValue(data)) {
        return data;
      }
      try {
        const mensagem = JSON.stringify(data);

        const dados = cryptojs.enc.Base64.stringify(
          cryptojs.enc.Utf8.parse(
            cryptojs.AES.encrypt(mensagem, chave).toString(),
          ),
        );

        return { data: dados };
      } catch (e: any) {
        return data;
      }
    }
    return data;
  }
}
