import { Component, OnInit, ViewChild, Input, SimpleChanges, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Acesso } from 'src/app/core/acesso';
import * as _ from 'lodash';
import { ContasBancaria } from 'src/app/core/contas-bancaria';
import { Movimentacoes } from 'src/app/core/movimentacoes';
import { ToastService } from 'src/app/services/toast/toast.service';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { BroadcastEventService } from 'src/app/services/broadcast-event/broadcast-event.service';
import { CategoriasMovimentos } from 'src/app/core/categorias-movimentos';
import { CategoriasContabeis } from 'src/app/core/categorias-contabeis';
import { RateiosCategoriasMovimentos } from 'src/app/core/rateios-categorias-movimentos';
import { PlanosContas } from 'src/app/core/planos-contas';
import { CategoriasContabeisService } from 'src/app/services/categorias-contabeis/categorias-contabeis.service';
import { Programa } from 'src/app/core/programa';
import { Projeto } from 'src/app/core/projeto';

@Component({
  selector: 'categorias-movimentos',
  templateUrl: './categorias-movimentos.component.html',
  styleUrls: ['./categorias-movimentos.component.css']
})
export class CategoriasMovimentosComponent implements OnInit {

  @ViewChild('campoPrograma') campoPrograma;
  @ViewChild('campoProjeto') campoProjeto;
  @ViewChild('campoCategoriaOrigem') campoCategoriaOrigem;
  @ViewChild('campoCategoriaDestino') campoCategoriaDestino;


  @Input() movimentacoes:Movimentacoes;
  @Input() idMovimentacao: number;
  @Input() perfilAcesso: Acesso;
  @Output() onCategoriaMovimentoInvalido = new EventEmitter();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  mostrarTabela = false;
  msg = "Nenhuma registro adicionado.";

  maxDataPagamento = new Date();

  displayedColumns: string[] = ['data', 'valor', 'programaprojeto','contacontabil','acoes'];
  dataSource: MatTableDataSource<CategoriasMovimentos> = new MatTableDataSource();

  categoriaMovimento: CategoriasMovimentos;
  planosContas: PlanosContas[];
  
  valorRateioSuperior = false;
  valorCategoriaInvalido = false;
  msgValorPagamentoInvalido = 'O valor do pagamento está diferente do valor da fatura.';

  openFormCadastro = false;
  isAtualizar = false;
  
  valoresSuperiorValorMovimento = false;
  isContaReembolsoValida = true;

  constructor(    
    private categoriasContabeisService: CategoriasContabeisService,
    private drc: ChangeDetectorRef,  
    private toastService: ToastService,
    private dataUtilService: DataUtilService,
  ) { 
    this.maxDataPagamento = new Date();
  }

  ngOnInit() {
    this.initObjetos();
    if(!this.movimentacoes.categoriasMovimentos) {
      this.movimentacoes.categoriasMovimentos = [];
    }

    this.categoriasContabeisService.getAllView(false).subscribe((planosContas: PlanosContas[]) => {
      this.planosContas = planosContas;
    })

    BroadcastEventService.get('ON_CARREGAR_MOVIMENTACOES')
    .subscribe((movimentacao: Movimentacoes) => {
      this.carregarLista();
    })    
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.carregarLista();
   }

   
  ngAfterContentChecked(): void {
    this.drc.detectChanges();

    if(this.categoriaMovimento.categoriaOrigem && this.categoriaMovimento.categoriaOrigem.id) {
      this.selecionaRubrica(this.categoriaMovimento.categoriaOrigem.id);
    }
    if(this.categoriaMovimento.categoriaDestino && this.categoriaMovimento.categoriaDestino.id) {
      this.selecionaRubricaAdicional(this.categoriaMovimento.categoriaDestino.id);
    }

  }

  adicionar() {
    const categoriasMovimentos = new CategoriasMovimentos();
    categoriasMovimentos.idMovimento = this.idMovimentacao;    
    categoriasMovimentos.categoriaOrigem = new PlanosContas();
    categoriasMovimentos.categoriaDestino = new PlanosContas();
    categoriasMovimentos.valor = 0;
    categoriasMovimentos.descricao = '';    
    categoriasMovimentos.rateioCategoriasMovimentos = [];
    
    Object.assign(categoriasMovimentos, this.categoriaMovimento);

    this.movimentacoes.categoriasMovimentos.push(categoriasMovimentos);
    this.limpar();
    this.openFormCadastro = !this.openFormCadastro;
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


  limpar() {
    this.initObjetos();
  }

  carregarLista() {
    if (this.movimentacoes.categoriasMovimentos.length === 0) {
      this.mostrarTabela = false;
      this.msg = 'Nenhum registro adicionado.';
    } else {
      this.dataSource.data = this.movimentacoes.categoriasMovimentos ? this.movimentacoes.categoriasMovimentos : [];
      this.mostrarTabela = true;
    }
  }


  initObjetos() {
    this.categoriaMovimento = new CategoriasMovimentos();
    this.categoriaMovimento.idMovimento = this.idMovimentacao;    
    this.categoriaMovimento.categoriaOrigem = new PlanosContas();
    this.categoriaMovimento.categoriaDestino = new PlanosContas();
    this.categoriaMovimento.valor = 0;
    this.categoriaMovimento.descricao = '';    
    this.categoriaMovimento.rateioCategoriasMovimentos = [];
  }

  deletar(categoriasMovimentos: CategoriasMovimentos): void {
    const index = this.movimentacoes.categoriasMovimentos.indexOf(this.movimentacoes.categoriasMovimentos.find(fi => fi === categoriasMovimentos));
    if (index >= 0) {
      this.movimentacoes.categoriasMovimentos.splice(index, 1);
      this.carregarLista();
    }
  }


  atualizarRegistro(categoriasMovimentos: CategoriasMovimentos) {
    this.preencherObjetosVazios(categoriasMovimentos);
    this.categoriaMovimento = categoriasMovimentos;
    this.openFormCadastro = true;
    this.isAtualizar = true;
  }

  preencherObjetosVazios(categoriasMovimentos: CategoriasMovimentos){
    if(!categoriasMovimentos.categoriaDestino){
      categoriasMovimentos.categoriaOrigem = new PlanosContas();
    }
   
    if(!categoriasMovimentos.categoriaDestino){
      categoriasMovimentos.categoriaDestino = new PlanosContas();
    }

    categoriasMovimentos.valor = categoriasMovimentos.valor || 0;
    categoriasMovimentos.rateioCategoriasMovimentos     = categoriasMovimentos.rateioCategoriasMovimentos || [];
    
  }

  getValorTotal() {
    this.valoresSuperiorValorMovimento = false;
    if(this.movimentacoes.pagamentosFatura && this.movimentacoes.pagamentosFatura.length > 0) {
      const valorTotal = this.movimentacoes.pagamentosFatura.map(v => v.valorPagamento).reduce( (valor, total) => total += valor) 
                          + this.movimentacoes.pagamentosFatura.map(v => v.valorDesconto).reduce( (valor, total) => total += valor) 
      if(Number(valorTotal.toFixed(2)) != Number(this.movimentacoes.valorMovimentacao.toFixed(2))) {
        this.valoresSuperiorValorMovimento = true;
      }      
      return Number(valorTotal.toFixed(2));
    }
    return 0;
  }


  getCategoriasMoviemtos(): CategoriasMovimentos[] {
    return this.movimentacoes.categoriasMovimentos.filter(f => f.id);
  }
  
  getDadosCategoriaMovimento(id: number): CategoriasMovimentos {
    const categoriasMovimentos = this.getCategoriasMoviemtos();
    const categoriaMovimento = _.find(categoriasMovimentos, (m: CategoriasMovimentos) => m.id == id);
    return categoriaMovimento;
  }


  addRateio() {
    if (!this.categoriaMovimento.rateioCategoriasMovimentos) {
      this.categoriaMovimento.rateioCategoriasMovimentos = [];
    }

    const rateio:any = new RateiosCategoriasMovimentos();
    rateio.contaBancaria = new ContasBancaria();
    
    rateio.id = undefined;
    rateio.idCategoriaMovimento = this.categoriaMovimento.id;
    rateio.valorRateio = 0;

    this.categoriaMovimento.rateioCategoriasMovimentos.push(rateio);
  }


  getValorTotalRateio() {
    this.valorRateioSuperior = false;

    let valorTotal = 0.0;
    this.categoriaMovimento.rateioCategoriasMovimentos.forEach(rateio => {
      if(rateio.valorRateio) {
        valorTotal += rateio.valorRateio;
      }
    });

    if(Number(valorTotal.toFixed(2)) != Number(this.categoriaMovimento.valor.toFixed(2))) {
      this.valorRateioSuperior = true;
    }
    return valorTotal;
    //return Number(valorTotal.toFixed(2)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  validarValor() {
    this.valorCategoriaInvalido = false;

    if(this.movimentacoes.categoriasMovimentos && this.movimentacoes.categoriasMovimentos.length > 0) {
      const valorTotal = this.movimentacoes.categoriasMovimentos.map(v => v.valor).reduce( (valor, total) => total += valor) 
      if(Number(valorTotal.toFixed(2)) != Number(this.movimentacoes.valorMovimentacao.toFixed(2))) {
        this.valorCategoriaInvalido = true;
      }
      this.onCategoriaMovimentoInvalido.emit(this.valorCategoriaInvalido);
      return Number(valorTotal.toFixed(2));
    }

    this.onCategoriaMovimentoInvalido.emit(this.valorCategoriaInvalido);
  }


  selecionaRubrica(id: number) {
    if(this.planosContas) {
      const registro = this.planosContas.find((reg: any) => reg.id === id);
      if (!!registro) {
        this.onValorRubricaChange(registro);
      }
    }
  }
  selecionaRubricaAdicional(id: number) {
    if(this.planosContas) {
      const registro = this.planosContas.find((reg: any) => reg.id === id);
      if (!!registro) {
        this.onValorRubricaAdicionalChange(registro);
      }
    }
  }

  onValorRubricaChange(registro){
    this.categoriaMovimento.categoriaOrigem = registro;
  }
  onValorRubricaAdicionalChange(registro){
    this.categoriaMovimento.categoriaDestino = registro;
  }

  getRubricaPlanoConta(id): string {
    const registro = _.find(this.planosContas,  (c) => c.id === id);
    return registro ? registro.planoConta : "";
  }


  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }

  validarValorMovimento(valor) {
    if (valor.includes("-")) {
      this.categoriaMovimento.valor = null;
      this.toastService.showAlerta('O valor do documento não pode ser negativo, informe outro valor.');
    }
  }


  carregarContaOrigem(idConta: number){
    this.categoriaMovimento.categoriaOrigem = _.cloneDeep(_.find(this.planosContas, { id: idConta}));

    if(idConta && this.categoriaMovimento.categoriaDestino?.id && idConta === this.categoriaMovimento.categoriaDestino.id ){
      this.categoriaMovimento.categoriaOrigem = null;
      this.campoCategoriaOrigem.itensSelect.ngControl.control.setValue(null);  
      this.toastService.showAlerta('A conta de origem não pode ser a mesma de destino.');
    }
    
  }

  carregarContaDestino(idConta: number){
    this.categoriaMovimento.categoriaDestino = _.cloneDeep(_.find(this.planosContas, { id: idConta}));

    if(idConta && this.categoriaMovimento.categoriaOrigem?.id && idConta === this.categoriaMovimento.categoriaOrigem.id ){
      this.categoriaMovimento.categoriaDestino = null;
      this.campoCategoriaDestino.itensSelect.ngControl.control.setValue(null);    
      this.toastService.showAlerta('A conta de destino não pode ser a mesma da origem.');  
    }  
  }

  onValorChangePrograma(registro: any) {
    this.categoriaMovimento.programa = registro;    
    if(registro) {
      this.categoriaMovimento.programa.id = registro.id;
      this.campoProjeto.comboProjeto.itensSelect.ngControl.reset()
      this.categoriaMovimento.projeto = new Projeto();
    } else{  
      this.categoriaMovimento.programa = new Programa();
    }
  }

  onValorChangeProjeto(registro: any) {
    this.categoriaMovimento.projeto = registro;    
    if(registro) {
      this.categoriaMovimento.projeto.id = registro.id;
      this.campoPrograma.comboPrograma.itensSelect.ngControl.reset();      
      this.categoriaMovimento.programa = new Programa();
    } else{
      this.categoriaMovimento.projeto = new Projeto();
    }
  }

  getDescricaoProgramaProjeto(registro: CategoriasMovimentos){
    return registro.programa?.nome || registro.projeto?.nome;
  }

}
