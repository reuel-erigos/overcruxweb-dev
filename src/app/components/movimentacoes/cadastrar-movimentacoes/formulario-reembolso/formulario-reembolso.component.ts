import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { Acesso } from 'src/app/core/acesso';
import { ContasBancaria } from 'src/app/core/contas-bancaria';
import { PagamentosFatura } from 'src/app/core/pagamentos-fatura';
import { Programa } from 'src/app/core/programa';
import { Projeto } from 'src/app/core/projeto';
import { ReembolsosPagamentos } from 'src/app/core/reembolsos-pagamentos';
import { ToastService } from 'src/app/services/toast/toast.service';

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
  @Input() programas: Programa[];
  @Input() projetos: Projeto[];
  @Output() onContaReembolsoValida = new EventEmitter()
    
  pinContaBancaria  = Date.now();
  pinCheckReembolso = Date.now();
  pinDataReembolso  = Date.now();
  pinValorReembolso = Date.now();
  pinDescricao      = Date.now();

  constructor(private toastService: ToastService) { 
  }

  ngOnInit(): void {
  }

  deletar() {
    this.pagamentosFatura.reembolsos.splice(this.index, 1);
  }



  validarContaReembolso() {
    if(this.pagamentosFatura.contaBancaria && this.pagamentosFatura.contaBancaria.id 
       && 
       this.reembolso.contaBancaria && this.reembolso.contaBancaria.id) {
      if(this.pagamentosFatura.contaBancaria.id === this.reembolso.contaBancaria.id) {
        this.toastService.showAlerta('A conta de reembolso deve ser diferente da conta bancária do pagamento.');
        this.onContaReembolsoValida.emit(false);
        return;
      }
    }


    const contaReembolsoConflitante = this.pagamentosFatura.reembolsos
                                                           .filter(r => r.contaBancaria.id === this.reembolso.contaBancaria.id);
    if(contaReembolsoConflitante && contaReembolsoConflitante.length > 1) {
      this.toastService.showAlerta('Essa conta de reembolso já está cadastrada para esse pagamento.');
      this.onContaReembolsoValida.emit(false);
      return;
    }


    this.onContaReembolsoValida.emit(true);
  }



  getNomeProjetoPrograma(conta: any) {
    let nomeProjetoPrograma = '';
    let retorno = `${conta.contasBancaria.banco.numero} - ${conta.contasBancaria.banco.nome} | Ag. ${conta.contasBancaria.numeroAgencia} | C. ${conta.contasBancaria.numeroContaBancaria}`;
    

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
    return retorno;
  }
}