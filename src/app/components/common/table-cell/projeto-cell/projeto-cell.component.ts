import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Projeto } from '../../../../core/projeto';

@Component({
  selector: 'projeto-cell',
  templateUrl: './projeto-cell.component.html',
  styleUrls: ['./projeto-cell.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjetoCellComponent implements OnInit {

  @Input() projetos: Projeto[];

  dados : any[];
  dadosTooltip = '';

  constructor() { }

  ngOnInit() {
    if(!this.dados) {
      this.dados = [];
    }

    if (!this.projetos && this.projetos.length === 0) {
      this.dados[0] =  '' ;
    }

    this.dados = this.projetos ? this.projetos.map(o => o.nome + '\n') : null;
    this.dadosTooltip = this.dados ? this.dados.slice(1).join('\n') : '' ;

    this.dadosTooltip = this.dadosTooltip.substring(0, this.dadosTooltip.length-1);
  }

  getPrimeiroRegistro(){
    return this.dados[0].substring(0, this.dados[0].length-1);
  }
}
