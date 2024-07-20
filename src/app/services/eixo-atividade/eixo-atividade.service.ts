import { Injectable } from "@angular/core";
import { BaseService } from "../base/base.service";
import { HttpClient } from "@angular/common/http";
import { Rotas } from "src/app/core/rotas";
import { EixoAtividade } from "src/app/core/eixo-atividade";

@Injectable({
  providedIn: "root",
})
export class EixoAtividadeService extends BaseService<EixoAtividade> {
  constructor(http: HttpClient) {
    super(http, Rotas.EIXO_ATIVIDADE);
  }

  getFilter(nomeFiltro: string | number, descricaoFiltro: string | number) {
    nomeFiltro = nomeFiltro || "";
    descricaoFiltro = descricaoFiltro || "";

    return this.http.get(Rotas.EIXO_ATIVIDADE + "filter", {
      params: {
        nome: `${nomeFiltro}`,
        descricao: `${descricaoFiltro}`,
      },
    });
  }
}
