import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { CategoriasContabeis } from '../../../../core/categorias-contabeis';
import { Projeto } from '../../../../core/projeto';

@Component({
  selector: 'categoria-contabil-cell',
  templateUrl: './categoria-contabil-cell.component.html',
  styleUrls: ['./categoria-contabil-cell.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CategoriaContabilCellComponent implements OnInit {

  @Input() categorias: CategoriasContabeis[];

  dados : any[];
  dadosTooltip = '';

  constructor() { }

  ngOnInit() {
    if(!this.dados) {
      this.dados = [];
    }

    if (!this.categorias && this.categorias.length === 0) {
      this.dados[0] =  '' ;
    }

    this.dados = this.categorias ? this.categorias.map(o => o.nome + '\n') : null;
    this.dadosTooltip = this.dados ? this.dados.slice(1).join('\n') : '' ;

    this.dadosTooltip = this.dadosTooltip.substring(0, this.dadosTooltip.length-1);
  }

  getPrimeiroRegistro(){
    return this.dados[0].substring(0, this.dados[0].length-1);
  }
}
