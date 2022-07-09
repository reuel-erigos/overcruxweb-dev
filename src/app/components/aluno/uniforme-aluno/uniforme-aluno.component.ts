import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';


import { AtividadeAluno } from 'src/app/core/atividade-aluno';
import { Aluno } from 'src/app/core/aluno';
import { Atividade } from 'src/app/core/atividade';
import { Acesso } from 'src/app/core/acesso';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { ToastService } from 'src/app/services/toast/toast.service';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { UniformeEntregeAlunoService } from '../../../services/uniforme-entregue-aluno/uniforme-entrege-aluno.service';
import { AtividadeAlunoService } from '../../../services/atividade-aluno/atividade-aluno.service';
import { ControlContainer, NgForm } from '@angular/forms';
import { UniformeAluno } from '../../../core/uniforme-aluno';

@Component({
  selector: 'app-uniforme-aluno',
  templateUrl: './uniforme-aluno.component.html',
  styleUrls: ['./uniforme-aluno.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class UniformeAlunoComponent implements OnInit,  OnChanges {

  public maskData = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  @Input() aluno: Aluno;
  // Campos de busca
  atividadesAlunos: AtividadeAluno[];
  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil  = new CarregarPerfil();

  mostrarTabela = false;

  maxDate = new Date(9999, 12, 31);
  minDate = new Date(1111, 1, 1);

  constructor(
    private atividadeAlunoService: AtividadeAlunoService,
    private toastService: ToastService,
    private router: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.aluno.currentValue.id) {
      this.consultar();
    }
  }

  consultar() {
    this.atividadeAlunoService.getAllUniformeByAlunoAndInstituicao(this.aluno.id)
    .subscribe((atividadesAluno: AtividadeAluno[]) => {

      if (atividadesAluno && atividadesAluno.length === 0) {
        this.toastService.showAlerta('O aluno não está matriculado em nenhuma atividade.');
      } else {
        this.atividadesAlunos = atividadesAluno;
      }
    });
  }

  adicionarUniforme(index: number) {
    if(!this.atividadesAlunos[index].uniformes) {
      this.atividadesAlunos[index].uniformes = [];
    }
    this.atividadesAlunos[index].uniformes.push(new UniformeAluno());
  }

  deletarUniforme(indexAtividade: number, indexUniforme: number) {
    this.atividadesAlunos[indexAtividade].uniformes.splice(indexUniforme, 1);
  }
}
