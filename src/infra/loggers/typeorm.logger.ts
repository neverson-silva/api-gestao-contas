import { Logger, QueryRunner } from 'typeorm';
import sqlFormatter from '@sqltools/formatter';
import * as highlight from 'cli-highlight';

export class CustomLogger implements Logger {
  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    console.log(`[${level.toUpperCase()}]: ${message}`);
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    const formattedQuery = this.beautifyQuery(query);
    const formattedParameters = this.stringifyParams(parameters);
    console.log(`[Query]:\n${formattedQuery}`);
    if (formattedParameters) {
      console.log(`[Parameters]: ${formattedParameters}`);
    }
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    const formattedQuery = this.beautifyQuery(query);

    const formattedParameters = this.stringifyParams(parameters);
    console.error(`[Query Error]: ${error}`);
    console.error(`[Query]:\n${formattedQuery}`);
    if (formattedParameters) {
      console.error(`[Parameters]: ${formattedParameters}`);
    }
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    const formattedQuery = this.beautifyQuery(query);
    const formattedParameters = this.stringifyParams(parameters);
    console.warn(`[Slow Query]: Execution time: ${time} ms`);
    console.warn(`[Query]:\n${formattedQuery}`);
    if (formattedParameters) {
      console.warn(`[Parameters]: ${formattedParameters}`);
    }
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    console.log(`[Schema Build]: ${message}`);
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    console.log(`[Migration]: ${message}`);
  }

  logTransaction(message: string, queryRunner?: QueryRunner) {
    console.log(`[Transaction]: ${message}`);
  }

  logTransactionError(error: string, queryRunner?: QueryRunner) {
    console.error(`[Transaction Error]: ${error}`);
  }

  private stringifyParams(parameters?: any[]) {
    if (parameters && parameters.length > 0) {
      return JSON.stringify(parameters);
    }
    return '';
  }

  private beautifyQuery(query: string): string {
    const formattedQuery = sqlFormatter.format(query);
    return highlight.highlight(formattedQuery, { language: 'sql' });
  }
}
