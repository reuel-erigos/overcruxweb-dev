import { Aluno } from './aluno';
import { GrausParentesco } from './graus-parentesco';
import { PessoaFisica } from './pessoa-fisica';
import { ResponsaveisAluno } from './responsaveis-aluno';
import { VulnerabilidadesFamiliar } from './vulnerabilidades-familiar';

export class Familiares {
    id: number;
	descOutrasInformacoes: string;
	descDesligamento: string;
    situacaoParentesco: string;

    pessoasFisica: PessoaFisica;
    aluno: Aluno;

	dataCadastro: Date;
    dataDesligamento: Date;

    usuariosSistema: number;

    responsaveis: ResponsaveisAluno[];
    vulnerabilidades: VulnerabilidadesFamiliar[];

    nome?:string;

    grauParentesco: GrausParentesco;
}