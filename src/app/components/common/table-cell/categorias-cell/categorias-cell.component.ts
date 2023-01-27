import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Movimentacoes } from 'src/app/core/movimentacoes';

@Component({
  selector: 'categorias-cell',
  templateUrl: './categorias-cell.component.html',
  styleUrls: ['./categorias-cell.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CategoriasCellComponent implements OnInit {

  @Input() movimento: Movimentacoes;

  dados : any[];
  dadosTooltip = '';

  constructor() { }

  ngOnInit() {
    if(!this.dados) {
      this.dados = [];
    }

    if (!this.movimento.categoriasMovimentos && this.movimento.categoriasMovimentos.length === 0) {
      this.dados[0] =  '' ;
    }

    if(this.movimento.categoriasMovimentos ) {
      this.dados = this.movimento.categoriasMovimentos.map(item => {
        if(item.categoriaAdicional && item.categoriaAdicional.id) {
          return 'Conta Destino: ' + item.categoriaDestino.nome + '<br/>' +
          'Conta Origem : '+ item.categoriaOrigem.nome + '<br/>' +
          'Conta Adicional : '+ item.categoriaAdicional.nome + '<br/>';
        } else {
          return 'Conta Destino: ' + item.categoriaDestino.nome + '<br/>' +
          'Conta Origem : '+ item.categoriaOrigem.nome + '<br/>';
        }
      });
    }

    this.dadosTooltip = this.dados ? this.dados.slice(1).join('\n') : '' ;
    this.dadosTooltip = this.dadosTooltip.substring(0, this.dadosTooltip.length-2);
  }

  getPrimeiroRegistro(){
    return this.dados[0].substring(0, this.dados[0].length-2);
  }
  
}
