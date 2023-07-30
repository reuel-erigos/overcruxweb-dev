import { Instituicao } from './instituicao';

export class CategoriasContabeis{
    id:number;
    categoriaSuperior:CategoriasContabeis;
	tipo:string;	
	nome:string;
	meta: string;
	descricaoCategoria: string;
	codigoCategoriaContabil: string;
	instituicao: Instituicao;
	sintetica:boolean;
}

