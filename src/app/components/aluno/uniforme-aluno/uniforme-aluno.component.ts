import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Aluno } from 'src/app/core/aluno';
import { Acesso } from 'src/app/core/acesso';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { ToastService } from 'src/app/services/toast/toast.service';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { ControlContainer, NgForm } from '@angular/forms';
import { UniformeAluno } from '../../../core/uniforme-aluno';

@Component({
  selector: 'app-uniforme-aluno',
  templateUrl: './uniforme-aluno.component.html',
  styleUrls: ['./uniforme-aluno.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class UniformeAlunoComponent implements OnInit {

  public maskData = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  @Input() aluno: Aluno;
  
  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil  = new CarregarPerfil();

  mostrarTabela = false;

  maxDate = new Date(9999, 12, 31);
  minDate = new Date(1111, 1, 1);

  constructor(
    private toastService: ToastService,
    private router: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);
  }

  adicionarUniforme(index: number) {
    if(!this.aluno.atividades[index].uniformes) {
      this.aluno.atividades[index].uniformes = [];
    }
    this.aluno.atividades[index].uniformes.push(new UniformeAluno());
  }

  deletarUniforme(indexAtividade: number, indexUniforme: number) {
    this.aluno.atividades[indexAtividade].uniformes.splice(indexUniforme, 1);
  }
}
