import { Instituicao } from './instituicao';

export class CategoriasContabeis{
    id:number;
    categoriaSuperior:CategoriasContabeis;
	tipo:string;	
	nome:string;
	descricaoCategoria: string;
	codigoCategoriaContabil: string;
	instituicao: Instituicao;
}

