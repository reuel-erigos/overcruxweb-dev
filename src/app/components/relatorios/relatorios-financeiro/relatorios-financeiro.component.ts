import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { Acesso } from 'src/app/core/acesso';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { ColaboradoresGestaoPessoal } from 'src/app/core/colaboradores-gestao-pessoal';
import { CpfPipe } from 'src/app/pipes/cpf.pipe';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { FileUtils } from 'src/app/utils/file-utils';
import { ComboPrograma } from 'src/app/core/combo-programa';
import { ComboProjeto } from 'src/app/core/combo-projeto';
import { ContasBancaria } from 'src/app/core/contas-bancaria';
import { CnpjPipe } from 'src/app/pipes/cnpj.pipe';
import { RelatorioFaturasPagarService } from 'src/app/services/relatorio-financeiro/faturas-pagar/relatorio-faturas-pagar.service';
import { RelatorioNormativaPagamentosService } from 'src/app/services/relatorio-financeiro/normativa-pagamentos/relatorio-normativa-pagamentos.service';
import { RelatorioSaldoProjetoService } from 'src/app/services/relatorio-financeiro/saldo-projeto/relatorio-saldo-projeto.service';
import { ContasBancariaService } from 'src/app/services/contas-bancaria/contas-bancaria.service';
import { PlanosContas } from 'src/app/core/planos-contas';
import { CategoriasContabeisService } from 'src/app/services/categorias-contabeis/categorias-contabeis.service';
import { Observable } from 'rxjs';
import { Projeto } from 'src/app/core/projeto';
import { Programa } from 'src/app/core/programa';
import { ProjetoService } from 'src/app/services/projeto/projeto.service';
import { ProgramaService } from 'src/app/services/programa/programa.service';
import { ComboEmpresa } from 'src/app/core/combo-empresa';
import { ComboPessoaFisica } from 'src/app/core/combo-pessoa-fisica';
import { RelatorioMovimentacaoContabilService } from 'src/app/services/relatorio-financeiro/movimentacao-contabil/relatorio-movimentacao-contabil.service';
import { switchMap } from 'rxjs/operators';

export interface TipoRelatorio {
  tipo: string;
  descricao: string;
  nomeRelatorio: string;
}

export class Filter{
  fornecedorColaborador: any; //não está tipado pq o combo-pesquisável usa lista com objeto diferente
  contaBancaria: ContasBancaria = new ContasBancaria();
  planoConta: PlanosContas = new PlanosContas();
  programa: ComboPrograma = new ComboPrograma();
  projeto: ComboProjeto = new ComboProjeto();
  empresa: ComboEmpresa = new ComboEmpresa();
  pessoaFisica: ComboPessoaFisica = new ComboPessoaFisica();
  dataInicio: Date;
  dataFim: Date;
  dataInicioVenc: Date;
  dataFimVenc: Date;
  rubricaAdicional: boolean;
}

@Component({
  selector: 'relatorios-financeiro',
  templateUrl: './relatorios-financeiro.component.html',
  styleUrls: ['./relatorios-financeiro.component.css'],
  providers: [CpfPipe, CnpjPipe],
})
export class RelatoriosFinanceiroComponent implements OnInit {
  MIMETYPE_PDF   = "pdf";
  MIMETYPE_EXCEL = "xls";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  comboPlanosContasAll: PlanosContas[];
  comboPlanosContas: PlanosContas[];
  comboContasBancarias: ContasBancaria[];

  todosProjetos: Projeto[];
  comboProjetos: ComboProjeto[];
  comboProgramas: ComboPrograma[];

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil;

  displayColunasNormativa: string[] = ['select', 'nomeProgramaProjeto','fornecedor','numerodocumento','cnpjcpf', 'datadocumento', 'valormovimentacao', 'numerotransacao', 'datapagamento', 'rubrica'];
  displayColunasFaturaPagar: string[] = ['select', 'nomeProjeto','fornecedor','numerodocumento','cnpjcpf', 'datadocumento', 'valormovimentacao', 'valorfatura', 'datavencimento', 'contaContabil'];
  displayColunasSaldoProjeto: string[] = ['select', 'nomeProgramaProjeto','tipo', 'descricao','parceiro','numerodocumento', 'dataoperacao', 'valoroperacao', 'bancoagenciaconta', 'saldo'];
  displayColunasMovimentacaoContabil: string[] = ['select', 'nomeProgramaProjeto',  'numerodocumento', 'datadocumento','descricaoCategoria','dataMovimentacao','valorCategoria','contaDestino','contaOrigem'];


  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  mostrarTabela: boolean = false;
  msg: string;

  selection = new SelectionModel<any>(true, []);

  servicoBusca: any;
  servicoBusca$: any;
  servicoBuscaSaldo$: any;
  atualizarSaldoContabil$: any;

  filtro: Filter = new Filter();
  dadosDataSource: any[]

  tiposRelatorios: TipoRelatorio[] = [
    {tipo: 'NP', descricao: 'Relação Nominativa de Pagamentos', nomeRelatorio: 'Relação Nominativa de Pagamentos'},
    {tipo: 'FP', descricao: 'Faturas', nomeRelatorio: 'faturas_pagar'},
    {tipo: 'SP', descricao: 'Saldo por Projeto', nomeRelatorio: 'saldo_projeto'},
    {tipo: 'MC', descricao: 'Movimentações Contábeis', nomeRelatorio: 'movimentacao_contabil'},
  ];
  tipoRelatorioSelecionado: TipoRelatorio;

  valorTotalMovimentos: number;
  valorSaldoInicioMovimentos: number;
  valorTotalOrigem: number;
  valorTotalDestino: number;
  valorTotalFinal: number;


  constructor(
    private toastService: ToastService,
    private dataUtilService: DataUtilService,
    private fileUtils: FileUtils,
    private activatedRoute: ActivatedRoute,
    private loadingPopupService: LoadingPopupService,
    private drc: ChangeDetectorRef,
    private projetoService: ProjetoService,
    private programaService: ProgramaService,
    private relatorioFaturasPagarService: RelatorioFaturasPagarService,
    private relatorioNormativaPagamentosService: RelatorioNormativaPagamentosService,
    private relatorioSaldoProjetoService: RelatorioSaldoProjetoService,
    private relatorioMovimentacaoContabilService: RelatorioMovimentacaoContabilService,
    private contasBancariaService: ContasBancariaService,
    private categoriasContabeisService: CategoriasContabeisService,
  ) { 
    this.carregarPerfil = new CarregarPerfil();
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  ngOnInit(): void {
    this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);

    this.limpar();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.carregarCombos();
  }

  carregarTipoRelatorio() {
    this.limparDataSourcer();
    this.prepararBusca();
  }

  prepararBusca() {
    this.comboPlanosContas = this.comboPlanosContasAll?.filter(c => !c.sintetica);

    if(this.tipoRelatorioSelecionado) {
      switch(this.tipoRelatorioSelecionado.tipo) { 
        case 'NP': { 
          this.displayedColumns = this.displayColunasNormativa;
          this.prepararBuscaNormativaPagamentos();
          break; 
        } 
        case 'FP': { 
          this.displayedColumns = this.displayColunasFaturaPagar;
          this.prepararBuscaFaturaPagar();
          break; 
        } 
        case 'SP': { 
          this.displayedColumns = this.displayColunasSaldoProjeto;
          this.prepararBuscaSaldoProjeto();
          break; 
        } 
        case 'MC': { 
          this.displayedColumns = this.displayColunasMovimentacaoContabil;
          this.prepararBuscaMovimentacaoContabil();
          this.comboPlanosContas = this.comboPlanosContasAll;
          break; 
        }         
        default: { 
          this.displayedColumns = [];
          break; 
        } 
     } 
    }
  }
  
  prepararBuscaNormativaPagamentos(): Observable<any>{
    if(this.tipoRelatorioSelecionado && this.tipoRelatorioSelecionado.tipo === 'NP') { 
      this.servicoBusca = this.relatorioNormativaPagamentosService;
      this.servicoBusca$ = this.relatorioNormativaPagamentosService.getFilter(this.filtro.planoConta?.id, 
                                                                              this.filtro.empresa?.id, 
                                                                              this.filtro.pessoaFisica?.id,
                                                                              this.filtro.programa?.id,
                                                                              this.filtro.projeto?.id, 
                                                                              this.filtro.dataInicio, 
                                                                              this.filtro.dataFim,
                                                                              this.filtro.rubricaAdicional);
    }
    return this.servicoBusca$;
  }

  prepararBuscaFaturaPagar(): Observable<any>{
    if(this.tipoRelatorioSelecionado && this.tipoRelatorioSelecionado.tipo === 'FP') { 
      this.servicoBusca = this.relatorioFaturasPagarService;
      this.servicoBusca$ = this.relatorioFaturasPagarService.getFilterView(this.filtro.planoConta?.id, 
                                                                       this.filtro.empresa?.id, 
                                                                       this.filtro.pessoaFisica?.id,
                                                                       this.filtro.programa?.id,
                                                                       this.filtro.projeto?.id,
                                                                       this.filtro.dataInicio, 
                                                                       this.filtro.dataFim,
                                                                       this.filtro.dataInicioVenc, 
                                                                       this.filtro.dataFimVenc);
    }
    return this.servicoBusca$;
  }

  prepararBuscaSaldoProjeto(): Observable<any>{
    if(this.tipoRelatorioSelecionado && this.tipoRelatorioSelecionado.tipo === 'SP') { 
      this.servicoBusca  = this.relatorioSaldoProjetoService;
      this.servicoBusca$ = this.relatorioSaldoProjetoService.getFilter(this.filtro.programa?.id,
                                                                       this.filtro.projeto?.id,
                                                                       this.filtro.dataInicio, 
                                                                       this.filtro.dataFim);
    }
    return this.servicoBusca$;
  }
  
  prepararBuscaMovimentacaoContabil(): Observable<any>{
    if(this.tipoRelatorioSelecionado && this.tipoRelatorioSelecionado.tipo === 'MC') { 
      this.servicoBusca  = this.relatorioMovimentacaoContabilService;
      this.servicoBusca$ = this.relatorioMovimentacaoContabilService.getFilter(this.filtro.planoConta?.id,
                                                                               this.filtro.programa?.id,
                                                                               this.filtro.projeto?.id,
                                                                               this.filtro.dataInicio, 
                                                                               this.filtro.dataFim);
    }
    return this.servicoBusca$;
  }

  consultar() {
    this.prepararBusca();    
    this.limparSaldoContaContabil();

    this.valorTotalMovimentos = 0;

    this.loadingPopupService.mostrarMensagemDialog('Buscando, aguarde...');
    this.servicoBusca$
    .subscribe(
      (dados: any[]) => {
        this.loadingPopupService.closeDialog();
        this.dadosDataSource = dados;
        this.dataSource.data = dados ? dados : [];

        if(this.isRelatorioNormativaPagamento()){
          this.dadosDataSource.forEach(mov => {
            this.valorTotalMovimentos = this.valorTotalMovimentos + mov.valorMovimentacao;
          });
        }

        if(this.isRelatorioMovimentacaoContabil() && this.isShowSaldoContabil()) {
          this.carregarValoresTotalOrigemAndDestino();

          if(this.filtro.programa?.id) {
            this.servicoBuscaSaldo$ = this.relatorioMovimentacaoContabilService.getSaldoContaContabilPrograma(this.filtro.planoConta.id, this.filtro.dataInicio, this.filtro.dataFim, this.filtro.programa.id);
            this.atualizarSaldoContabil$ = this.relatorioMovimentacaoContabilService.atualizarSaldoContabilPrograma(this.filtro.planoConta.id, this.filtro.dataInicio, this.filtro.programa.id);
          } else if (this.filtro.projeto?.id){
            this.servicoBuscaSaldo$ = this.relatorioMovimentacaoContabilService.getSaldoContaContabilProjeto(this.filtro.planoConta.id, this.filtro.dataInicio, this.filtro.dataFim, this.filtro.projeto.id);
            this.atualizarSaldoContabil$ = this.relatorioMovimentacaoContabilService.atualizarSaldoContabilProjeto(this.filtro.planoConta.id, this.filtro.dataInicio, this.filtro.projeto.id);
          } else {
            this.servicoBuscaSaldo$ = this.relatorioMovimentacaoContabilService.getSaldoContaContabil(this.filtro.planoConta.id, this.filtro.dataInicio, this.filtro.dataFim);
            this.atualizarSaldoContabil$ = this.relatorioMovimentacaoContabilService.atualizarSaldoContabil(this.filtro.planoConta.id, this.filtro.dataInicio);
          }

          this.servicoBuscaSaldo$.subscribe((objSaldos: any) => {
            this.valorSaldoInicioMovimentos = objSaldos.saldoDataInicio;
            this.valorTotalFinal = this.valorSaldoInicioMovimentos + this.valorTotalDestino + this.valorTotalOrigem;

            // Valida se o saldo final está correto, senão chama a função para atualizar
            const somatorioSaldos = this.valorSaldoInicioMovimentos + this.valorTotalOrigem + this.valorTotalDestino 
            if(Number(objSaldos.saldoDataFim.toFixed(2)) != Number(somatorioSaldos.toFixed(2))) {              
              this.loadingPopupService.mostrarMensagemDialog('Atualizando o saldo da conta contábil, aguarde...');
              this.atualizarSaldoContabil$
              .pipe(
                switchMap(() => this.servicoBuscaSaldo$)
              ).subscribe((objSaldos: any) => {
                this.loadingPopupService.closeDialog();
                this.valorSaldoInicioMovimentos = objSaldos.saldoDataInicio;
                this.valorTotalFinal = this.valorSaldoInicioMovimentos + this.valorTotalDestino + this.valorTotalOrigem;
                this.verificaMostrarTabela(dados);
              },
              (error)=> {
                this.loadingPopupService.closeDialog();
              });
            } else {
              this.verificaMostrarTabela(dados);
            }
          })
        } else {
          this.verificaMostrarTabela(dados);
        }
        
        this.selection.clear();
        this.dataSource.data.forEach(row => this.selection.select(row))
    },
    (error) => {
      this.toastService.showAlerta("Não foi possível recuperar os dados.")
      this.loadingPopupService.closeDialog();
    });
  }

  private carregarValoresTotalOrigemAndDestino() {
    if(!!this.filtro.planoConta?.id) {

      this.relatorioMovimentacaoContabilService.getContasContabeisSubordinadas(this.filtro.planoConta.id)
      .subscribe((contas: any[]) => {
        const valoresOrigem  = this.dataSource.data.filter(d => contas.find((conta) => conta === d.idCategoriaOrigem));
        const valoresDestino = this.dataSource.data.filter(d => contas.find((conta) => conta === d.idCategoriaDestino));
    
        valoresOrigem.forEach(mov => {
          this.valorTotalOrigem = this.valorTotalOrigem + mov.valorCategoria;
        });
  
        valoresDestino.forEach(mov => {
          this.valorTotalDestino = this.valorTotalDestino + mov.valorCategoria;
        });
      })


    }
  }

  
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  verificaMostrarTabela(lista: any[]) {
    if (!lista || lista.length == 0) {
      this.mostrarTabela = false;
      this.msg = "Nenhuma registro encontrado para o relatório."
    } else {
      this.mostrarTabela = true;
    }
  }

  public handlePageBottom(event: PageEvent) {
    this.paginator.pageSize = event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.page.emit(event);
  }

  getRelatorio(mimetype: string) {
    if(this.selection.selected && this.selection.selected.length === 0) {
      this.toastService.showAlerta('Selecione pelo menos um registro que deseja gerar o relatório.');
      return;
    }
    
    this.loadingPopupService.mostrarMensagemDialog('Gerando relatório ..');
    const dados = this.selection.selected;
    this.servicoBusca.showRelatorio(mimetype, dados).subscribe(
      response => {
        if(mimetype === this.MIMETYPE_PDF) {
          this.fileUtils.showFilePDF(response);
        } else {
          this.fileUtils.downloadFileXLS(response, this.tipoRelatorioSelecionado.nomeRelatorio + "xlsx");
        }
      },
      responseError => {
        const dataView = new DataView(responseError.error);
        const decoder = new TextDecoder('utf8');
        const resp = JSON.parse(decoder.decode(dataView));
        this.toastService.showAlerta(resp.mensagem);

      }).add(() => {
        this.loadingPopupService.closeDialog();
      });
  }


  limparDataSourcer() {
    this.filtro = new Filter();

    this.filtro.contaBancaria  = new ContasBancaria();
    this.filtro.planoConta     = new PlanosContas();
    this.filtro.programa       = new Programa();
    this.filtro.projeto        = new Projeto();
    this.filtro.empresa        = new ComboEmpresa();
    this.filtro.pessoaFisica   = new ComboPessoaFisica();

    this.selection.clear();
    this.dadosDataSource = [];
    this.dataSource.data = [];
    this.mostrarTabela = false;
    this.valorTotalMovimentos = 0;
    this.limparSaldoContaContabil();
  }

  limpar() {
    this.limparDataSourcer();

    this.mostrarTabela = false;
    this.tipoRelatorioSelecionado = null;
  }


  private carregarCombos(){
    this.categoriasContabeisService.getAllViewPlanosContas().subscribe((planosContas: PlanosContas[]) => {
      this.comboPlanosContasAll = planosContas;
    });

    this.contasBancariaService.getAllComboByInstituicaoLogada().subscribe((contasBancarias: ContasBancaria[]) => {
      this.comboContasBancarias = contasBancarias;
      this.comboContasBancarias.forEach(c => {
        c.descricaoCompleta = `Banco: ${c.banco.numero} - ${c.banco.nome} - Agência: ${c.numeroAgencia} - Conta: ${c.numeroContaBancaria}`;
      })
    });

    this.projetoService.getAllIntituicaoLogada().subscribe((projetos: Projeto[]) => {
      this.todosProjetos    = projetos;
      this.comboProjetos    = projetos;
    });

    this.programaService.getAllCombo().subscribe((programas: ComboPrograma[]) => {
      this.comboProgramas = programas;
    });

  }

  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }

  
  carregarPrograma(programa: ComboPrograma) {
    this.filtro.projeto = null;

    if(!programa) {
      this.comboProjetos = this.todosProjetos; 
      return;
    } 

    this.comboProjetos   = this.todosProjetos.filter(p => p.programa && p.programa.id === programa.id).map(p => {
      let combo = new ComboProjeto();
      combo.id   = p.id;
      combo.nome = p.nome;
      return combo;
    });
  }

  carregarProjeto(projeto: ComboProjeto) {
    if(!projeto) {
      this.filtro.projeto = null;
      return;
    }
  }

  limparFiltroEmpresa(pessoaFisica){
    this.filtro.pessoaFisica = pessoaFisica;
    if(pessoaFisica) {
      this.filtro.empresa = null;
    }
  }

  limparFiltroPessoaFisica(empresa){
    this.filtro.empresa = empresa;
    if(empresa) {
      this.filtro.pessoaFisica = null;
    }
  }


  isRequiredFiltroData(): boolean {
    return this.tipoRelatorioSelecionado.tipo !== 'FP';
  }


  showFiltroFornecedor(): boolean {
    return this.tipoRelatorioSelecionado.tipo !== 'SP' && this.tipoRelatorioSelecionado.tipo !== 'MC';
  }

  showFiltroCategoria(): boolean {
    return this.tipoRelatorioSelecionado.tipo !== 'SP';
  }

  showFiltroContaBancaria(): boolean {
    return this.tipoRelatorioSelecionado.tipo === 'SP';
  }

  showFiltroDataVencimento(): boolean {
    return this.tipoRelatorioSelecionado.tipo === 'FP';
  }

  showFiltroRubricaAdicional(): boolean {
    return this.tipoRelatorioSelecionado.tipo === 'NP';
  }

  isRelatorioNormativaPagamento(): boolean {
    return this.tipoRelatorioSelecionado.tipo === 'NP';
  }

  isRelatorioMovimentacaoContabil(): boolean {
    return this.tipoRelatorioSelecionado.tipo === 'MC';
  }

  isShowSaldoContabil(): boolean{
    return !!this.filtro.planoConta?.id && !!this.filtro.dataFim;
  }

  limparSaldoContaContabil(){
    this.valorSaldoInicioMovimentos = 0;
    this.valorTotalOrigem = 0;
    this.valorTotalDestino = 0;
    this.valorTotalFinal = 0;
  }
}
