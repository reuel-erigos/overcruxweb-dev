import { AtividadeAlunoService } from 'src/app/services/atividade-aluno/atividade-aluno.service';
import { AtividadeAluno } from 'src/app/core/atividade-aluno';
import { TurmasService } from './../../../services/turmas/turmas.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Acesso } from 'src/app/core/acesso';
import { Aluno } from 'src/app/core/aluno';
import { Atividade } from 'src/app/core/atividade';
import { Turmas } from 'src/app/core/turmas';
import { AlunosTurma } from 'src/app/core/alunos-turma';
import { AlunoService } from 'src/app/services/aluno/aluno.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast/toast.service';
import { MatriculaService } from 'src/app/services/matricula/matricula.service';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { tap } from 'rxjs/operators';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { AutenticadorService } from 'src/app/services/autenticador/autenticador.service';
import { FilterAlunos } from 'src/app/core/filter-alunos';
import { ComboAluno } from 'src/app/core/combo-aluno';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';


@Component({
  selector: 'cadastrar-matricula',
  templateUrl: './cadastrar-matricula.component.html',
  styleUrls: ['./cadastrar-matricula.component.css']
})
export class CadastrarMatriculaComponent implements OnInit {

  filtro: FilterAlunos;
  
  conflitos = [];

  matricula: AlunosTurma = new AlunosTurma();
  aluno: Aluno = new Aluno();

  turmas: Turmas[];
  turma: Turmas = new Turmas();

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil  = new CarregarPerfil();

  mostrarBotaoCadastrar = true;
  mostrarBotaoAtualizar = true;

  isAtualizar = false;
  localMatricula = null;

  oficinasSelecionadas = new FormControl();

  constructor(
    private matriculasService: MatriculaService,
    private atividadeAlunoService: AtividadeAlunoService,
    private dialog: MatDialog,
    private turmasService: TurmasService,
    private alunoService: AlunoService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private router: Router,
    private dataUtilService: DataUtilService,
    private autenticadorService: AutenticadorService
  ) {
  }


  ngOnInit() {
    this.limpar();

    this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);

    if (!this.perfilAcesso.insere) {
      this.mostrarBotaoCadastrar = false;
    }
    if (!this.perfilAcesso.altera) {
      this.mostrarBotaoAtualizar = false;
    }

    this.turmasService.getAll().subscribe((turmas: Turmas[]) => {
      this.turmas = turmas;
    });

    const id = this.activatedRoute.snapshot.queryParams.id ? this.activatedRoute.snapshot.queryParams.id : null;
    if (id) {
      this.isAtualizar = true;
      this.matriculasService.getById(id).subscribe((matricula: AlunosTurma) => {
        this.matricula = matricula;
        this.filtro.aluno.id = this.matricula.aluno.id;
        this.matricula.oficinas.sort((a,b) => {
          if (a.dataInicioAtividade > b.dataInicioAtividade) {return 1;}
          if (a.dataInicioAtividade < b.dataInicioAtividade) {return -1;}
          return 0;
          });
      });
    }

    
  }

  mostrarBotaoLimpar() {
    if (this.isAtualizar) { return false; }
    if (!this.mostrarBotaoAtualizar) { return false; }
    if (!this.mostrarBotaoCadastrar) { return false; }

    return true;
  }

  cadastrar() {
    this.matriculasService.getFilter(this.matricula.turma.id, this.matricula.aluno.id, null).subscribe((resp: AlunosTurma[]) => {
      if(resp && resp.length > 0) {
        this.toastService.showAlerta('O aluno já possui uma matrícula para a turma selecionada.');
      } else {
        if (!this.validarDatasInicioMatriculadasNaTurma() ) { 
              return; 
        }
        this.atividadeAlunoService.getAllByAlunoAndInstituicao(this.matricula.aluno.id).subscribe((matriculas: AtividadeAluno[]) => {
          let hasDataMatriculaConflitando = this.validarConflitosDeMatriculas(matriculas);
          if(hasDataMatriculaConflitando) {
            this.toastService.showAlerta('Essas matrículas estão conflitando com outras matrículas no mesmo período.');
          } else {
            this.matriculasService.cadastrar(this.matricula).subscribe(
              (matriculaSalva: AlunosTurma) => {
              this.toastService.showSucesso('Matricula do aluno cadastrada com sucesso!');
              this.autenticadorService.revalidarSessao();
              this.cancelar();
            });
          }
        });
      }
    });
  }

  validarDatasInicioMatriculadasNaTurma(): boolean {
    let dataValida = true;

    const dataInicioMatricula = this.dataUtilService.getDataTruncata(this.matricula.dataInicio);
    const dataFimMatricula    = this.dataUtilService.getDataTruncata(this.matricula.dataDesvinculacao);

    const dataInicioTurma     = this.dataUtilService.getDataTruncata(this.matricula.turma.dataInicioTurma);
    const dataFimTurma        = this.dataUtilService.getDataTruncata(this.matricula.turma.dataFimTurma);


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
    if (this.matricula.oficinas) {
      this.matricula.oficinas.forEach(oficina => {
        const dataInicio = this.dataUtilService.getDataTruncata(oficina.dataInicioAtividade);
        const dataFim    = this.dataUtilService.getDataTruncata(oficina.dataDesvinculacao);

        
        if (dataInicio && dataFimMatricula && dataInicio.getTime() > dataFimMatricula.getTime()) {
          this.toastService.showAlerta(oficina.atividade.descricao.toUpperCase() +' não pode ter data de início maior que a data de fim da matrícula.');
          dataValida = false;
          return dataValida;
        }

        if( (!dataFim && dataFimMatricula) ||
            (dataFimMatricula && dataFim.getTime() > dataFimMatricula.getTime())) {
          this.toastService.showAlerta(oficina.atividade.descricao.toUpperCase() +' não pode ter data de desvinculação maior que a data de desvinculação da matrícula.');
          dataValida = false;
          return dataValida;
        }


        if (dataInicio.getTime() < dataInicioMatricula.getTime()) {
           this.toastService.showAlerta(oficina.atividade.descricao.toUpperCase() +' não pode ter data de início menor que a data de início da matrícula.');
           dataValida = false;
           return dataValida;
        }

        //Valida conflitos entres oficinas da turma
        const matriculasMesmaOficina = this.matricula.oficinas.filter(o => o.atividade.id === oficina.atividade.id && oficina.id != o.id);
        if(matriculasMesmaOficina) {
          matriculasMesmaOficina.forEach(m => {
            const matriculaConflito = this.dataUtilService.isEntreDatasTruncada(oficina.dataInicioAtividade, oficina.dataDesvinculacao, m.dataInicioAtividade, m.dataDesvinculacao);
            if(matriculasMesmaOficina) {
              this.toastService.showAlerta('Favor verificar conflitos de períodos na oficina >>> ' + oficina.atividade.descricao.toUpperCase());
              dataValida = false;
              return dataValida;
            }            
          })
        } 

      });
    }

    return dataValida;
  }


  private validarConflitosDeMatriculas(matriculas: AtividadeAluno[]): boolean {
    this.conflitos = [];

    const matriculasTurma   = this.matricula.oficinas;
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
        this.conflitos.push({oficina: oficina, conflitos: temp});  
      }                                         
    });

    return this.conflitos.length > 0;
  }


  atualizar() {
    if (!this.validarDatasInicioMatriculadasNaTurma() ) { return; }

    this.atividadeAlunoService.getAllByAlunoAndInstituicao(this.matricula.aluno.id)
    .subscribe((matriculas: AtividadeAluno[]) => {
      let hasDataMatriculaConflitando = this.validarConflitosDeMatriculas(matriculas);

      if(hasDataMatriculaConflitando) {
        this.toastService.showAlerta('Essas matrículas estão conflitando com outras matrículas no mesmo período.');
      } else {
        this.matriculasService.alterar(this.matricula).subscribe(() => {
          this.toastService.showSucesso('Matricula do aluno atualizada com sucesso!');
          this.autenticadorService.revalidarSessao();
          this.cancelar();
        });
      }
    });
  }

  limpar() {
    this.matricula = new AlunosTurma();
    this.matricula.aluno = new Aluno();
    this.matricula.turma = new Turmas();
    this.matricula.oficinas = [];
    this.aluno = new Aluno();
    this.turma = new Turmas();
    this.localMatricula = null;

    this.filtro = new FilterAlunos();
    this.filtro.aluno = new ComboAluno();
  }

  cancelar() {
    this.router.navigate(['matriculas']);
  }
  
  mostrarDadosAluno(idAluno) {
    this.alunoService.getById(idAluno).subscribe((aluno: Aluno) => {
      this.matricula.aluno = aluno;
    })
  }

  carregarDadosTurma() {
    this.matricula.oficinas = [];

    if (this.matricula.turma.id) {
      this.matricula.turma = _.cloneDeep(_.find(this.turmas, (t: Turmas) => t.id === this.matricula.turma.id));

      this.matricula.turma.oficinas.forEach(oficina => {

        const atividade = new AtividadeAluno();
        atividade.dataInicioAtividade = this.matricula.dataInicio;
        atividade.dataDesvinculacao   = this.matricula.dataDesvinculacao;
        atividade.aluno               = this.matricula.aluno;
        atividade.atividade           = oficina;

        this.matricula.oficinas.push(atividade);
      })
    }
  }

  carregarDataInicioOficinas() {
    this.matricula.oficinas.forEach(oficina => {
      oficina.dataInicioAtividade = oficina.dataInicioAtividade || this.matricula.dataInicio;
      oficina.dataDesvinculacao   = oficina.dataDesvinculacao || this.matricula.dataDesvinculacao;
    })
  }

  carregaDescricaoDesligamento() {
    this.matricula.oficinas.forEach(oficina => {
      oficina.descDesligamento = oficina.descDesligamento || this.matricula.descricaoDesligamento;
    })
  }

  novaMatricula() {
    const nova: AtividadeAluno = new AtividadeAluno();
    nova.aluno = this.matricula.aluno;
    nova.atividade = new Atividade();
    this.matricula.oficinas.push(nova);
  }

  deletarOficina(oficina: AtividadeAluno) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: `Certeza que deseja excluir a matrícula ?`,
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        const index = this.matricula.oficinas.indexOf( this.matricula.oficinas.find(reg => reg === oficina));
        if (index >= 0) {
          this.matricula.oficinas.splice(index, 1);
    
          if (oficina.id) {
            this.atividadeAlunoService.excluir(oficina.id).subscribe(() => {
              this.toastService.showSucesso('Matrícula excluída com sucesso.');
            });
          }
        }
      } else {
        dialogRef.close();
      }
    });
  }

  getDadosTurma(turma: Turmas) {
    return turma.descricao + (turma.programa ? ' - Programa: ' + turma.programa.nome : '') + 
           (turma.projeto ? ' - Projeto: ' + turma.projeto.nome : '') +
           ' - Turno: ' + turma.turno + ' - Início: ' + new Date(turma.dataInicioTurma).toLocaleDateString();
  }


  getDadosConflito(reg: AtividadeAluno) {
    const dias = [];

    reg.atividade.domingo ? dias.push('Domingo') : ''; 
    reg.atividade.segunda ? dias.push('Segunda') : '';
    reg.atividade.terca ? dias.push('Terça') : ''; 
    reg.atividade.quarta ? dias.push('Quarta') : ''; 
    reg.atividade.quinta ? dias.push('Quinta') : ''; 
    reg.atividade.sexta ? dias.push('Sexta') : ''; 
    reg.atividade.sabado ? dias.push('Sábado') : ''; 

    return dias.join(', ');
  }

  getPeriodoConflito(atividade: AtividadeAluno) {
    if(!atividade.dataDesvinculacao) {
      return 'a partir de ' + this.dataUtilService.getDataTruncata(atividade.dataInicioAtividade).toLocaleDateString();
    }
    
    return this.dataUtilService.getDataTruncata(atividade.dataInicioAtividade).toLocaleDateString() + ' até ' +
           this.dataUtilService.getDataTruncata(atividade.dataDesvinculacao).toLocaleDateString()
  }


  onValorChange(event: any) {
    this.filtro.aluno = event;
    if(this.filtro.aluno){
      this.mostrarDadosAluno(this.filtro.aluno.id);
    } else {
      this.matricula.aluno = null;
    }
  }
  
  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }

}
