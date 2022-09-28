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
import { AtividadeAluno } from '../../../core/atividade-aluno';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastService } from '../../../services/toast/toast.service';
import { AtividadeAlunoService } from '../../../services/atividade-aluno/atividade-aluno.service';
import { MatriculaService } from '../../../services/matricula/matricula.service';

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
  
  pinDataInicio = Date.now();

  constructor(
    private dataUtilService: DataUtilService,
    private activatedRoute: ActivatedRoute,
    private turmasService: TurmasService,
    private matriculaService: MatriculaService,
    private dialog: MatDialog,
    private toastService: ToastService,
    private atividadeAlunoService: AtividadeAlunoService,
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

  deletar(oficina: AtividadeAluno, indexMatricula: number, indexOficina: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: `Certeza que deseja excluir a matrícula?`,
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.matriculas[indexMatricula].oficinas.splice(indexOficina, 1);
        if (oficina.id) {
          this.atividadeAlunoService.excluir(oficina.id).subscribe(() => {
            this.toastService.showSucesso('Matrícula excluída com sucesso.');
          });
          if(this.matriculas[indexMatricula].oficinas.length === 0) {
            if(this.matriculas[indexMatricula].id) {
              this.matriculaService.excluir(this.matriculas[indexMatricula].id).subscribe(() => {
              });
            }
            this.matriculas.splice(indexMatricula, 1);
          }
        }
      } else {
        dialogRef.close();
      }
    });
  }
}
