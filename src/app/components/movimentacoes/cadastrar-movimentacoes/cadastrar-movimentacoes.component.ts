import { AutenticadorService } from './../../../services/autenticador/autenticador.service';
import { MovimentacoesService } from './../../../services/movimentacoes/movimentacoes.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Movimentacoes } from 'src/app/core/movimentacoes';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Unidade } from 'src/app/core/unidade';
import { Empresa } from 'src/app/core/empresa';
import { Departamento } from 'src/app/core/departamento';
import { ContasBancaria } from 'src/app/core/contas-bancaria';
import { Banco } from 'src/app/core/banco';
import { Acesso } from 'src/app/core/acesso';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { Doadores } from 'src/app/core/doadores';
import { BroadcastEventService } from 'src/app/services/broadcast-event/broadcast-event.service';
import { PagamentosFatura } from 'src/app/core/pagamentos-fatura';
import { ReembolsosPagamentos } from 'src/app/core/reembolsos-pagamentos';
import { ContasCentrosCusto } from 'src/app/core/contas-centros-custo';
import { Programa } from 'src/app/core/programa';
import { Projeto } from 'src/app/core/projeto';
import { ProgramaService } from 'src/app/services/programa/programa.service';
import { ProjetoService } from 'src/app/services/projeto/projeto.service';
import { Tributos } from 'src/app/core/tributos';
import { TributosService } from 'src/app/services/tributos/tributos.service';
import { PessoaFisica } from 'src/app/core/pessoa-fisica';
import { ContasBancariaService } from 'src/app/services/contas-bancaria/contas-bancaria.service';

@Component({
  selector: 'cadastrar-movimentacoes',
  templateUrl: './cadastrar-movimentacoes.component.html',
  styleUrls: ['./cadastrar-movimentacoes.component.css']
})
export class CadastrarMovimentacoesComponent implements OnInit {

  movimentacoes: Movimentacoes;

  isAtualizar = false;  
  mostrarBotaoCadastrar = true;
  mostrarBotaoAtualizar = true;

  isValorTotalCategoriasMovimentosInvalido  = false;
  isValorTotalFaturaInvalido = false;
  isPagamentoInvalido        = false;

  tributos: Tributos[];
  contasBancarias: ContasBancaria[];


  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil;


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private drc: ChangeDetectorRef,
    private toastService: ToastService,
    private dataUtilService: DataUtilService,
    private movimentacoesService: MovimentacoesService,
    private autenticadorService: AutenticadorService,
    private programaService: ProgramaService,
    private projetoService: ProjetoService,
    private contasBancariaService: ContasBancariaService,
    private tributosService: TributosService
  ) {
    this.carregarPerfil = new CarregarPerfil();
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  ngOnInit() {
    this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);
    
    this.inicializarObjetos();
   
    if (!this.perfilAcesso.insere){
      this.mostrarBotaoCadastrar = false;
    }

    if (!this.perfilAcesso.altera){
      this.mostrarBotaoAtualizar = false;
    }
    
    this.contasBancariaService.getAllComboByInstituicaoLogada().subscribe((contasBancarias: ContasBancaria[]) => {
      this.contasBancarias = contasBancarias;
    });
    
    this.tributosService.getAll().subscribe((tributos: Tributos[]) => {
      this.tributos = tributos;
    })
    
    const id = this.activatedRoute.snapshot.queryParams.id ? this.activatedRoute.snapshot.queryParams.id : null;
    if (id) {
      this.isAtualizar = true;
      this.movimentacoesService.getById(id).subscribe((movimentacoes: Movimentacoes) => {
        this.movimentacoes = movimentacoes;
                
        BroadcastEventService.get('ON_CARREGAR_COMBO_PESQUISAVEL').emit(this.movimentacoes);

        if (!this.movimentacoes.contaBancaria) {
          this.movimentacoes.contaBancaria = new ContasBancaria();
          this.movimentacoes.contaBancaria.banco = new Banco();
        }
      });
    }

  }

  cadastrar() {
    // if( !this.isValorTotalRateioValido() ) {return;}
    if( !this.isContaReembolsoValida()) { return; }
    if( this.isValidarTributoMovimentacao()) { return; }
    if( this.isItensValidados() ) { return; }
    if( this.isValidarPagamentoFutura()) { return; }

    this.movimentacoesService.cadastrar(this.movimentacoes).subscribe((movimentacao: Movimentacoes) => {
      this.toastService.showSucesso('Movimentação cadastrada com sucesso');
      this.autenticadorService.revalidarSessao();
      Object.assign(this.movimentacoes, movimentacao);

      BroadcastEventService.get('ON_CARREGAR_MOVIMENTACOES').emit(this.movimentacoes);
    });
  }

  limpar() {
    this.inicializarObjetos();
  }

  cancelar() {
    this.router.navigate(['movimentacoes']);
  }

  getNomeBotao() {
    return this.isAtualizar ? 'Atualizar' : 'Cadastrar';
  }

  isValorTotalRateioValido() {
    let valorMovimentacao = this.movimentacoes.valorMovimentacao || 0;

    let valorTotal = 0;
    this.movimentacoes.rateios.forEach(rateio => {
      if(rateio.valorRateio) {
        if(rateio.statusPercentual) {
          valorTotal += (valorMovimentacao *  rateio.valorRateio)/100;
        } else {
          valorTotal += rateio.valorRateio;
        }
      }
    });

    if(Number(valorTotal.toFixed(2)) != Number(valorMovimentacao.toFixed(2))) {
      this.toastService.showSucesso('O valor do rateio de programa/projeto está diferente do valor do movimento.');
      return false;
    }

    return true;
  }

  atualizar() {
    // if( !this.isValorTotalRateioValido() ) {return;}
    if( !this.isContaReembolsoValida()) { return; }
    if( this.isValidarTributoMovimentacao()) { return; }
    if( this.isItensValidados() ) { return; }
    if( this.isValidarPagamentoFutura()) { return; }

    this.movimentacoesService.alterar(this.movimentacoes).subscribe((movimentacao: Movimentacoes) => {
      this.toastService.showSucesso('Registro atualizado com sucesso.');
      this.autenticadorService.revalidarSessao();
      Object.assign(this.movimentacoes, movimentacao);

      BroadcastEventService.get('ON_CARREGAR_MOVIMENTACOES').emit(this.movimentacoes);
    });
  }

  inicializarObjetos() {
    this.movimentacoes = new Movimentacoes();
    this.movimentacoes.unidade = new Unidade();
    this.movimentacoes.empresa = new Empresa();
    this.movimentacoes.fornecedorColaborador = new PessoaFisica();
    this.movimentacoes.departamento = new Departamento();
    this.movimentacoes.rateios = []
    this.movimentacoes.rateiosUnidades = [];
    this.movimentacoes.itensMovimentacoes = [];
    this.movimentacoes.categoriasMovimentos = [];
    this.movimentacoes.faturas = [];
    this.movimentacoes.pagamentosFatura = [];
    this.movimentacoes.contaBancaria = new ContasBancaria();
    this.movimentacoes.contaBancaria.banco = new Banco();
    this.movimentacoes.doador = new Doadores();
  }

  mostrarBotaoLimpar() {
    if (this.isAtualizar) return false;
    if (!this.mostrarBotaoAtualizar) return false;
    if (!this.mostrarBotaoCadastrar) return false;

    return true;
  }


  isItensValidados() {
    const itensInvalidos = this.movimentacoes.itensMovimentacoes.filter(item => item.quantidadeMaterial < 1);
    if(itensInvalidos && itensInvalidos.length > 0) {
      this.toastService.showAlerta('Não é permitido itens com quantidade igual a zero (0).');
      return true;
    }

    return false;
  }

  isValidarPagamentoFutura() {
    let retorno = false;

    if(this.movimentacoes.pagamentosFatura) {
      const isDataFuturas = this.movimentacoes.pagamentosFatura.filter(p => this.dataUtilService.getDataTruncata(p.dataPagamento).getTime() > new Date().getTime() ) ;
      if(isDataFuturas && isDataFuturas.length) {
        this.toastService.showAlerta('Não é permitido cadastrar pagamento de faturas com data no futuro.');
        retorno = true;
      }
    }

    return retorno;
  }


  isValidarTributoMovimentacao() {
    let retorno = false;

    const tributosTemp = this.movimentacoes.tributos ? this.movimentacoes.tributos.map(t => t.tributo) : [];
    const findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)
    const jaExiste = findDuplicates(tributosTemp);
    if(jaExiste && jaExiste.length) {
      this.toastService.showAlerta('Existem tributos do movimento duplicados.');
      retorno = true;
    }

    return retorno;
  }

  isContaReembolsoValida(): boolean {

    const reembolsosSemContaBancaria = this.movimentacoes.pagamentosFatura.filter(p => p.reembolsos.find(r => !r.contaBancaria.id));
    if(reembolsosSemContaBancaria && reembolsosSemContaBancaria.length > 0) {
      this.toastService.showAlerta('Há reembolso(s) de pagamentos sem informação da conta bancária.');
      return false;
    }

    const contaBancariaMovimentacao = this.movimentacoes.contaBancaria;

    const pagamentos:PagamentosFatura[] = this.movimentacoes.pagamentosFatura.filter(c => c.contaBancaria);
    
    if(pagamentos && pagamentos.length > 0) {
      pagamentos.forEach(pagamento => {
        const contaReembolso = pagamento.reembolsos.filter(c => c.contaBancaria.id === contaBancariaMovimentacao.id);
        if(contaReembolso.length > 0){
          this.toastService.showAlerta('Os pagamentos devem ter a conta de reembolso diferente da conta bancária.');
          return false;
        }
    
        const dataReembolso = pagamento.reembolsos
                                       .filter(c => c.data)
                                       .filter(c => this.dataUtilService.getDataTruncata(c.data).getTime() < this.dataUtilService.getDataTruncata(pagamento.dataPagamento).getTime()   );
//        if(dataReembolso.length > 0) {
//          this.toastService.showAlerta('A data do reembolso dos pagamento não pode ser menor que a data do pagamento.');
//          return false;
//        }

      });
      
    }
    return true;
  }


  carregarContasBancarios(evento) {
    // ABA DE PAGAMENTOS
    if(evento.selectedIndex === 3) {
      
      /*
      if(this.movimentacoes.rateios) {
        this.movimentacoes.rateios.forEach(rateio => {
          const contasPrograma = rateio.programa.contasCentrosCusto ? rateio.programa.contasCentrosCusto : [];
          const contasProjeto  = rateio.projeto.contasCentrosCusto ? rateio.projeto.contasCentrosCusto : [];
    
          if(contasPrograma) {
            contasPrograma.forEach(c => this.contasBancariasReembolso.push(c));
          }
          if(contasProjeto) {
            contasProjeto.forEach(c => this.contasBancariasReembolso.push(c));
          }
        });
      }
      */
      return this.isContaReembolsoValida();
      
    }
   
  }

  getValorTotalCategoriasMovimentosInvalidos(valor: boolean) {
    this.isValorTotalCategoriasMovimentosInvalido = valor;
  }

  getValorTotalFaturasInvalidos(valor: boolean) {
    this.isValorTotalFaturaInvalido = valor;
  }
  getPagamentoInvalido(valor: boolean) {
    this.isPagamentoInvalido = valor;
  }

  isDesabilitaBotao(): boolean {
    return this.isValorTotalCategoriasMovimentosInvalido || this.isValorTotalFaturaInvalido || this.isPagamentoInvalido;
  }

  getLabelABA(){
    if(!this.movimentacoes.stTipoMovimentacao || this.movimentacoes.stTipoMovimentacao === 'S') {
      return "PAGAMENTOS";
    }

    return "RECEBIMENTOS";
    
  }
}
