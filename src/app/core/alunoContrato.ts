import {Contrato} from "./contrato";
import {MetaObjetivo} from "./metaObjetivo";
import {Aluno} from "./aluno";

export class AlunoContrato {
    id: number;
    contrato: Contrato;
    aluno: Aluno;
    dataInicio: Date;
    dataFim: Date;
    valor: number;
    usuarioAlteracao: number;
}