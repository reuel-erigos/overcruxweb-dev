import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Contrato } from "src/app/core/contrato";
import { Rotas } from "src/app/core/rotas";
import { BaseService } from "../base/base.service";

@Injectable({
  providedIn: "root",
})
export class ContratoService extends BaseService<Contrato> {
  constructor(http: HttpClient) {
    super(http, Rotas.CONTRATO);
  }

  getFilter(
    idEmpresa: string | number,
    idPrograma: string | number,
    idProjeto: string | number,
    dataInicioVigencia: string | number,
    dataFimVigencia: string,
    numeroContrato: string,
    valorContrato: string
  ) {
    idEmpresa = idEmpresa || "";
    idPrograma = idPrograma || "";
    idProjeto = idProjeto || "";
    dataInicioVigencia = dataInicioVigencia || "";
    dataFimVigencia = dataFimVigencia || "";
    numeroContrato = numeroContrato || "";
    valorContrato = valorContrato || "";

    return this.http.get(Rotas.CONTRATO + "filter", {
      params: {
        empresa: `${idEmpresa}`,
        programa: `${idPrograma}`,
        projeto: `${idProjeto}`,
        dataInicioVigencia: `${dataInicioVigencia}`,
        dataFimVigencia: `${dataFimVigencia}`,
        numeroContrato: `${numeroContrato}`,
        valorContrato: `${valorContrato}`,
      },
    });
  }
}
