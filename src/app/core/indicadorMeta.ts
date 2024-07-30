import {MetaObjetivo} from "./metaObjetivo";

export class IndicadorMeta {
    id: number;
    metaObjetivo: MetaObjetivo;
    codigo: string;
    descricao: string;
    indiceMinimo: string;
    acoesPrevistas: string;
    quantidadePlanoTrabalho: number;
    usuarioAlteracao: number;
}