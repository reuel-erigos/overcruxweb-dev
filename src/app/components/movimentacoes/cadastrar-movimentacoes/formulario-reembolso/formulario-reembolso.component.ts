import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { Acesso } from 'src/app/core/acesso';
import { ComboPrograma } from 'src/app/core/combo-programa';
import { ComboProjeto } from 'src/app/core/combo-projeto';
import { ContasBancaria } from 'src/app/core/contas-bancaria';
import { PagamentosFatura } from 'src/app/core/pagamentos-fatura';
import { Programa } from 'src/app/core/programa';
import { Projeto } from 'src/app/core/projeto';
import { ReembolsosPagamentos } from 'src/app/core/reembolsos-pagamentos';
import { ProgramaService } from 'src/app/services/programa/programa.service';
import { ProjetoService } from 'src/app/services/projeto/projeto.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import * as _ from 'lodash';
import { ContasBancariaService } from 'src/app/services/contas-bancaria/contas-bancaria.service';
import { DataUtilService } from 'src/app/services/commons/data-util.service';

@Component({
  selector: 'formulario-reembolso',
  templateUrl: './formulario-reembolso.component.html',
  styleUrls: ['./formulario-reembolso.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class FormularioReembolsoComponent implements OnInit {

  @Input() index: number;
  @Input() reembolso: ReembolsosPagamentos;
  @Input() perfilAcesso: Acesso;
  @Input() pagamentosFatura: PagamentosFatura;
  @Input() contasBancarias: ContasBancaria[];
  @Output() onContaReembolsoValida = new EventEmitter()
  
  programas: ComboPrograma[];
  projetos: ComboProjeto[];

  contasCentroCusto: ContasBancaria[];

  pinContaBancaria  = Date.now();
  pinCheckReembolso = Date.now();
  pinDataReembolso  = Date.now();
  pinValorReembolso = Date.now();
  pinDescricao      = Date.now();
  pinTransacao      = Date.now();

  constructor(private toastService: ToastService,
              private dataUtilService: DataUtilService,
              private projetoService: ProjetoService,
              private contasBancariaService: ContasBancariaService,
              private programaService: ProgramaService) { 
}

  ngOnInit(): void {
    if(!this.reembolso.contaBancariaDestino){
      this.reembolso.contaBancariaDestino = new ContasBancaria();
    } 

    this.carregarContasBancarias();
  }

  deletar() {
    this.pagamentosFatura.reembolsos.splice(this.index, 1);
  }


  carregarContasBancarias(){
    if(this.reembolso.data) {
      this.contasBancariaService.getAllContasCentroCustos(this.dataUtilService.getDataTruncata(this.reembolso.data))
      .subscribe((contasBancarias: ContasBancaria[]) => {
        this.contasCentroCusto = contasBancarias;
      });
    }
  }

  onCarregarContasReembolso(){
    this.contasCentroCusto = [];
    this.reembolso.contaBancaria = new ContasBancaria();
    this.reembolso.contaBancariaDestino = new ContasBancaria();

    this.carregarContasBancarias();
  }

  validarContaReembolso() {
    this.carregarContaBancaria();
    
    if(this.pagamentosFatura.contaBancaria && this.pagamentosFatura.contaBancaria.id 
       && 
       this.reembolso.contaBancaria && this.reembolso.contaBancaria.id) {
      if(this.pagamentosFatura.contaBancaria.id === this.reembolso.contaBancaria.id) {
        this.toastService.showAlerta('A conta de reembolso deve ser diferente da conta bancária do pagamento.');
        this.onContaReembolsoValida.emit(false);
        return;
      }
    }

/*
/    const contaReembolsoConflitante = this.pagamentosFatura.reembolsos
                                                           .filter(r => r.contaBancaria.id === this.reembolso.contaBancaria.id);
    if(contaReembolsoConflitante && contaReembolsoConflitante.length > 1) {
      this.toastService.showAlerta('Essa conta de reembolso já está cadastrada para esse pagamento.');
      this.onContaReembolsoValida.emit(false);
      return;
    }

*/
    this.onContaReembolsoValida.emit(true);
  }



  getNomeProjetoPrograma(conta: any) {
    let nomeProjetoPrograma = '';
    let retorno = `${conta.banco.numero} - ${conta.banco.nome} | Ag. ${conta.numeroAgencia} | C. ${conta.numeroContaBancaria}`;
    

    /*
    if(conta.idProjeto && this.projetos) {
      const projeto = this.projetos.find((p: any) => p.id === conta.idProjeto);
      if (!!projeto) {
        nomeProjetoPrograma = projeto.nome;
      }
    } else {
      const programa = this.programas.find((p: any) => p.id === conta.idPrograma);
      if (!!programa) {
        nomeProjetoPrograma = programa.nome;
      }
    }

    retorno += ' | ' + nomeProjetoPrograma;
    */

    return retorno;
  }


  carregarContaBancariaDestino() {
    if (this.reembolso.contaBancariaDestino.id) {
      this.reembolso.contaBancariaDestino = _.cloneDeep(_.find(this.contasBancarias,  (f: ContasBancaria) => f.id === this.reembolso.contaBancariaDestino.id));
    }
  }

  carregarContaBancaria() {
    if (this.reembolso.contaBancaria.id) {
      this.reembolso.contaBancaria = _.cloneDeep(_.find(this.contasBancarias,  (f: ContasBancaria) => f.id === this.reembolso.contaBancaria.id));
    }
  }

}
