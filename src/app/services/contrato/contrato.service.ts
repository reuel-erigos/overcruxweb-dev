import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Contrato} from "src/app/core/contrato";
import {Rotas} from "src/app/core/rotas";
import {BaseService} from "../base/base.service";

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
        dataInicioVigencia: number,
        dataFimVigencia: number,
        numeroContrato: string,
        valorContrato: string
    ) {
        const params: any = {};

        if (idEmpresa) params.empresa = idEmpresa;
        if (idPrograma) params.programa = idPrograma;
        if (idProjeto) params.projeto = idProjeto;
        if (dataInicioVigencia) params.dataInicio = dataInicioVigencia;
        if (dataFimVigencia) params.dataFim = dataFimVigencia;
        if (numeroContrato) params.numeroContrato = numeroContrato;
        if (valorContrato) params.valorContrato = valorContrato;

        return this.http.get(Rotas.CONTRATO + "filter", {params});
    }
}
