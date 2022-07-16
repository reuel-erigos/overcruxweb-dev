import { ToastService } from './../../../../services/toast/toast.service';
import { PagamentosFatura } from 'src/app/core/pagamentos-fatura';
import { Component, OnInit, Input, ViewChild, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Acesso } from 'src/app/core/acesso';
import { Fatura } from 'src/app/core/fatura';
import * as _ from 'lodash';
import { Movimentacoes } from 'src/app/core/movimentacoes';
import { Tributos } from 'src/app/core/tributos';
import { TributoMovimentacao } from 'src/app/core/tributo-movimentacao';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { BroadcastEventService } from 'src/app/services/broadcast-event/broadcast-event.service';

@Component({
  selector: 'faturas-movimentacao',
  templateUrl: './faturas-movimentacao.component.html',
  styleUrls: ['./faturas-movimentacao.component.css']
})
export class FaturasMovimentacaoComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @Input() movimentacoes:Movimentacoes;
  @Input() perfilAcesso: Acesso;
  @Output() onValorTotalFaturaInvalidos = new EventEmitter();

  mostrarTabela = false;
  msg: string = "Nenhum fatura adicionada";


  displayedColumns: string[] = ['dataVencimento', 'valor', 'numeroParcela','tributo', 'acoes'];
  dataSource: MatTableDataSource<Fatura> = new MatTableDataSource();

  tributos: Tributos[];
  fatura: Fatura;
  openFormCadastro = false;
  isAtualizar = false;

  valoresSuperiorValorMovimento = false;

  constructor(
    private toastService: ToastService,
    private dataUtilService: DataUtilService
  ) { }

  ngOnInit() {
    this.initObjetos();

    BroadcastEventService.get('ON_CARREGAR_MOVIMENTACOES')
    .subscribe((movimentacao: Movimentacoes) => {
      this.carregarLista();
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    //if (changes["movimentacoes.faturas"] && changes["movimentacoes.faturas"].currentValue) {
      this.carregarLista();
    //}
  }

  ngAfterContentChecked(): void {
    //this.carregarTributos();
  }

  carregarTributos() {
    this.tributos = [];
    if(this.movimentacoes.tributos) {
      const distinct = (value, index, self) => self.indexOf(value) === index;
      this.tributos = this.movimentacoes.tributos.map(t => t.tributo).filter(distinct);

      if(this.fatura.tributoMovimentacao && this.fatura.tributoMovimentacao.tributo.id) {
        this.selecionaTributo(this.fatura.tributoMovimentacao.tributo.id);
      }
    }
  }


  adicionar() {
    const contasCentrosCustoSelecionada = new Fatura();
    Object.assign(contasCentrosCustoSelecionada, this.fatura);
    this.movimentacoes.faturas.push(contasCentrosCustoSelecionada);
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



  atualizarFuncao(fatura: Fatura) {
    this.fatura = fatura;
    this.openFormCadastro = true;
    this.isAtualizar = true;

  }

  limpar() {
    this.initObjetos();
  }

  carregarLista() {
    if (this.movimentacoes.faturas.length === 0) {
      this.mostrarTabela = false;
      this.msg = 'Nenhuma fatura adicionada.';
    } else {
      this.dataSource.data = this.movimentacoes.faturas ? this.movimentacoes.faturas : [];
      this.mostrarTabela = true;


      if(this.dataSource.data && this.dataSource.data.length > 0) {
        // Ordenação de array (decrescente)
        this.dataSource.data = this.dataSource.data.sort((a,b) => {
          if (this.dataUtilService.getDataTruncata(a.dataVencimento).getTime() + a.valor > this.dataUtilService.getDataTruncata(b.dataVencimento).getTime() + b.valor) {return -1;}
          if (this.dataUtilService.getDataTruncata(a.dataVencimento).getTime() + a.valor < this.dataUtilService.getDataTruncata(b.dataVencimento).getTime() + b.valor) {return 1;}
          return 0;
        });
      }
    }
  }


  initObjetos() {
    this.fatura = new Fatura();
    this.fatura.tributoMovimentacao = new TributoMovimentacao();
    this.fatura.tributoMovimentacao.tributo = new Tributos();
  }

  deletar(fatura: Fatura): void {
    if (this.existemPagamentos(fatura)) {
      this.toastService.showAlerta("Não é possui excluir essa fatura pois existem pagamentos vinculados a ela.")
      return;
    }
    const index = this.movimentacoes.faturas.indexOf(this.movimentacoes.faturas.find(fi => fi === fatura));
    if (index >= 0) {
      this.movimentacoes.faturas.splice(index, 1);
      this.carregarLista();
    }
  }


  atualizarRegistro(fatura: Fatura) {
    this.fatura = fatura;

    if(!this.fatura.tributoMovimentacao.id) {
      this.fatura.tributoMovimentacao = new TributoMovimentacao();
      this.fatura.tributoMovimentacao.tributo = new Tributos();
    }


    this.openFormCadastro = true;
    this.isAtualizar = true;

    this.carregarTributos();

  }

  existemPagamentos(fatura: Fatura) {
    return this.movimentacoes.pagamentosFatura && this.movimentacoes.pagamentosFatura.find((l: PagamentosFatura) => l.idFatura == fatura.id)
  }

  getValorTotal() {
    this.valoresSuperiorValorMovimento = false;
    if(this.movimentacoes.faturas && this.movimentacoes.faturas.length > 0) {
      const valorTotal = this.movimentacoes.faturas.map(v => v.valor).reduce( (valor, total) => total += valor) 
      if(Number(valorTotal.toFixed(2)) != Number(this.movimentacoes.valorMovimentacao.toFixed(2))) {
        this.valoresSuperiorValorMovimento = true;
      }
      this.onValorTotalFaturaInvalidos.emit(this.valoresSuperiorValorMovimento);
      return Number(valorTotal.toFixed(2));
    }
    this.onValorTotalFaturaInvalidos.emit(this.valoresSuperiorValorMovimento);
    return 0;
  }


  onValorTributoChange(item) {
    this.fatura.tributoMovimentacao.idMovimentacao = this.movimentacoes.id;
    
    this.fatura.tributoMovimentacao.tributo = item;
    if(!item) {
      this.fatura.tributoMovimentacao.tributo = new Tributos();
    }
  }

  selecionaTributo(idTributo: number) {
    if(this.tributos) {
      const tributo = this.tributos.find((item: any) => item.id === idTributo);
      if (!!tributo) {
        this.onValorTributoChange(tributo);
      }
    }
  }

  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }

}
