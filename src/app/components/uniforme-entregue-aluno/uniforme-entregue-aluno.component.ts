import { AtividadeAlunoService } from './../../services/atividade-aluno/atividade-aluno.service';
import { UniformeEntregeAlunoService } from './../../services/uniforme-entregue-aluno/uniforme-entrege-aluno.service';
import { UniformeAluno } from 'src/app/core/uniforme-aluno';
import { Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatDialogConfig} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { AtividadeAluno } from 'src/app/core/atividade-aluno';
import { Aluno } from 'src/app/core/aluno';
import { Atividade } from 'src/app/core/atividade';
import { Acesso } from 'src/app/core/acesso';
import { Router, ActivatedRoute } from '@angular/router';
import { AtividadeService } from 'src/app/services/atividade/atividade.service';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import * as _ from 'lodash';
import { ToastService } from 'src/app/services/toast/toast.service';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';

class FiltroBusca {
  atividade: Atividade = new Atividade();
}

@Component({
  selector: 'app-uniforme-entregue-aluno',
  templateUrl: './uniforme-entregue-aluno.component.html',
  styleUrls: ['./uniforme-entregue-aluno.component.css']
})
export class UniformeEntregueAlunoComponent implements OnInit {

  public maskData = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  // Campos de busca
  filtroBusca: FiltroBusca = new FiltroBusca();

  uniformeAluno: UniformeAluno = new UniformeAluno();
  uniformesAluno: UniformeAluno[];

  maxDate = new Date(9999, 12, 31);
  minDate = new Date(1111, 1, 1);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  atividadesAlunos: AtividadeAluno[];
  atividades: Atividade[];

  msg: string;
  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil  = new CarregarPerfil();

  mostrarTabela = false;
  displayedColumns: string[] = ['nome', 'nomeUniforme', 'dataUniformeEntregue', 'qtdUniformeEntregue',
                                'datamatricula', 'acoes'];
  dataSource: MatTableDataSource<UniformeAluno> = new MatTableDataSource();

  constructor(
    private uniformeEntregeAlunoService: UniformeEntregeAlunoService,
    private atividadeAlunoService: AtividadeAlunoService,
    private atividadeService: AtividadeService,
    private toastService: ToastService,
    private router: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.limpar();

    this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.createFilter();

    this.dataSource.filterPredicate = (data: any, filter) => {
      const dataStr = data.atividadesAluno.aluno.pessoaFisica.nome +
                      data.nomeUniforme +
                      data.dataUniformeEntregue +
                      data.qtdUniformeEntregue +
                      data.atividadesAluno.dataInicioAtividade;
      return dataStr.toUpperCase().indexOf(filter.toUpperCase()) !== -1;
    };


    this.atividadeService.getAllVigentesAndFuturas().subscribe((atividades: Atividade[]) => {
      this.atividades = atividades;
    });
  }

  public createFilter(): (data: any, filter: any) => boolean {
    const filterFunction = (data, filter) => {
      const searchData = JSON.parse(filter);
      let status = false;
      for (const key in searchData) {
        if (data[key].indexOf(searchData[key]) !== -1) {
          status = true;
        } else {
          status = false;
          break;
        }
      }
      return status;
    };
    return filterFunction;
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.value.trim().toLowerCase();
  }

  limpar() {
    this.filtroBusca = new FiltroBusca();
    this.mostrarTabela = false;
    this.msg = null;
    this.uniformesAluno = [];
    this.dataSource.data = [];
    this.uniformeAluno = new UniformeAluno();
  }

  editar(uniformeAluno: UniformeAluno) {
    uniformeAluno.disabilitado = !uniformeAluno.disabilitado;
  }

  cancelar() {
    this.router.navigate(['uniformeentregue']);
  }

  atualizar() {
    this.uniformeEntregeAlunoService.alterarAll(this.uniformesAluno, this.filtroBusca.atividade.id)
    .subscribe(() => {
      this.router.navigate(['uniformeentregue']);
      this.toastService.showSucesso('Entrega de uniforme atualizada com sucesso');
    });

    this.uniformesAluno.forEach(u => u.disabilitado = true);
  }


  deletar(auniformeAluno: UniformeAluno) {
    this.chamaCaixaDialogo(auniformeAluno);
  }

  chamaCaixaDialogo(uniformeAluno: UniformeAluno) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: `Certeza que deseja excluir a entregue de uniforme ?`,
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.excluir(uniformeAluno);
      } else {
        dialogRef.close();
      }
    });
  }

  consultar() {
    this.atividadeAlunoService.getAllAlunosMatriculadosNaAtividade(this.filtroBusca.atividade.id)
    .subscribe((atividadesAluno: AtividadeAluno[]) => {

      if (atividadesAluno && atividadesAluno.length === 0) {
        this.mostrarTabela = false;
        this.toastService.showAlerta('Não há alunos matriculados nessa atividade.');
      } else {
        this.atividadesAlunos = atividadesAluno;

        this.uniformeEntregeAlunoService.getAllAlunosMatriculadosNaAtividade(this.filtroBusca.atividade.id)
        .subscribe((uniformesAluno: UniformeAluno[]) => {
            this.uniformesAluno = uniformesAluno ? uniformesAluno : [];
            this.dataSource.data = this.uniformesAluno;
            this.mostrarTabela = true;

            this.uniformesAluno.forEach(u => u.disabilitado = true);
        });
      }
    });
  }

  novo() {
    this.mostrarTabela = true;
    this.uniformeAluno = new UniformeAluno();
    this.uniformeAluno.atividadesAluno = new AtividadeAluno();
    this.uniformeAluno.atividadesAluno.aluno = new Aluno();
    this.uniformeAluno.atividadesAluno.atividade = new Atividade();

    if (this.uniformesAluno === undefined) {
      this.uniformesAluno = [];
    }

    this.uniformesAluno.push(this.uniformeAluno);
    this.dataSource.data = this.uniformesAluno;
  }

  private excluir(uniformeAluno) {
    this.uniformesAluno = this.uniformesAluno.filter(a => a !== uniformeAluno);
    this.dataSource.data = this.uniformesAluno;
  }


  getAtividadeAluno(element: UniformeAluno, id) {
    const atividadeAluno = _.find(this.atividadesAlunos, (a: AtividadeAluno) => a.id === id);

    const uniformeAluno = _.find(this.uniformesAluno, (u: UniformeAluno) => u === element);
    uniformeAluno.atividadesAluno = atividadeAluno;
  }

}
