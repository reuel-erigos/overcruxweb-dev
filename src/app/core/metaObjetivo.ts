import {ObjetivoContrato} from "./objetivoContrato";
import {IndicadorMeta} from "./indicadorMeta";

export class MetaObjetivo {
    id: number;
    objetivoContrato: ObjetivoContrato;
    indicadoresMeta: IndicadorMeta[];
    codigo: string;
    descricao: string;
    usuarioAlteracao: number;
}