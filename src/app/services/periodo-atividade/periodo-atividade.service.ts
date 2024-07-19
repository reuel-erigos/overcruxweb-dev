import { Injectable } from "@angular/core";
import { BaseService } from "../base/base.service";
import { HttpClient } from "@angular/common/http";
import { Rotas } from "src/app/core/rotas";
import { PeriodoAtividade } from "src/app/core/periodo-atividade";

@Injectable({
  providedIn: "root",
})
export class PeriodoAtividadeService extends BaseService<PeriodoAtividade> {
  constructor(http: HttpClient) {
    super(http, Rotas.PERIODO_ATIVIDADE);
  }

  getFilter(nomeFiltro: string | number, descricaoFiltro: string | number) {
    nomeFiltro = nomeFiltro || "";
    descricaoFiltro = descricaoFiltro || "";

    return this.http.get(Rotas.PERIODO_ATIVIDADE + "filter", {
      params: {
        nome: `${nomeFiltro}`,
        descricao: `${descricaoFiltro}`,
      },
    });
  }
}
