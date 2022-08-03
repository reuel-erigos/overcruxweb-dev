import { TiposPublicoPrioritario } from './tipos-publico-prioritario';
import { NiveisTurmas } from './niveis-turmas';
import { VulnerabilidadesAluno } from './vulnerabilidades-aluno';
import { Unidade } from './unidade';
import { PessoaFisica } from './pessoa-fisica';
import { EncaminhamentoAluno } from './encaminhamento-aluno';
import { MotivoDesligamento } from './motivo-desligamento';
import { Programa } from './programa';
import { Projeto } from './projeto';
import { BeneficioSocialPessoaFisica } from './beneficio-social-pessoa-fisica';
import { Familiares } from './familiares';
import { ResponsaveisAluno } from './responsaveis-aluno';
import { AtividadeAluno } from './atividade-aluno';


export class Aluno {
	id: number;
	descProblemaSaude: string;
	descMedicamentosControlados: string;
	descOutrasInformacoes: string;
	descFormaIngressoEntidade: string;
	atendidoOrgaoRede: string;
	observacoes: string;
	
	dataEncaminhamento: Date;
	dataEntrada: Date;
	dataDesligamento: Date;
	dataCadastro: Date;
	dataAlteracaoCadastro: Date;
	descDesligamento: string;

    pessoaFisica: PessoaFisica;
	unidade: Unidade;
	
	moraPais: boolean;
	paisCasados: boolean;
	matriculadoEscPub: string;
	descBuscaEscola: string;
	publicoPrioritario: string;
	matriculaAluno: string;
	nivelTurma: NiveisTurmas;

	vulnerabilidades: VulnerabilidadesAluno[];
	encaminhamentos: EncaminhamentoAluno[];
	benefeciosSociaisPessoaFisica: BeneficioSocialPessoaFisica[];

	tiposPublicoPrioritario:TiposPublicoPrioritario;
	motivoDesligamento:MotivoDesligamento;

	dataSugestaoDesligamento:Date;
	descricaoSugestaoDesligamento:String;
	programa: Programa;
	projeto: Projeto;
	
	observacaoDeclaracaoPasse: string;
	dataDeclaracaoPasse: Date;
	observacaoDeclaracaoMatricula: string;
	dataDeclaracaoMatricula: Date;
	participaApresentacaoExterna: boolean;

	stAtivo: boolean;

	nome?: string;
	nomeMae?: string;
	cpf?: string;

	//Utilizado para a aba de familiar no cadastro de aluno, é o responsavel vigente
	familiar: Familiares;
	responsavelVigente: ResponsaveisAluno;
	
	atividades: AtividadeAluno[];
}