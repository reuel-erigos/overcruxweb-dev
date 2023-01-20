import { Movimentacoes } from './movimentacoes';
import { CategoriasContabeis } from './categorias-contabeis';
import { Departamento } from './departamento';
import { Material } from './material';
import { Unidade } from './unidade';
import { TributoItemMovimentacao } from './tributo-item-movimentacao';
import { PlanosContas } from './planos-contas';
import { Projeto } from './projeto';
export class ItensMovimentacoes{

    id:number;
	descricaoItemMovimentacao:string;
	categoria:any;
	categoriaAdicional:any;
	departamento:Departamento;
	material:Material;
	movimentacao:Movimentacoes;
	unidade:Unidade;
	quantidadeMaterial:number;
	valorTotalItem:number;
	valorUnitarioItem:number;
	pedidosMateriais:any;
	projeto: Projeto;

	tributos: TributoItemMovimentacao[];

}