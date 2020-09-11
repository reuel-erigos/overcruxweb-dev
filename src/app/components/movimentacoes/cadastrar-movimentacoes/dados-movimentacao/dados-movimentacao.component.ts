import { ContasBancaria } from 'src/app/core/contas-bancaria';
import { UnidadeService } from './../../../../services/unidade/unidade.service';
import { DepartamentoService } from 'src/app/services/departamento/departamento.service';
import { ProgramaService } from './../../../../services/programa/programa.service';
import { EmpresaService } from 'src/app/services/empresa/empresa.service';
import { Empresa } from './../../../../core/empresa';
import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Projeto } from 'src/app/core/projeto';
import { Programa } from 'src/app/core/programa';
import { ProjetoService } from 'src/app/services/projeto/projeto.service';
import { Departamento } from 'src/app/core/departamento';
import { Unidade } from 'src/app/core/unidade';
import { Movimentacoes } from 'src/app/core/movimentacoes';
import { ControlContainer, NgForm } from '@angular/forms';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ContasBancariaService } from 'src/app/services/contas-bancaria/contas-bancaria.service';
import * as _ from 'lodash';
import { RateiosMovimentacoes } from 'src/app/core/rateios-movimentacoes';
import { Acesso } from 'src/app/core/acesso';
import { RateiosMovimentacoesUnidades } from 'src/app/core/rateios-movimentacoes-unidades';
import { DoadoresService } from 'src/app/services/doadores/doadores.service';
import { Doadores } from 'src/app/core/doadores';
import { BroadcastEventService } from 'src/app/services/broadcast-event/broadcast-event.service';
import { TributoMovimentacao } from 'src/app/core/tributo-movimentacao';
import { Tributos } from 'src/app/core/tributos';
import { TributosService } from 'src/app/services/tributos/tributos.service';


@Component({
  selector: 'dados-movimentacao',
  templateUrl: './dados-movimentacao.component.html',
  styleUrls: ['./dados-movimentacao.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class DadosMovimentacaoComponent implements OnInit {

  @Input() movimentacoes:Movimentacoes;
  @Input() perfilAcesso: Acesso;

  empresas:Empresa[];
  projetos:Projeto[];
  programas:Programa[];
  departamentos:Departamento[];
  unidades: Unidade[];
  contasBancarias: ContasBancaria[];
  doadores: Doadores[];
  tributos: Tributos[];

  tiposMovimentacao = [
    {id: 'E', descricao: 'DESPESA'},
    {id: 'S', descricao: 'RECEITA'}
  ];

  valorRateioSuperior = false;
  valorRateioUnidadeSuperior = false;


  constructor(
    private empresaService: EmpresaService,
    private programaService: ProgramaService,
    private projetoService: ProjetoService,
    private departamentoService: DepartamentoService,
    private unidadeService: UnidadeService,
    private toastService: ToastService,
    private contasBancariaService: ContasBancariaService,
    private doadoresService: DoadoresService,
    private drc: ChangeDetectorRef,
    private tributosService: TributosService
  ) { }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  ngOnInit() {

    BroadcastEventService.get('ON_CARREGAR_COMBO_PESQUISAVEL_MOVIMENTACOES')
    .subscribe((movimentacao: Movimentacoes) => {
      this.selecionaEmpresa(movimentacao.empresa.id);
    });
    
    this.empresaService.getAllCombo().subscribe((empresas:Empresa[]) => {
      this.empresas = empresas;
      this.selecionaEmpresa(this.movimentacoes.empresa.id);
    })

    this.programaService.getAllCombo().subscribe((programas:Programa[]) => {
      this.programas = programas;
    })

    this.projetoService.getAllCombo().subscribe((projetos:Projeto[]) => {
      this.projetos = projetos;
    })

    this.departamentoService.getAllCombo().subscribe((departamentos:Departamento[]) => {
      this.departamentos = departamentos;
    })

    this.unidadeService.getAllByInstituicaoDaUnidadeLogada().subscribe((unidades:Unidade[]) => {
      this.unidades = unidades;
    })

    this.doadoresService.getAll().subscribe((doadores: Doadores[]) => {
      this.doadores = doadores;
    })

    this.contasBancariaService.getAllComboByInstituicaoLogada()
    .subscribe((contasBancarias: ContasBancaria[]) => {
      this.contasBancarias = contasBancarias;
    });


    this.tributosService.getAll().subscribe((tributos: Tributos[]) => {
      this.tributos = tributos;
    })
  }

  validarValorNegativo( valor: number ) {
    if (valor < 0) {
      this.movimentacoes.qtdParcelas = null;
      this.toastService.showAlerta('A quantidade de parcelas não pode ter valor negativo, informe outro valor.');
    }
  }

  validarValorDodumento(valor) {
    if (valor.includes("-")) {
      this.movimentacoes.valorMovimentacao = null;
      this.toastService.showAlerta('O valor do documento não pode ser negativo, informe outro valor.');
    }
  }

  carregarContaBancaria() {
    if (this.movimentacoes.contaBancaria && this.movimentacoes.contaBancaria.id) {
      this.movimentacoes.contaBancaria = _.cloneDeep(_.find(this.contasBancarias,  (c: ContasBancaria) => c.id === this.movimentacoes.contaBancaria.id));
    }
  }


  addTributo() {
    if (!this.movimentacoes.tributos) {
      this.movimentacoes.tributos = [];
    }

    const tributoMovimentacao:any = new TributoMovimentacao();
    tributoMovimentacao.tributo = new Tributos();
    tributoMovimentacao.idMovimentacao = this.movimentacoes.id;    
    tributoMovimentacao.id    = undefined;
    tributoMovimentacao.valor = 0;

    this.movimentacoes.tributos.push(tributoMovimentacao);
  }
  
  addRateio() {
    if (!this.movimentacoes.rateios) {
      this.movimentacoes.rateios = [];
    }

    const rateio:any = new RateiosMovimentacoes();
    rateio.programa = new Programa();
    rateio.projeto  = new Projeto();
    
    rateio.statusPercentual = false;
    rateio.id = undefined;
    rateio.valorRateio = 0;
    rateio.placeHolderRateio = 'Valor do rateio';

    this.movimentacoes.rateios.push(rateio);
  }

  getValorTotalRateio() {
    this.valorRateioSuperior = false;
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
      this.valorRateioSuperior = true;
    }
    return valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }


  addRateioUnidade() {
    if (!this.movimentacoes.rateiosUnidades) {
      this.movimentacoes.rateiosUnidades = [];
    }

    const rateio:any = new RateiosMovimentacoesUnidades();
    
    rateio.statusPercentual = false;
    rateio.idUnidade = undefined;
    rateio.id = undefined;
    rateio.valorRateio = 0;
    rateio.placeHolderRateio = 'Valor do rateio';

    this.movimentacoes.rateiosUnidades.push(rateio);
  }

  getValorTotalRateioUnidades() {
    this.valorRateioUnidadeSuperior = false;
    let valorMovimentacao = this.movimentacoes.valorMovimentacao || 0;

    let valorTotal = 0;
    this.movimentacoes.rateiosUnidades.forEach(rateio => {
      if(rateio.valorRateio) {
        if(rateio.statusPercentual) {
          valorTotal += (valorMovimentacao *  rateio.valorRateio)/100;
        } else {
          valorTotal += rateio.valorRateio;
        }
      }
    });

    if(Number(valorTotal.toFixed(2)) != Number(valorMovimentacao.toFixed(2))) {
      this.valorRateioUnidadeSuperior = true;
    }
    return valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  getDescricaoDoador(doador: Doadores): string {
    if(doador.empresa) {
      return doador.empresa.nomeRazaoSocial.toUpperCase();
    }
    if(doador.pessoasFisica){
      return doador.pessoasFisica.nome.toUpperCase();
    }
  }
  getIdDoador(doador: Doadores): number {
    if(doador.empresa) {
      return doador.empresa.id;
    }
    if(doador.pessoasFisica){
      return doador.pessoasFisica.id;
    }
  }

  onValorChange(item) {
    this.movimentacoes.empresa = item;
  }

  selecionaEmpresa(idEmpresa: number) {
    if(this.empresas) {
      const empresa = this.empresas.find((item: any) => item.id === idEmpresa);
      if (!!empresa) {
        this.onValorChange(empresa);
      }
    }
  }
}
