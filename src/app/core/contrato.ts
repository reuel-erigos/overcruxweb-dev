import { Empresa } from "./empresa";
import { ProgramaContrato } from "./programaContrato";
import { ProjetoContrato } from "./projetoContrato";
import { TipoContrato } from "./tipo-contrato";

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
  dataInicioVigencia: string;
  dataFimVigencia: string;
  valorContrato: number;
  empresa: Empresa;
  idInstituicao: number;
  usuarioAlteracao: number;
  programasContrato: ProgramaContrato[];
  projetosContrato: ProjetoContrato[];
}
