import { Component, OnInit, Input } from '@angular/core';
import { CondicoesMoradiaService } from 'src/app/services/condicoes-moradia/condicoes-moradia.service';
import { PessoaFisica } from 'src/app/core/pessoa-fisica';
import { CondicoesMoradia } from 'src/app/core/condicoes-moradia';
import { Escola } from '../../../../core/escola';
import { EscolaService } from '../../../../services/escola/escola.service';

@Component({
  selector: 'escolar',
  templateUrl: './escolar.component.html',
  styleUrls: ['./escolar.component.css']
})
export class EscolarComponent implements OnInit {

  @Input() pessoaFisica: PessoaFisica;

  tipoEscola: any;
  condicoesMoradia: CondicoesMoradia[];
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
    private escolaService: EscolaService) { }

  ngOnInit() {
    this.pessoaFisica.condicoesMoradia = new CondicoesMoradia();

    this.condicaoMoradiaService.getAll().subscribe((condicoes: CondicoesMoradia[]) => {
      this.condicoesMoradia = condicoes;
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
    if(event.regiaoAdministrativa) {
      this.nomeRa = event.regiaoAdministrativa.nome;
    }
  }
}
