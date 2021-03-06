import { Instituicao } from 'src/app/core/instituicao';
import { FuncoesService } from './../../../../services/funcoes/funcoes.service';
import { FuncionarioService } from './../../../../services/funcionario/funcionario.service';
import { FuncoesInstituicao } from './../../../../core/funcoes-instituicao';
import { Funcoes } from './../../../../core/funcoes';
import { Component, OnInit, Input, ViewChild, SimpleChanges, forwardRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


import { Acesso } from 'src/app/core/acesso';
import * as _ from 'lodash';
import { Cargo } from 'src/app/core/cargo';
import { Funcionario } from 'src/app/core/funcionario';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { ControlContainer, NgForm, NgModelGroup } from '@angular/forms';

@Component({
  selector: 'funcoes-instituicao',
  templateUrl: './funcoes-instituicao.component.html',
  styleUrls: ['./funcoes-instituicao.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm },
                  { provide: ControlContainer, useExisting: forwardRef(() => NgModelGroup) }],    
})
export class FuncoesInstituicaoComponent implements OnInit {

  @Input() instituicao: Instituicao;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  mostrarTabela = false;
  msg: string = "Nenhuma função adicionada";

  listaFuncoes: Funcoes[] = [];
  funcionarios: Funcionario[] = [];


  displayedColumns: string[] = ['funcionario', 'funcao', 'dataInicio', 'dataFim', 'acoes'];
  dataSource: MatTableDataSource<FuncoesInstituicao> = new MatTableDataSource();

  funcoesInstituicao: FuncoesInstituicao;

  perfilAcesso: Acesso;

  openFormCadastro = false;
  isAtualizar = false;


  constructor(
    private dataUtilService: DataUtilService,
    private funcionarioService: FuncionarioService,
    private funcoesService: FuncoesService
  ) { }

  ngOnInit() {
    this.inicializaLista();
    this.initObjetos();

    this.funcoesService.getAllByIdInstituicao().subscribe((listaFuncoes: Funcoes[]) => {
      this.listaFuncoes = listaFuncoes;
    })

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['instituicao'] && changes['instituicao'].currentValue.id) {
      this.funcionarioService.getPorInstituicaoCombo(this.instituicao.id)
        .subscribe((funcionarios: Funcionario[]) => {
          this.funcionarios = funcionarios;
        })
        this.carregarLista();
    }
  }

  adicionar() {

    const funcoesInstituicaoSelecionado = new FuncoesInstituicao();
    Object.assign(funcoesInstituicaoSelecionado, this.funcoesInstituicao);

    this.getObjetosCompletosParaLista(funcoesInstituicaoSelecionado);

    this.instituicao.funcoesInstituicao.push(funcoesInstituicaoSelecionado);
    this.limpar();
    this.openFormCadastro = !this.openFormCadastro;
  }


  getObjetosCompletosParaLista(funcoesInstituicao: FuncoesInstituicao) {
    funcoesInstituicao.funcionario = _.find(this.funcionarios, (funcionario: Funcionario) => funcionario.id == funcoesInstituicao.funcionario.id);
    funcoesInstituicao.funcoes = _.find(this.listaFuncoes, (funcoes: Funcoes) => funcoes.id == funcoesInstituicao.funcoes.id);
  }

  novo() {
    this.isAtualizar = false;
    this.openFormCadastro = !this.openFormCadastro;
    this.limpar();
  }

  atualizar() {
    this.limpar();
    this.openFormCadastro = false;
    this.isAtualizar = false;
  }

  inicializaLista() {

    this.dataSource.data = this.instituicao.funcoesInstituicao;
  }


  atualizarFuncao(funcoesInstituicao: FuncoesInstituicao) {
    this.preencherObjetosVazios(funcoesInstituicao);
    this.funcoesInstituicao = funcoesInstituicao;
    this.openFormCadastro = true;
    this.isAtualizar = true;

  }

  preencherObjetosVazios(funcoesInstituicao: FuncoesInstituicao) {
    if (!funcoesInstituicao.funcionario) {
      funcoesInstituicao.funcionario = new Funcionario();
    }
  }

  limpar() {
    this.initObjetos();
  }

  carregarLista() {
    if (this.instituicao.funcoesInstituicao.length === 0) {
      this.mostrarTabela = false;
      this.msg = 'Nenhuma função adicionada.';
    } else {
      this.dataSource.data = this.instituicao.funcoesInstituicao ? this.instituicao.funcoesInstituicao : [];
      this.mostrarTabela = true;
    }
  }


  initObjetos() {
    this.funcoesInstituicao = new FuncoesInstituicao();
    this.funcoesInstituicao.dataFim = null;
    this.funcoesInstituicao.dataInicio = null;
    this.funcoesInstituicao.funcionario = new Funcionario();
    this.funcoesInstituicao.funcoes = new Funcoes();

  }

  deletar(funcoesInstituicao: FuncoesInstituicao): void {
    const index = this.instituicao.funcoesInstituicao.indexOf(this.instituicao.funcoesInstituicao.find(fi => fi === funcoesInstituicao));
    if (index >= 0) {
      this.instituicao.funcoesInstituicao.splice(index, 1);
      this.carregarLista();
    }
  }

  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }

}
