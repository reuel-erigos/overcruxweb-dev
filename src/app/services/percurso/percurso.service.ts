import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Rotas} from "src/app/core/rotas";
import {BaseService} from "../base/base.service";
import {Percurso} from "../../core/percurso";

@Injectable({
    providedIn: "root",
})
export class PercursoService extends BaseService<Percurso> {
    constructor(http: HttpClient) {
        super(http, Rotas.PERCURSO);
    }

    getByFilter(nome: string, descricao: string) {
        descricao = descricao || "";
        return this.http.get(Rotas.PERCURSO + `filter`, {
            params: {
                nome: `${nome}`,
                descricao: `${descricao}`
            },
        });
    }
}
