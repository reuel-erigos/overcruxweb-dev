import { NotaAvaliacao } from './../../core/nota-avaliacao';
import { AvaliacaoAlunoService } from './../../services/avaliacao-aluno/avaliacao-aluno.service';
import { AvaliacaoAluno } from './../../core/avaliacao-aluno';
import { Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog} from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { ActivatedRoute, Router } from '@angular/router';
import { Acesso } from 'src/app/core/acesso';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { Atividade } from 'src/app/core/atividade';
import { AtividadeAluno } from 'src/app/core/atividade-aluno';
import { AtividadeAlunoService } from 'src/app/services/atividade-aluno/atividade-aluno.service';
import { AtividadeService } from 'src/app/services/atividade/atividade.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Aluno } from 'src/app/core/aluno';
import { Avaliacao } from 'src/app/core/avaliacao';
import * as _ from 'lodash';
import { AvaliacaoAtividadeService } from 'src/app/services/avaliacao-atividade/avaliacao-atividade.service';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';



class FiltroBusca {
  avaliacao: Avaliacao = new Avaliacao();
  atividade: Atividade = new Atividade();
}


@Component({
  selector: 'avaliacao-aluno',
  templateUrl: './avaliacao-aluno.component.html',
  styleUrls: ['./avaliacao-aluno.component.css']
})
export class AvaliacaoAlunoComponent implements OnInit {

  // Campos de busca
  filtroBusca: FiltroBusca = new FiltroBusca();

  avaliacaoAluno: AvaliacaoAluno = new AvaliacaoAluno();
  avaliacoesAluno: AvaliacaoAluno[];

  maxDate = new Date(9999, 12, 31);
  minDate = new Date(1111, 1, 1);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  atividadesAlunos: AtividadeAluno[];
  atividades: Atividade[];

  avaliacoes: Avaliacao[];
  notaAvaliacao: NotaAvaliacao;

  notasAvaliacao = [
    { id: 1, tipo: NotaAvaliacao.INACEITAVEL, nota: 'INACEITÁVEL', descricao: 'DÊ O GRAU 1 SE VOCÊ ACHAR NENHUMA EVIDÊNCIA DA COMPETÊNCIA' },
    { id: 2, tipo: NotaAvaliacao.INSATISFATORIO, nota: 'INSATISFATÓRIO', descricao: 'DÊ O GRAU 2 SE VOCÊ ACHAR POUCA A EVIDÊNCIA DA COMPETÊNCIA' },
    { id: 3, tipo: NotaAvaliacao.INDUSTRIAS, nota: 'MÉDIO', descricao: 'DÊ O GRAU 3 SE VOCÊ ACHAR MÉDIA A EVIDÊNCIA DA COMPETÊNCIA' },
    { id: 5, tipo: NotaAvaliacao.EXCELENTE, nota: 'EXCELENTE', descricao: 'DÊ O GRAU 5 SE VOCÊ ACHAR FORTE A EVIDÊNCIA DA COMPETÊNCIA' },
    { id: 4, tipo: NotaAvaliacao.OUTRO, nota: 'BOM', descricao: 'DÊ O GRAU 4 SE VOCÊ ACHAR BOA A EVIDÊNCIA DA COMPETÊNCIA' },
  ]

  msg: string;
  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil  = new CarregarPerfil();

  mostrarBotaoGerarLista = false;
  mostrarTabela = false;

  displayedColumns: string[] = ['aluno', 'matriculaAluno', 'dataavaliacao', 'avaliacao', 'nota', 'descricao', 'acoes'];
  dataSource: MatTableDataSource<AvaliacaoAluno> = new MatTableDataSource();

  constructor(
    private avaliacaoAlunoService: AvaliacaoAlunoService,
    private atividadeAlunoService: AtividadeAlunoService,
    private avaliacaoAtividadeService: AvaliacaoAtividadeService,
    private atividadeService: AtividadeService,
    private toastService: ToastService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.limpar();

    this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: any, filter) => {
      const dataStr = data.atividadesAluno.aluno.pessoaFisica.nome +
                      data.atividadesAluno.aluno.matriculaAluno +
                      data.dataAvaliacao +
                      data.avaliacoes.nome +
                      this.getNota(data.notaAvaliacao);
      return dataStr.toUpperCase().indexOf(filter.toUpperCase()) !== -1;
    };

    this.avaliacaoAtividadeService.getAll().subscribe((avaliacoes: Avaliacao[]) => {
      this.avaliacoes = avaliacoes;
    });

    this.atividadeService.getAllVigentesAndPassadas().subscribe((atividades: Atividade[]) => {
      this.atividades = atividades;
    });
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.value.trim().toLowerCase();
  }

  limpar() {
    this.filtroBusca = new FiltroBusca();
    this.mostrarTabela = false;
    this.msg = null;
    this.dataSource.data = [];
    this.avaliacoesAluno = [];
    this.avaliacaoAluno = new AvaliacaoAluno();
    this.mostrarBotaoGerarLista = false;
  }

  editar(avaliacaoAluno: AvaliacaoAluno) {
    avaliacaoAluno.desabilitado = !avaliacaoAluno.desabilitado;
  }

  atualizar() {
    this.avaliacaoAlunoService.alterarAll(this.avaliacoesAluno, this.filtroBusca.atividade.id, this.filtroBusca.avaliacao.id)
    .subscribe(() => {
      this.toastService.showSucesso('Avaliações de alunos atualizada com sucesso');
    });

    this.avaliacoesAluno.forEach(u => u.desabilitado = true);
  }


  deletar(avaliacaoAluno: AvaliacaoAluno) {
    this.chamaCaixaDialogo(avaliacaoAluno);
  }

  chamaCaixaDialogo(avaliacaoAluno: AvaliacaoAluno) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: `Certeza que deseja excluir a avaliação do aluno ?`,
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.excluir(avaliacaoAluno);
      } else {
        dialogRef.close();
      }
    });
  }

  gerarListaAvaliacoes() {
    if (this.filtroBusca.avaliacao.id === undefined) {
      this.toastService.showAlerta('Informe a avaliação.');
      return;
    }

    this.avaliacaoAlunoService.getAlunosMatriculados(this.filtroBusca.atividade.id,
                                                     this.filtroBusca.avaliacao.id)
    .subscribe((avaliacoesAluno: AvaliacaoAluno[]) => {
        this.avaliacoesAluno = avaliacoesAluno ? avaliacoesAluno : [];
        this.dataSource.data = this.avaliacoesAluno;
        this.mostrarTabela = true;

        this.avaliacoesAluno.forEach(u => u.desabilitado = !!u.id);
    });
  }

  consultar() {
    this.avaliacaoAlunoService.getListaAvaliacoes(this.filtroBusca.atividade.id, this.filtroBusca.avaliacao.id)
    .subscribe((avaliacoesAluno: AvaliacaoAluno[]) => {
        this.avaliacoesAluno = avaliacoesAluno ? avaliacoesAluno : [];
        this.dataSource.data = this.avaliacoesAluno;

        this.mostrarBotaoGerarLista = true;
        this.mostrarTabela = false;
        if (this.avaliacoesAluno.length > 0) {
          this.mostrarTabela = true;
        }

        this.avaliacoesAluno.forEach(u => u.desabilitado = true);
    });
  }

  isFiltroPreenchido() {
    return this.filtroBusca.avaliacao.id && this.filtroBusca.atividade.id;
  }


  novo() {
    this.mostrarTabela = true;
    this.avaliacaoAluno = new AvaliacaoAluno();
    this.avaliacaoAluno.atividadesAluno = new AtividadeAluno();
    this.avaliacaoAluno.atividadesAluno.aluno = new Aluno();
    this.avaliacaoAluno.atividadesAluno.atividade = new Atividade();
    this.avaliacaoAluno.avaliacoes = new Avaliacao();

    if (this.avaliacoesAluno === undefined) {
      this.avaliacoesAluno = [];
    }

    this.avaliacaoAluno.dataAvaliacao = new Date();

    this.avaliacoesAluno.push(this.avaliacaoAluno);
    this.dataSource.data = this.avaliacoesAluno;
  }

  private excluir(avaliacaoAluno) {
    this.avaliacoesAluno = this.avaliacoesAluno.filter(a => a !== avaliacaoAluno);
    this.dataSource.data = this.avaliacoesAluno;
  }


  getAtividadeAluno(element: AvaliacaoAluno, idAtividadeAluno:number) {
    const atividadeAlunoEncontrado = _.find(this.atividadesAlunos, (a: AtividadeAluno) => a.id === idAtividadeAluno);

    const alunoJaAvaliado = _.find(this.avaliacoesAluno, (avaliacao: AvaliacaoAluno) => avaliacao.atividadesAluno.aluno.id === atividadeAlunoEncontrado.aluno.id);
    if (alunoJaAvaliado) {
      this.toastService.showAlerta('Esse aluno já possui avaliação nessa atividade.');
      return;
    }

    const atividadeAluno: AtividadeAluno = new AtividadeAluno();
    Object.assign(atividadeAluno, atividadeAlunoEncontrado);

    const avaliacaoAlunoEncontrada:any = _.find(this.atividadesAlunos, (u: AvaliacaoAluno) => u === element);
    avaliacaoAlunoEncontrada.atividadesAluno = atividadeAluno;
  }

  getNota(idNota): string {
    if (idNota) {
      const notaSelecionada = _.find(this.notasAvaliacao, (nota: any) => nota.id === Number(idNota));
      return notaSelecionada.nota;
    }
    return '';
  }
}
