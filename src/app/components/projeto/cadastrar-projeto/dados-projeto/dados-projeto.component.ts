import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { Projeto } from 'src/app/core/projeto';
import { FuncionarioService } from 'src/app/services/funcionario/funcionario.service';
import { Funcionario } from 'src/app/core/funcionario';
import * as _ from 'lodash';

@Component({
  selector: 'dados-projeto',
  templateUrl: './dados-projeto.component.html',
  styleUrls: ['./dados-projeto.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class DadosProjetoComponent implements OnInit {

  @Input() projeto: Projeto;

  funcionarios: Funcionario[];

  constructor(private funcionarioService: FuncionarioService) { }

  ngOnInit() {
    this.funcionarioService.getAll().subscribe((funcionarios: Funcionario[]) => {
      this.funcionarios = funcionarios;
    });
  }

}
