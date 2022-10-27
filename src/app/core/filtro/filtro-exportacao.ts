import { ComboPessoaFisica } from "../combo-pessoa-fisica";
import { ComboPrograma } from "../combo-programa";
import { ComboProjeto } from "../combo-projeto";
import { Unidade } from "../unidade";

export class FiltroExportacao{
    beneficiario: string;
    cpfAluno: string;
    maeAluno: string;
    paiAluno: string;
    responsavel: ComboPessoaFisica;
    dataInicioEntradaInstituicao: Date;
    dataFimEntradaInstituicao: Date;
    dataInicioVigenciaInstituicao: Date;
    dataFimVigenciaInstituicao: Date;
    programa: number;
    projeto: number;
    unidade: number;
    ativo: Boolean;
  }
  