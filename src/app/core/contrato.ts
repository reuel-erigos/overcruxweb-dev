import {Empresa} from "./empresa";
import {ProgramaContrato} from "./programaContrato";
import {ProjetoContrato} from "./projetoContrato";
import {TipoContrato} from "./tipo-contrato";
import {ObjetivoContrato} from "./objetivoContrato";

export class Contrato {
    id: number;
    descricao: string;
    tipoContrato: TipoContrato;
    numeroContrato: string;
    descricaoObjetoContrato: string;
    descricaoMetaQuantitativa: string;
    numeroProcessoTecnico: string;
    numeroProcessoGestao: string;
    numeroProcessoPagamento: string;
    dataInicioVigencia: number;
    dataFimVigencia: number;
    valorContrato: number;
    empresa: Empresa;
    idInstituicao: number;
    usuarioAlteracao: number;
    programasContrato: ProgramaContrato[];
    projetosContrato: ProjetoContrato[];
    objetivosContrato: ObjetivoContrato[];
}
