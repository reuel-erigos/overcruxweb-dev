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

  adicionarTurma() {
    const matricula = new AlunosTurma();
    matricula.oficinas = [];

    if (this.turma.id) {
      matricula.turma = _.cloneDeep(_.find(this.turmas, (t: Turmas) => t.id === this.turma.id));
      matricula.dataInicio = this.dataInicioMatricula;
      matricula.turma.oficinas.forEach(oficina => {

        const atividade = new AtividadeAluno();
        atividade.dataInicioAtividade = this.dataInicioMatricula;
        atividade.atividade           = oficina;

        matricula.oficinas.push(atividade);
      })
    }
    const oficinasSemConfiltos = this.validarDatasInicioMatriculadasNaTurma(matricula);
    if(oficinasSemConfiltos && oficinasSemConfiltos.length > 0) {
      const index = this.matriculas.findIndex(item => item.turma.id === matricula.turma.id);
      if(index >= 0) {
        this.matriculas[index].oficinas.push(...oficinasSemConfiltos);
      } else {
        matricula.oficinas = oficinasSemConfiltos;
        this.matriculas.push(matricula);
      }
    }
  }

  validarDatasInicioMatriculadasNaTurma(matricula: AlunosTurma) {

    const dataInicioMatricula = this.dataUtilService.getDataTruncata(matricula.dataInicio);
    const dataFimMatricula    = this.dataUtilService.getDataTruncata(matricula.dataDesvinculacao);
    const dataInicioTurma     = this.dataUtilService.getDataTruncata(matricula.turma.dataInicioTurma);
    const oficinas = [];

    if(dataFimMatricula && dataInicioMatricula.getTime() > dataFimMatricula.getTime()) {
      this.toastService.showAlerta('A data de fim da matrícula tem que maior ou igual à data de início.');
      return;
    }

    if(dataInicioMatricula.getTime() < dataInicioTurma.getTime()) {
      this.toastService.showAlerta('A data de início da matricula (' + dataInicioMatricula.toLocaleDateString() 
                                   +') é menor que a data de início da turma ('+ dataInicioTurma.toLocaleDateString() +')');
      return;
    }

    //Não permite que a data de início das oficinas sejam menores que a data de inicio da matrícula da turma
    if (matricula.oficinas) {
      matricula.oficinas.forEach(oficina => {
        let dataValida = true;
        const dataInicio = this.dataUtilService.getDataTruncata(oficina.dataInicioAtividade);
        const dataFim    = this.dataUtilService.getDataTruncata(oficina.dataDesvinculacao);

        
        if (dataInicio && dataFimMatricula && dataInicio.getTime() > dataFimMatricula.getTime()) {
          dataValida = false;
        }

        if( (!dataFim && dataFimMatricula) ||
            (dataFimMatricula && dataFim.getTime() > dataFimMatricula.getTime())) {
          dataValida = false;
        }

        if (dataInicio.getTime() < dataInicioMatricula.getTime()) {
           dataValida = false;
        }

        //Valida conflitos entres oficinas da turma
        const matriculasMesmaOficina = matricula.oficinas.filter(o => o.atividade.id === oficina.atividade.id && oficina.id != o.id);
        if(matriculasMesmaOficina) {
          matriculasMesmaOficina.forEach(m => {
            const matriculaConflito = this.dataUtilService.isEntreDatasTruncada(oficina.dataInicioAtividade, oficina.dataDesvinculacao, m.dataInicioAtividade, m.dataDesvinculacao);
            if(matriculasMesmaOficina) {
              dataValida = false;
            }            
          })
        } 
        if(dataValida) {
          oficinas.push(oficina);
        }

      });
      return this.recuperaOficinasSemConflito(oficinas);
    }
  }

  private recuperaOficinasSemConflito(matriculas: AtividadeAluno[]) {
    const oficinasComConflitos: AtividadeAluno[] = [];
    const oficinasSemConflitos: AtividadeAluno[] = [];
    this.matriculas.forEach(matricula => {
      const matriculasTurma   = matricula.oficinas;
      const outrasMatriculas  = matriculas;
      
      matriculasTurma.forEach(oficina => {
        let outrasMatriculasFiltrada = outrasMatriculas;
        if(oficina.id) {
          outrasMatriculasFiltrada = outrasMatriculas.filter(item => item.id !== oficina.id);
        }
        let temp: any[] = outrasMatriculasFiltrada.filter(om => ((om.atividade.domingo && oficina.atividade.domingo) || 
                                                         (om.atividade.segunda && oficina.atividade.segunda) || 
                                                         (om.atividade.terca   && oficina.atividade.terca)   || 
                                                         (om.atividade.quarta  && oficina.atividade.quarta)  || 
                                                         (om.atividade.quinta  && oficina.atividade.quinta)  || 
                                                         (om.atividade.sexta   && oficina.atividade.sexta)   || 
                                                         (om.atividade.sabado  && oficina.atividade.sabado)) 
                                                        &&
                                                        (
                                                          oficina.atividade.horaInicio >= om.atividade.horaInicio && oficina.atividade.horaInicio <= om.atividade.horaFim 
                                                          || 
                                                          oficina.atividade.horaFim >= om.atividade.horaInicio && oficina.atividade.horaFim <= om.atividade.horaFim
                                                        )
                                                        &&
                                                        this.dataUtilService.isEntreDatasTruncada( oficina.dataInicioAtividade, oficina.dataDesvinculacao, om.dataInicioAtividade, om.dataDesvinculacao)
                                                        );  
  
        
        if(temp.length > 0) {
          oficinasComConflitos.push(oficina)
        }                                         
      });
    });
    matriculas.forEach(item => {
      const possuiConflito = oficinasComConflitos.filter(itemOficina => itemOficina.atividade.id === item.atividade.id);
      if(!possuiConflito || possuiConflito.length === 0) {
        oficinasSemConflitos.push(item);
      }
    })
    return oficinasSemConflitos;
  }
}
