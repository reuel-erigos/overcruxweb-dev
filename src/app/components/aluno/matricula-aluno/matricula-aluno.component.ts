import { Component, Input, OnInit } from '@angular/core';
import { Acesso } from 'src/app/core/acesso';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { ControlContainer, NgForm } from '@angular/forms';
import { DataUtilService } from '../../../services/commons/data-util.service';
import { AlunosTurma } from '../../../core/alunos-turma';
import { Turmas } from '../../../core/turmas';
import { TurmasService } from '../../../services/turmas/turmas.service';

@Component({
  selector: 'app-matricula-aluno',
  templateUrl: './matricula-aluno.component.html',
  styleUrls: ['./matricula-aluno.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class MatriculaAlunoComponent implements OnInit {

  public maskData = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  @Input() matriculas: AlunosTurma[];
  turma: Turmas = new Turmas();
  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil  = new CarregarPerfil();

  mostrarTabela = false;
  turmas: Turmas[];
  dataInicioMatricula: Date = new Date();

  constructor(
    private dataUtilService: DataUtilService,
    private activatedRoute: ActivatedRoute,
    private turmasService: TurmasService,
  ) { }

  ngOnInit() {
    this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);
    this.turmasService.getAll().subscribe((turmas: Turmas[]) => {
      this.turmas = turmas;
    });
  }

  getDadosTurma(turma: Turmas) {
    return turma.descricao + (turma.programa ? ' - Programa: ' + turma.programa.nome : '') + 
           (turma.projeto ? ' - Projeto: ' + turma.projeto.nome : '') +
           ' - Turno: ' + turma.turno + ' - Início: ' + new Date(turma.dataInicioTurma).toLocaleDateString();
  }

  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }

  carregarDadosTurma() {
    // this.matricula.oficinas = [];

    // if (this.matricula.turma.id) {
    //   this.matricula.turma = _.cloneDeep(_.find(this.turmas, (t: Turmas) => t.id === this.matricula.turma.id));

    //   this.matricula.turma.oficinas.forEach(oficina => {

    //     const atividade = new AtividadeAluno();
    //     atividade.dataInicioAtividade = this.matricula.dataInicio;
    //     atividade.dataDesvinculacao   = this.matricula.dataDesvinculacao;
    //     atividade.aluno               = this.matricula.aluno;
    //     atividade.atividade           = oficina;

    //     this.matricula.oficinas.push(atividade);
    //   })
    // }
  }
}
