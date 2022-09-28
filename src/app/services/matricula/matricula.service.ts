import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FiltroAlunoTurma } from '../../core/filtro/filtro-aluno-turma';
import { PageInfo } from '../../core/page-info';
import { AlunosTurma } from './../../core/alunos-turma';
import { Rotas } from './../../core/rotas';
import { BaseService } from './../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService extends BaseService<AlunosTurma> {

  constructor(http: HttpClient) {
    super(http, Rotas.MATRICULAS);
  }

  getFilter(idTurma: string|number, idAluno: string|number, idOficina: string|number) {
    idTurma = idTurma || '';
    idOficina = idOficina || '';
    idAluno = idAluno || '';

    return this.http.get(Rotas.MATRICULAS + 'alunos', { params: {
        turma: `${idTurma}` ,
        aluno: `${idAluno}`,
        oficina: `${idOficina}`
      }
    });
  }

  listFilteredAndPaged(pageInfo: PageInfo, filtro: FiltroAlunoTurma) {
    return this.http.post(
      Rotas.MATRICULAS + 'paged/filtro', 
      JSON.stringify(filtro),
      this.headersWithPagination(pageInfo)
    );
  }

  getByAluno(idAluno: number) {
    return this.http.get(Rotas.MATRICULAS + 'aluno/' + idAluno);
  }
}
