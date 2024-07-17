import { Contrato } from "./contrato";
import { Programa } from "./programa";

export class ProgramaContrato {
  id: number;
  programa: Programa;
  contrato: Contrato;
  dataInicioProgramaContrato: string;
  dataFimProgramaContrato: string;
  valorProgramaContrato: number;
}