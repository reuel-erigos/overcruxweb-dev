import { NovoObjetoService } from './../../../../services/novo-objeto/novo-objeto.service';
import { Component, Input, OnInit, SimpleChanges, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Acesso } from 'src/app/core/acesso';
import { Empresa } from 'src/app/core/empresa';
import { ParceriasPrograma } from 'src/app/core/parcerias-programa';
import { EmpresaService } from 'src/app/services/empresa/empresa.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { AditivoParceriaPrograma } from 'src/app/core/aditivo-parceria-programa';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';

@Component({
  selector: 'parcerias-programa',
  templateUrl: './parcerias-programa.component.html',
  styleUrls: ['./parcerias-programa.component.css']
})
export class ParceriasProgramaComponent implements OnInit {

  @Input() listaParceiros: ParceriasPrograma[];


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  mostrarTabela = false;
  msg: string;

  displayedColumns: string[] = ['codigo', 'nomeRazaoSocial', 'cnpj', 'acoes'];
  dataSource: MatTableDataSource<ParceriasPrograma> = new MatTableDataSource();

  openFormCadastro = false;

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil  = new CarregarPerfil();

  isAtualizar = false;

  parceriasPrograma: ParceriasPrograma;
  empresas: Empresa[];

  constructor(
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private empresaService: EmpresaService,
    private novoObjetoService: NovoObjetoService
  ) {

  }

  ngOnInit() {

    this.initObjetos();

    this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);

    this.empresaService.getAll().subscribe((empresas: Empresa[]) => this.empresas = empresas);

  }

  initObjetos() {

    this.parceriasPrograma = new ParceriasPrograma();
    this.parceriasPrograma.empresa = new Empresa();
    this.parceriasPrograma.materiaisPrograma = [];
    this.parceriasPrograma.parceriasCategorias = [];
    this.parceriasPrograma.aditivosParceriasProgramas = [];
    this.parceriasPrograma.contasCentrosCusto = [];

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["listaParceiros"] && !_.isEmpty(changes["listaParceiros"].currentValue)) {
      this.carregarLista();
    }

  }



  isJaAdicionada(): boolean {
    const unidadeAdicionada = this.listaParceiros.find((e: ParceriasPrograma) => e.empresa.id === this.parceriasPrograma.empresa.id);

    return !!unidadeAdicionada;

  }

  adicionar() {
    if (this.isJaAdicionada()) {
      this.toastService.showAlerta('Parceiro já adicionado');
      return;
    }

    const parceriaProgramaSelecionado = new ParceriasPrograma();
    Object.assign(parceriaProgramaSelecionado, this.parceriasPrograma);

    this.getObjetosCompletosParaLista(parceriaProgramaSelecionado);

    this.listaParceiros.push(parceriaProgramaSelecionado);
    this.initObjetos();

    this.openFormCadastro = !this.openFormCadastro;
  }

  getObjetosCompletosParaLista(parceriaProgramaSelecionado: ParceriasPrograma) {
    parceriaProgramaSelecionado.empresa = _.find(this.empresas, (empresa: Empresa) => empresa.id == parceriaProgramaSelecionado.empresa.id);

  }


  deletar(parceriasPrograma: ParceriasPrograma): void {
    const index = this.listaParceiros.indexOf(this.listaParceiros.find(e => e.id === parceriasPrograma.id));
    if (index >= 0) {
      this.listaParceiros.splice(index, 1);
      this.carregarLista();
    }
  }

  novo() {
    this.isAtualizar = false;
    this.openFormCadastro = !this.openFormCadastro;
    this.initObjetos();
    this.novoObjetoService.initObjeto.emit();
  }

  carregarLista() {
    if (this.listaParceiros.length === 0) {
      this.mostrarTabela = false;
      this.msg = 'Nenhuma parceiro adicionado.';
    } else {
      this.dataSource.data = this.listaParceiros ? this.listaParceiros : [];
      this.mostrarTabela = true;
    }
  }

  atualizar() {
    this.initObjetos();
    this.openFormCadastro = false;
    this.isAtualizar = false;
    this.novoObjetoService.initObjeto.emit();
  }

  atualizarComposicao(parceiro: ParceriasPrograma) {
    this.parceriasPrograma = parceiro;
    this.openFormCadastro = true;
    this.isAtualizar = true;
  }

  adicionarAditivo(parceriasPrograma: ParceriasPrograma) {
    parceriasPrograma.aditivosParceriasProgramas.push(new AditivoParceriaPrograma());
  }

  deletarAditivo(parceriasCategorias: ParceriasPrograma, aditivo: AditivoParceriaPrograma) {
    let index = parceriasCategorias.aditivosParceriasProgramas.indexOf(aditivo);
    parceriasCategorias.aditivosParceriasProgramas.splice(index, 1);
  }

  isSomaDasCategoriasDiferenteDaSomaDosParceiros() {
    if(!this.parceriasPrograma.valorParceria || _.isEmpty(this.parceriasPrograma.parceriasCategorias)){
      return false;
    }

    this.parceriasPrograma.valorParceria;
    const total = this.parceriasPrograma.aditivosParceriasProgramas
                        .map(adt => adt.valorAditivo)
                        .reduce((total, numero) => total + numero, 0);
    const somaParceiroMaisAditivo = this.parceriasPrograma.valorParceria + total;


    let somaTodasCategorias         = null;
    let somaTodosAtitivosCategorias = null;

    this.parceriasPrograma.parceriasCategorias.forEach(pc => {
      if(pc.aditivosParceriasCategorias.length > 0){
        const total  = pc.aditivosParceriasCategorias.map(adt => adt.valorAditivo)
                                                    .reduce((total, numero) => total + numero, 0);
        somaTodosAtitivosCategorias += total;
      }
      somaTodasCategorias += pc.valorParceriaCategoria;
    });
    
    let totalValoresAditivosCategorias = null;
    if(somaTodosAtitivosCategorias) {
      totalValoresAditivosCategorias = somaTodasCategorias + somaTodosAtitivosCategorias;
    }
    return somaTodosAtitivosCategorias && Number(somaParceiroMaisAditivo.toFixed(2)) != Number(totalValoresAditivosCategorias.toFixed(2));
  }

}
