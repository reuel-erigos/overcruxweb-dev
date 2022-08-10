import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CondicoesMoradiaService } from 'src/app/services/condicoes-moradia/condicoes-moradia.service';
import { PessoaFisica } from 'src/app/core/pessoa-fisica';
import { CondicoesMoradia } from 'src/app/core/condicoes-moradia';
import { Escola } from '../../../../core/escola';
import { EscolaService } from '../../../../services/escola/escola.service';
import { SerieEscolar } from '../../../../core/serie-escolar';
import { SerieEscolarService } from '../../../../services/serie-escolar/serie-escolar.service';

@Component({
  selector: 'escolar',
  templateUrl: './escolar.component.html',
  styleUrls: ['./escolar.component.css']
})
export class EscolarComponent implements OnInit, OnChanges {

  @Input() pessoaFisica: PessoaFisica;

  tipoEscola: any;
  condicoesMoradia: CondicoesMoradia[];
  seriesEcolares: SerieEscolar[];
  nomeRa: string;

  tipoEscolaList: any[] = [
    { tipo: 'Pública', flag: 'P' },
    { tipo: 'Privada', flag: 'R' }
  ];


  turno: any[] = [
    { tipo: 'Matutino', flag: 'M' },
    { tipo: 'Vespertino', flag: 'V' },
    { tipo: 'Noturno', flag: 'N' }
  ];

  escolas: Escola[] = [];

  constructor(private condicaoMoradiaService: CondicoesMoradiaService,
    private escolaService: EscolaService,
    private serieEscolarService: SerieEscolarService) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.pessoaFisica && changes.pessoaFisica.currentValue) {
      if(changes.pessoaFisica.currentValue.escola) {
        if(changes.pessoaFisica.currentValue.escola.regiaoAdministrativa) {
          this.nomeRa = changes.pessoaFisica.currentValue.escola.regiaoAdministrativa.nome;
        } 
        this.tipoEscola =  changes.pessoaFisica.currentValue.escola.tipo;
        this.carregarEscolas();
      }
    }
  }

  ngOnInit() {
    this.pessoaFisica.condicoesMoradia = new CondicoesMoradia();

    this.condicaoMoradiaService.getAll().subscribe((condicoes: CondicoesMoradia[]) => {
      this.condicoesMoradia = condicoes;
    });
    this.serieEscolarService.getAll().subscribe((seriesEcolares: SerieEscolar[]) => {
      this.seriesEcolares = seriesEcolares;
    });
  }

  carregarEscolas() {
    if (this.tipoEscola) {
      this.escolaService.getAllEscolasByCombo(this.tipoEscola).subscribe((escolas: Escola[]) => {
        this.escolas = escolas;
      });
    }
  }

  preencherRa(event: Escola) {
    if(event && event.regiaoAdministrativa) {
      this.nomeRa = event.regiaoAdministrativa.nome;
    } else {
      this.nomeRa = null;
    }
  }
}
