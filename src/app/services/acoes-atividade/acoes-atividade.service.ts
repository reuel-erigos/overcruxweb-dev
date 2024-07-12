import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base/base.service';
import { Rotas } from 'src/app/core/rotas';
import { Acoes } from 'src/app/core/acoes';

@Injectable({
  providedIn: 'root'
})
export class AcoesAtividadeService extends BaseService<Acoes> {

  constructor(http: HttpClient) {
    super(http, Rotas.ACOES_OFICINAS);
  }

  getFilter(idUnidade: string|number, idTurma: string|number, idOficina: string|number, idAcao: string|number, statusAnalise: string) {
    idUnidade = idUnidade || '';
    idTurma = idTurma || '';
    idOficina = idOficina || '';
    idAcao = idAcao || '';
    statusAnalise = statusAnalise || '';

    return this.http.get(Rotas.ACOES_OFICINAS + 'filter', { params: {
        unidade: `${idUnidade}` ,
        turma: `${idTurma}`,
        oficina: `${idOficina}`,
        acao: `${idAcao}`,
        statusAnalise: `${statusAnalise}`
      }
    });
  }

}
