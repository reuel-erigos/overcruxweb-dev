import { Component, OnInit, Input } from '@angular/core';
import { CondicoesMoradiaService } from 'src/app/services/condicoes-moradia/condicoes-moradia.service';
import { PessoaFisica } from 'src/app/core/pessoa-fisica';
import { CondicoesMoradia } from 'src/app/core/condicoes-moradia';

@Component({
  selector: 'escolar',
  templateUrl: './escolar.component.html',
  styleUrls: ['./escolar.component.css']
})
export class EscolarComponent implements OnInit {

  @Input() pessoaFisica: PessoaFisica;

  condicoesMoradia: CondicoesMoradia[];

  tipoEscola: any[] = [
    {tipo: 'Pública', flag: 'P'},
    {tipo: 'Privada', flag: 'R'}
  ];

  
  turno: any[] = [
    {tipo: 'Matutino', flag: 'M'},
    {tipo: 'Vespertino', flag: 'V'},
    {tipo: 'Noturno', flag: 'N'}
  ];

  constructor(private condicaoMoradiaService: CondicoesMoradiaService) { }

  ngOnInit() {
    this.pessoaFisica.condicoesMoradia = new CondicoesMoradia();

    this.condicaoMoradiaService.getAll().subscribe((condicoes: CondicoesMoradia[]) => {
        this.condicoesMoradia = condicoes;
    });
   }
}
