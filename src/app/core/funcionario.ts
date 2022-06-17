import { ConclusaoParecer } from './conclusao-parecer';
import { ParecerEntrevistador } from './parecer-entrevistador';
import { Unidade } from './unidade';
import { TipoFuncionario } from './tipo-funcionario';
import { Cargo } from './cargo';
import { PessoaFisica } from './pessoa-fisica';
import { Empresa } from './empresa';
import { Time } from '@angular/common';
import { Departamento } from './departamento';
import { AlocacaoFuncionario } from './alocacao-funcionario';
import { Dependentes } from './dependentes';

export class Funcionario {
    id: number;
	matricula: string;
	dataAdmissao: Date;
	dataDemissao: Date;
	tipoFuncionario: string;
	salarioPretendido: number;
	cargo: Cargo;
    pessoasFisica: PessoaFisica;
    unidade: Unidade;
	dtHrEntrevista: Date;
    parecerEntrevistador: ParecerEntrevistador;
	descricaoParecerEntrevistador: string;
	conclusaoParecer: ConclusaoParecer;
	funcionarioEntrevistador: Funcionario;
	empresaFuncionario: Empresa;
	horaEntrevista?: string;
	descontaValeTransporte: boolean;
	departamento: Departamento;
	alocacoesFuncionario: AlocacaoFuncionario[];
	dependentes: Dependentes[];
	horaInicioJornada: string;
	horaFimJornada: string;
	descMotivoDemissao: string;
	dataUltimoExame: Date;
	nome: string;

}