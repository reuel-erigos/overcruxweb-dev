import { Contrato } from "./contrato";
import { Projeto } from "./projeto";

export class ProjetoContrato {
  id: number;
  projeto: Projeto;
  contrato: Contrato;
  dataInicioProjetoContrato: Date;
  dataFimProjetoContrato: Date;
  valorProjetoContrato: number;
}