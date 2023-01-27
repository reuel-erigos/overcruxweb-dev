import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'projeto-programa-cell',
  templateUrl: './projeto-programa-cell.component.html',
  styleUrls: ['./projeto-programa-cell.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjetoProgramaCellComponent implements OnInit {

  @Input() rateios: any[];

  dados : any[];
  dadosTooltip = '';

  constructor() { }

  ngOnInit() {
    if(!this.dados) {
      this.dados = [];
    }

    if (!this.rateios && this.rateios.length === 0) {
      this.dados[0] =  '' ;
    }

    this.dados = this.rateios ? this.rateios.map(o => (o.projeto && o.projeto.id ? o.projeto.nome : (o.programa && o.programa.id ? o.programa.nome: '')) + '\n') : null;
    this.dadosTooltip = this.dados ? this.dados.slice(1)
                                               //.map(o => (o.projeto && o.projeto.id ? o.projeto.nome : (o.programa && o.programa.id ? o.programa.nome: '')) + ', ')
                                               .join('\n') : '' ;

    this.dadosTooltip = this.dadosTooltip.substring(0, this.dadosTooltip.length-2);
  }

  getPrimeiroRegistro(){
    return this.dados[0].substring(0, this.dados[0].length-2);
  }
}
