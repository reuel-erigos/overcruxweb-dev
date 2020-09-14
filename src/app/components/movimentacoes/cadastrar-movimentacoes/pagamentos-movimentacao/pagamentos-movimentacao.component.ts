import { FaturaService } from './../../../../services/fatura/fatura.service';
import { ContasBancariaService } from './../../../../services/contas-bancaria/contas-bancaria.service';
import { Component, OnInit, ViewChild, Input, SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Acesso } from 'src/app/core/acesso';
import { PagamentosFatura } from 'src/app/core/pagamentos-fatura';
import * as _ from 'lodash';
import { ContasBancaria } from 'src/app/core/contas-bancaria';
import { Fatura } from 'src/app/core/fatura';
import { SaldosContasBancaria } from 'src/app/core/saldos-contas-bancaria';
import { FormaPagamento } from 'src/app/core/forma-pagamento';
import { Movimentacoes } from 'src/app/core/movimentacoes';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ReembolsosPagamentos } from 'src/app/core/reembolsos-pagamentos';
import { RateiosPagamentos } from 'src/app/core/rateios-pagamentos';
import { Programa } from 'src/app/core/programa';
import { Projeto } from 'src/app/core/projeto';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { BroadcastEventService } from 'src/app/services/broadcast-event/broadcast-event.service';

@Component({
  selector: 'pagamentos-movimentacao',
  templateUrl: './pagamentos-movimentacao.component.html',
  styleUrls: ['./pagamentos-movimentacao.component.css']
})
export class PagamentosMovimentacaoComponent implements OnInit {

  @Input() movimentacoes:Movimentacoes;
  @Input() idMovimentacao: number;
  @Input() perfilAcesso: Acesso;
  @Input() contasBancariasReembolso;
  @Input() programas: Programa[];
  @Input() projetos: Projeto[];


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  mostrarTabela = false;
  msg = "Nenhum item adicionado.";

  maxDataPagamento = new Date();
  formasPagamento: FormaPagamento = new FormaPagamento();

  displayedColumns: string[] = ['fatura', 'formaPagamento', 'dataPagamento', 'valorPagamento', 'acoes'];
  dataSource: MatTableDataSource<PagamentosFatura> = new MatTableDataSource();

  pagamentosFatura: PagamentosFatura;
  
  valorRateioSuperior = false;

  openFormCadastro = false;
  isAtualizar = false;
  contasBancarias: ContasBancaria[];
  valoresSuperiorValorMovimento = false;
  isContaReembolsoValida = true;

  constructor(
    private contasBancariaService: ContasBancariaService,
    private toastService: ToastService,
    private dataUtilService: DataUtilService,
  ) { 
    this.maxDataPagamento = new Date();
  }

  ngOnInit() {
    this.initObjetos();

    this.contasBancariaService.getAllComboByInstituicaoLogada().subscribe((contasBancarias: ContasBancaria[]) => {
      this.contasBancarias = contasBancarias;
    });


    BroadcastEventService.get('ON_CARREGAR_MOVIMENTACOES')
    .subscribe((movimentacao: Movimentacoes) => {
      this.carregarLista();
    })
    
  }

  ngOnChanges(changes: SimpleChanges): void {

    //if (changes["listaPagamentosFatura"] && changes["listaPagamentosFatura"].currentValue) {
      this.carregarLista();
    //}
    
    /*
    //if (changes["idMovimentacao"] && changes["idMovimentacao"].currentValue) {
    if (this.idMovimentacao) {
      this.faturaService.getAllPorMovimentacoes(this.idMovimentacao).subscribe((listaFaturas: Fatura[]) => {
        this.listaFaturas = listaFaturas;
      })
    }
    */
  }

  adicionar() {
    const pagamentosFatura = new PagamentosFatura();
    pagamentosFatura.valorJuros = 0;
    pagamentosFatura.valorMulta = 0;
    pagamentosFatura.valorPagamento = 0;
    Object.assign(pagamentosFatura, this.pagamentosFatura);

    this.getObjetosCompletosParaLista(pagamentosFatura);

    this.movimentacoes.pagamentosFatura.push(pagamentosFatura);
    this.limpar();
    this.openFormCadastro = !this.openFormCadastro;
  }


  getObjetosCompletosParaLista(pagamentosFatura: PagamentosFatura) {
    pagamentosFatura.contaBancaria = _.find(this.contasBancarias, (m: ContasBancaria) => m.id == pagamentosFatura.contaBancaria.id);
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



  atualizarFuncao(pagamentosFatura: PagamentosFatura) {
    this.pagamentosFatura = pagamentosFatura;
    this.openFormCadastro = true;
    this.isAtualizar = true;

  }

  limpar() {
    this.initObjetos();
  }

  carregarLista() {
    if (this.movimentacoes.pagamentosFatura.length === 0) {
      this.mostrarTabela = false;
      this.msg = 'Nenhum pagamento adicionado.';
    } else {
      this.dataSource.data = this.movimentacoes.pagamentosFatura ? this.movimentacoes.pagamentosFatura : [];
      this.mostrarTabela = true;

      if(this.dataSource.data && this.dataSource.data.length > 0) {
        // Ordenação de array (decrescente)
        this.dataSource.data = this.dataSource.data.sort((a,b) => {
          if (this.dataUtilService.getDataTruncata(a.dataPagamento).getTime() + a.valorPagamento > this.dataUtilService.getDataTruncata(b.dataPagamento).getTime() + b.valorPagamento) {return -1;}
          if (this.dataUtilService.getDataTruncata(a.dataPagamento).getTime() + a.valorPagamento < this.dataUtilService.getDataTruncata(b.dataPagamento).getTime() + b.valorPagamento) {return 1;}
          return 0;
        });
      }


    }
  }


  initObjetos() {
    this.pagamentosFatura = new PagamentosFatura();
    this.pagamentosFatura.valorJuros = 0;
    this.pagamentosFatura.valorMulta = 0;
    this.pagamentosFatura.valorPagamento = 0;
    this.pagamentosFatura.contaBancaria = new ContasBancaria();
    this.pagamentosFatura.reembolsos = [];
    this.pagamentosFatura.rateioPagamento = [];
    this.pagamentosFatura.saldoContaBancaria = new SaldosContasBancaria();
  }

  deletar(pagamentosFatura: PagamentosFatura): void {
    const index = this.movimentacoes.pagamentosFatura.indexOf(this.movimentacoes.pagamentosFatura.find(fi => fi === pagamentosFatura));
    if (index >= 0) {
      this.movimentacoes.pagamentosFatura.splice(index, 1);
      this.carregarLista();
    }
  }


  atualizarRegistro(pagamentosFatura: PagamentosFatura) {
    this.preencherObjetosVazios(pagamentosFatura);
    this.pagamentosFatura = pagamentosFatura;
    this.openFormCadastro = true;
    this.isAtualizar = true;
  }

  preencherObjetosVazios(pagamentosFatura: PagamentosFatura){
    if(!pagamentosFatura.contaBancaria){
      pagamentosFatura.contaBancaria = new ContasBancaria();
    }
   
    if(!pagamentosFatura.saldoContaBancaria){
      pagamentosFatura.saldoContaBancaria = new SaldosContasBancaria();
    }

    pagamentosFatura.valorPagamento = pagamentosFatura.valorPagamento || 0;
    pagamentosFatura.valorJuros     = pagamentosFatura.valorJuros || 0;
    pagamentosFatura.valorMulta     = pagamentosFatura.valorMulta || 0;
  }

  getValorTotal() {
    this.valoresSuperiorValorMovimento = false;
    if(this.movimentacoes.pagamentosFatura && this.movimentacoes.pagamentosFatura.length > 0) {
      const valorItens = this.movimentacoes.pagamentosFatura.map(v => v.valorPagamento).reduce( (valor, total) => total += valor) 
      if(valorItens !== this.movimentacoes.valorMovimentacao) {
        this.valoresSuperiorValorMovimento = true;
      }
      return valorItens;
    }
    return 0;
  }


  getFaturas(): Fatura[] {
    return this.movimentacoes.faturas.filter(f => f.id);
  }
  
  getDadosFatura(idFatura: number): Fatura {
    const faturas = this.getFaturas();
    const fatura = _.find(faturas, (m: Fatura) => m.id == idFatura);
    return fatura;
  }

  isInformaNumeroTransacao(formaPagamento: string) : boolean{
    return formaPagamento === 'C' || formaPagamento === 'B';
  }

  addRateioPagamento() {
    if (!this.pagamentosFatura.rateioPagamento) {
      this.pagamentosFatura.rateioPagamento = [];
    }

    const rateio:any = new RateiosPagamentos();
    rateio.contaBancaria = new ContasBancaria();
    
    rateio.id = undefined;
    rateio.idPagamentoFatura = this.pagamentosFatura.id;
    rateio.statusPercentual = false;
    rateio.valorRateio = 0;

    this.pagamentosFatura.rateioPagamento.push(rateio);

  }

  addReembolso() {
    if (!this.pagamentosFatura.reembolsos) {
      this.pagamentosFatura.reembolsos = [];
    }

    const reemboso:any = new ReembolsosPagamentos();
    reemboso.contaBancaria = new ContasBancaria();
    
    reemboso.id = undefined;
    reemboso.idPagamentoFatura = this.pagamentosFatura.id;
    reemboso.descricao = '';
    reemboso.data = new Date();
    reemboso.statusPercentual = false;
    reemboso.valor = 0;

    this.pagamentosFatura.reembolsos.push(reemboso);
  }

  getContaReembolsoValida(valor) {
    this.isContaReembolsoValida = valor;
  }

  validarContaReembolso() {
    this.isContaReembolsoValida = true;
    if(this.pagamentosFatura.contaBancaria && this.pagamentosFatura.contaBancaria.id) {
      const contasReembolsoConflitantes = this.pagamentosFatura.reembolsos.filter(r => r.contaBancaria.id === this.pagamentosFatura.contaBancaria.id);
      if(contasReembolsoConflitantes && contasReembolsoConflitantes.length > 0) {
        this.toastService.showAlerta('A conta de reembolso deve ser diferente da conta bancária do pagamento.');
        this.isContaReembolsoValida = false;
      }
    }
  }




  getValorTotalRateio() {
    this.valorRateioSuperior = false;
    let valorJurosMulta = (this.pagamentosFatura.valorJuros || 0) + (this.pagamentosFatura.valorMulta || 0);

    let valorTotal = 0;
    this.pagamentosFatura.rateioPagamento.forEach(rateio => {
      if(rateio.valorRateio) {
        if(rateio.statusPercentual) {
          valorTotal += (valorJurosMulta *  rateio.valorRateio)/100;
        } else {
          valorTotal += rateio.valorRateio;
        }
      }
    });

    if(Number(valorTotal.toFixed(2)) != Number(valorJurosMulta.toFixed(2))) {
      this.valorRateioSuperior = true;
    }
    return valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

}
