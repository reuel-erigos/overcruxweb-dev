import { Avaliacao } from 'src/app/core/avaliacao';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dados-avaliacao',
  templateUrl: './dados-avaliacao.component.html',
  styleUrls: ['./dados-avaliacao.component.css']
})
export class DadosAvaliacaoComponent implements OnInit {

  @Input() avaliacao: Avaliacao;

  constructor() { }

  ngOnInit() {
  }

}
