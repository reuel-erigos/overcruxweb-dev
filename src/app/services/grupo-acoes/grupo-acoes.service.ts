import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Atividade } from 'src/app/core/atividade';
import { BaseService } from '../base/base.service';
import { Rotas } from 'src/app/core/rotas';
import { GrupoAcoes } from 'src/app/core/grupo-acoes';
import { FuncoesUteisService } from '../commons/funcoes-uteis.service';

@Injectable({
  providedIn: 'root'
})
export class GrupoAcoesService extends BaseService<GrupoAcoes> {

    constructor(http: HttpClient, 
                private funcoesUteisService: FuncoesUteisService) {
      super(http, Rotas.GRUPO_ACOES);
      
    }

    getByNumeroAndAtividade(numero: string, idAtividade: number) {
      let numeroGrupo = this.funcoesUteisService.getApenasNumeros(numero);
      return this.http.get(`${Rotas.GRUPO_ACOES}numero/${numeroGrupo}/atividade/${idAtividade}` );
    }

    getFilter(idUnidade: string|number, idTurma: string|number, idOficina: string|number, idAcao: string|number, statusAnalise: string) {
      idUnidade = idUnidade || "";
      idTurma = idTurma || "";
      idOficina = idOficina || "";
      idAcao = idAcao || "";
      statusAnalise = statusAnalise || "";

      return this.http.get(Rotas.GRUPO_ACOES + "filter", {
        params: {
          unidade: `${idUnidade}`,
          turma: `${idTurma}`,
          oficina: `${idOficina}`,
          acao: `${idAcao}`,
          statusAnalise: `${statusAnalise}`,
        },
      });
    }

}
