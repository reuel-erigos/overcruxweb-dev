import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Rotas } from "src/app/core/rotas";
import { TiposContratos } from "src/app/core/tipos-contratos";
import { BaseService } from "../base/base.service";

@Injectable({
  providedIn: "root",
})
export class TiposContratosService extends BaseService<TiposContratos> {
  constructor(http: HttpClient) {
    super(http, Rotas.TIPOS_CONTRATOS);
  }

  getByDescricao(descricao: string) {
    descricao = descricao || "";
    return this.http.get(Rotas.TIPOS_CONTRATOS + `filter`, {
      params: { descricao: `${descricao}` },
    });
  }
}
