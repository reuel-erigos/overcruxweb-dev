import { Contrato } from "./contrato";
import { Programa } from "./programa";

export class ProgramaContrato {
  id: number;
  programa: Programa;
  contrato: Contrato;
  dataInicioProgramaContrato: Date;
  dataFimProgramaContrato: Date;
  valorProgramaContrato: number;
}