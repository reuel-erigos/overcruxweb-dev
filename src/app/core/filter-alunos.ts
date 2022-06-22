import { ComboAluno } from './combo-aluno';
import { ComboPessoaFisica } from './combo-pessoa-fisica';

export class FilterAlunos{
	aluno: ComboAluno;
	maeAluno: ComboPessoaFisica;
	cpfAluno: ComboPessoaFisica;
	dataInicioEntradaInstituicao: Date;
  	dataFimEntradaInstituicao: Date;
}