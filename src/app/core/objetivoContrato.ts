import {Contrato} from "./contrato";
import {MetaObjetivo} from "./metaObjetivo";

export class ObjetivoContrato {
    id: number;
    contrato: Contrato;
    metasObjetivo: MetaObjetivo[];
    nome: string;
    descricao: string;
}