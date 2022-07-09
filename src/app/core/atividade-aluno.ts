import { Aluno } from './aluno';
import { Atividade } from './atividade';
import { UniformeAluno } from './uniforme-aluno';

export class AtividadeAluno {
    id: number;
	descDesligamento: string;
	dataInicioAtividade: Date;
	dataDesvinculacao: Date;
	dataAlteracaoAtividade: Date;
	dataCadastroAtividade: Date;
	
	aluno: Aluno;
    atividade: Atividade;
    
	usuarioAlteracao: number;
	uniformes: UniformeAluno[];
}