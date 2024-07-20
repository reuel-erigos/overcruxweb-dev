import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Rotas } from "src/app/core/rotas";
import { TipoContrato } from "src/app/core/tipo-contrato";
import { BaseService } from "../base/base.service";

@Injectable({
  providedIn: "root",
})
export class TipoContratoService extends BaseService<TipoContrato> {
  constructor(http: HttpClient) {
    super(http, Rotas.TIPO_CONTRATO);
  }

  getByDescricao(descricao: string) {
    descricao = descricao || "";
    return this.http.get(Rotas.TIPO_CONTRATO + `filter`, {
      params: { descricao: `${descricao}` },
    });
  }
}
