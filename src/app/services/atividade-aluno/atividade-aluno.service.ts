import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { AtividadeAluno } from 'src/app/core/atividade-aluno';
import { Rotas } from 'src/app/core/rotas';

@Injectable({
  providedIn: 'root'
})
export class AtividadeAlunoService extends BaseService<AtividadeAluno> {

  constructor(http: HttpClient) {
    super(http, Rotas.ATIVIDADE_ALUNO);
  }

  getAllAlunosMatriculadosNaAtividade(idAtividade: number) {
    return this.http.get(Rotas.ATIVIDADE_ALUNO + 'matriculado/atividade/' + idAtividade );
  }

  getAllByAlunoAndInstituicao(idAluno: number) {
    return this.http.get(Rotas.ATIVIDADE_ALUNO + 'aluno/' + idAluno + '/matriculado/insticuicao/');
  }

  getAllUniformeByAlunoAndInstituicao(idAluno: number) {
    return this.http.get(Rotas.ATIVIDADE_ALUNO + 'aluno/uniforme/' + idAluno + '/matriculado/instituicao/');
  }


  getFilter(idAtividade: string|number, idAluno: string|number) {
    idAtividade = idAtividade || '';
    idAluno = idAluno || '';

    return this.http.get(Rotas.ATIVIDADE_ALUNO + 'matriculado', { params: {
        atividade: `${idAtividade}` ,
        aluno: `${idAluno}`
      }
    });
  }

}
