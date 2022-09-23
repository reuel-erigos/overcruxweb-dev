import { Turmas } from './../../core/turmas';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AlunosTurma } from 'src/app/core/alunos-turma';
import { Aluno } from 'src/app/core/aluno';
import { Atividade } from 'src/app/core/atividade';
import { Acesso } from 'src/app/core/acesso';
import { AlunoService } from 'src/app/services/aluno/aluno.service';
import { AtividadeService } from 'src/app/services/atividade/atividade.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatriculaService } from 'src/app/services/matricula/matricula.service';
import * as _ from 'lodash';
import { TurmasService } from 'src/app/services/turmas/turmas.service';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { ToastService } from 'src/app/services/toast/toast.service';
import { FilterAlunos } from 'src/app/core/filter-alunos';
import { ComboAluno } from 'src/app/core/combo-aluno';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { BaseComponent } from '../../architeture/base/base.component';
import { FormBuilder } from '@angular/forms';
import { PageInfo } from '../../core/page-info';
import { FiltroAlunoTurma } from '../../core/filtro/filtro-aluno-turma';

@Component({
  selector: 'matricula',
  templateUrl: './matricula.component.html',
  styleUrls: ['./matricula.component.css']
})
export class MatriculaComponent extends BaseComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  filtro: FilterAlunos = new FilterAlunos();

  matriculas: AlunosTurma[];
  matricula: AlunosTurma = new AlunosTurma();

  atividades: Atividade[];
  atividadesFiltrada: Atividade[];

  turmas: Turmas[];


  msg: string;
  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil = new CarregarPerfil();

  mascaraCpf = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/,];
  mostrarTabela = false;

  displayedColumns: string[] = ['turma', 'aluno', 'dataInicio', 'acoes'];
  dataSource: MatTableDataSource<AlunosTurma> = new MatTableDataSource();

  constructor(
    private formBuilder: FormBuilder,
    private matriculasService: MatriculaService,
    private turmasService: TurmasService,
    private atividadeService: AtividadeService,
    private alunoService: AlunoService,
    private toastService: ToastService,
    private router: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);

    this.dataSource.paginator = this.paginator;

    this.atividadeService.getAllCombo().subscribe((atividades: Atividade[]) => {
      this.atividades = atividades.filter(atividade => atividade.idTurma);
      this.atividadesFiltrada = this.atividades;
    });

    this.turmasService.getAllCombo().subscribe((turmas: Turmas[]) => {
      this.turmas = turmas;
    });
    this.createForm();
    this.limpar();
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      beneficiario: [null],
      cpf: [null],
      idTurma: [null],
      idOficina: [null],
    });
  }


  limpar() {
    this.mostrarTabela = false;
    this.dataSource.data = [];
    this.atividadesFiltrada = this.atividades;
    this.form.reset();
  }

  consultar() {
    const pageInfo = new PageInfo();
    if(this.paginator) {
      this.paginator.firstPage();
    }
    this.consultarMatriculas(pageInfo);
  }

  consultarMatriculas(pageInfo: PageInfo) {
    const filtro = this.createFiltro();
    this.matriculasService.listFilteredAndPaged(pageInfo, filtro).subscribe((resp: any) => {
        this.numberItens = resp.totalElements;
        this.verificaMostrarTabela(resp.content);
      });
  }

  private createFiltro() {
    const filtro = new FiltroAlunoTurma();
    filtro.beneficiario = this.getValueForm(this.form, 'beneficiario');
    filtro.cpf = this.getValueForm(this.form, 'cpf');
    filtro.idOficina = this.getValueForm(this.form, 'idOficina');
    filtro.idTurma = this.getValueForm(this.form, 'idTurma');
    if(filtro.cpf) {
      filtro.cpf = filtro.cpf.replace(/[^0-9]/g,'');
    }
    return filtro;
  }

  onEventPaginate(event?: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    const pageInfo = new PageInfo();
    pageInfo.pageSize = this.pageSize;
    pageInfo.actualPage = this.pageIndex;
    this.consultarMatriculas(pageInfo);
  }


  atualizar(matricula: AlunosTurma) {
    this.router.navigate(['/matriculas/cadastrar'], { queryParams: { id: matricula.id } });
  }

  deletar(matricula: AlunosTurma) {
    this.chamaCaixaDialogo(matricula);
  }

  chamaCaixaDialogo(matricula: AlunosTurma) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: `Certeza que deseja excluir a matricula ?`,
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.matriculasService.excluir(matricula.id).subscribe(() => {
          this.matricula.id = null;
          this.consultar();
          this.toastService.showSucesso('Matrícula excluída com sucesso.')
        });
      } else {
        dialogRef.close();
      }
    }
    );
  }


  verificaMostrarTabela(matriculas: AlunosTurma[]) {
    if (!matriculas || matriculas.length === 0) {
      this.mostrarTabela = false;
      this.msg = 'Nenhuma matricula cadastrada.';
    } else {
      this.mostrarTabela = true;
    }
    this.dataSource.data = matriculas ? matriculas : [];
  }


  onValorChange(registro: any) {
    if (registro) {
      this.filtro.aluno = registro;
    } else {
      this.filtro.aluno = new ComboAluno();
    }
  }

  changeTurma() {
    const idTurma = this.getValueForm(this.form, 'idTurma');
    if(idTurma) {
      this.atividadesFiltrada = this.atividades.filter(atividade => atividade.idTurma === idTurma);
    } else {
      this.atividadesFiltrada = this.atividades;
    }
    this.setValue(this.form, 'idOficina', null)
  }
}
