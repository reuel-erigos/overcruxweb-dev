import { AfterContentInit, Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Aluno } from 'src/app/core/aluno';
import { Router, ActivatedRoute } from '@angular/router';
import { AlunoService } from 'src/app/services/aluno/aluno.service';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { Acesso } from 'src/app/core/acesso';
import { CpfPipe } from 'src/app/pipes/cpf.pipe';
import * as _ from 'lodash';
import { FuncoesUteisService } from 'src/app/services/commons/funcoes-uteis.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { DataUtilService } from '../../services/commons/data-util.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FiltroAluno } from '../../core/filtro/filtro-aluno';
import { BaseComponent } from '../../architeture/base/base.component';
import { PageInfo } from '../../core/page-info';

@Component({
  selector: 'app-aluno',
  templateUrl: './aluno.component.html',
  styleUrls: ['./aluno.component.css'],
  providers: [CpfPipe],
})
export class AlunoComponent extends BaseComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  alunos: Aluno[];

  mostrarTabela = false;
  msg: string;

  displayedColumns: string[] = ['matricula', 'nome', 'turno', 'serie', 'dataEntrada', 'dataDesligamento', 'ativo', 'acoes'];
  dataSource: MatTableDataSource<Aluno> = new MatTableDataSource();

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil;

  form: FormGroup;
  mascaraCpf = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/,];

  constructor(
    protected formBuilder: FormBuilder,
    private alunoService: AlunoService,
    private router: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private cpfPipe: CpfPipe,
    private funcoesUteisService: FuncoesUteisService,
    private toastService: ToastService,
    private dataUtilService: DataUtilService,
  ) {
    super();
    this.carregarPerfil = new CarregarPerfil();
  }

  ngOnInit() {
    this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);
    this.dataSource.paginator = this.paginator;
    this.consultar();
    this.createForm();
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      beneficiario: [null],
      mae: [null],
      cpf: [null],
      dataInicioEntradaInstituicao: [null],
      dataFimEntradaInstituicao: [null],
    });
  }


  limpar() {
    this.mostrarTabela = false;
    this.dataSource.data = [];
    this.form.reset();
  }

  consultar() {
    const pageInfo = new PageInfo();
    if(this.paginator) {
      this.paginator.firstPage();
    }
    this.consultarAlunos(pageInfo);
  }

  private consultarAlunos(pageInfo: PageInfo) {
    const filtro = this.createFiltro();
    this.alunoService.listFilteredAndPaged(pageInfo, filtro)
      .subscribe((resp: any) => {
        this.numberItens = resp.totalElements;
        this.verificaMostrarTabela(resp.content);
      });
  }

  private createFiltro() {
    const filtro = new FiltroAluno();
    filtro.beneficiario = this.getValueForm(this.form, 'beneficiario');
    filtro.cpf = this.getValueForm(this.form, 'cpf');
    filtro.mae = this.getValueForm(this.form, 'mae');
    filtro.dataInicioEntradaInstituicao = this.getValueForm(this.form, 'dataInicioEntradaInstituicao');
    filtro.dataFimEntradaInstituicao = this.getValueForm(this.form, 'dataFimEntradaInstituicao');
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
    this.consultarAlunos(pageInfo);
  }


  atualizar(aluno: Aluno) {
    this.router.navigate(['/aluno/cadastrar'], { queryParams: { id: aluno.id } });
  }

  deletar(aluno: Aluno) {
    this.chamaCaixaDialogo(aluno);
  }

  chamaCaixaDialogo(aluno: Aluno) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: `Certeza que deseja excluir o Aluno ?`,
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.alunoService.excluir(aluno.id).subscribe(() => {
          this.consultar();
        });
      } else {
        dialogRef.close();
      }
    });
  }


  verificaMostrarTabela(alunos: Aluno[]) {
    if (!alunos || alunos.length === 0) {
      this.mostrarTabela = false;
      this.msg = 'Nenhum aluno encontrado.';
    } else {
      this.mostrarTabela = true;
    }
    this.dataSource.data = alunos ? alunos : [];
  }


  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }
}
