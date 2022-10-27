import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Acesso } from 'src/app/core/acesso';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { ComboPessoaFisica } from 'src/app/core/combo-pessoa-fisica';
import { Unidade } from 'src/app/core/unidade';
import { CpfPipe } from 'src/app/pipes/cpf.pipe';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { UnidadeService } from 'src/app/services/unidade/unidade.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ExportacaoDadosAlunoService } from 'src/app/services/exportacao-dados-aluno/exportacao-dados-aluno.service';
import { ExportacaoDadosAluno } from 'src/app/core/exportacao-dados-aluno';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FileUtils } from 'src/app/utils/file-utils';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ListaCompletaDadosExportar } from 'src/app/core/lista-completa-dados-exportar';
import { Coluna } from 'src/app/core/coluna';
import { DadosExportar } from 'src/app/core/dados-exportar';
import { GrupoDadosExportar } from 'src/app/core/grupo-dados-exportar';
import { BaseComponent } from '../../../architeture/base/base.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FiltroExportacao } from '../../../core/filtro/filtro-exportacao';
import { ProgramaService } from '../../../services/programa/programa.service';
import { ProjetoService } from '../../../services/projeto/projeto.service';
import { ComboPrograma } from '../../../core/combo-programa';
import { ComboProjeto } from '../../../core/combo-projeto';

@Component({
  selector: 'exportar-dados-aluno',
  templateUrl: './exportar-dados-aluno.component.html',
  styleUrls: ['./exportar-dados-aluno.component.css'],
  providers: [CpfPipe],
})
export class ExportarDadosAlunoComponent extends BaseComponent implements OnInit {
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  comboUnidades: Unidade[];
  compoPrograma: ComboPrograma[];
  compoProjeto: ComboProjeto[];
  comboResponsaveis: ComboPessoaFisica[];

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil;

  displayedColumns: string[] = ['select', 'matricula','beneficiario','nomeMae','nomePai','unidade','dataEntrada', 'dataDesligamento'];
  dataSource: MatTableDataSource<ExportacaoDadosAluno> = new MatTableDataSource();
  mostrarTabela: boolean = false;
  msg: string;

  selection = new SelectionModel<ExportacaoDadosAluno>(true, []);

  exportacaoDadosAlunos: ExportacaoDadosAluno[]

  dadosExportar: DadosExportar = new DadosExportar();
  panelBeneficiarioOpenState = false;
  panelFamiliarOpenState     = false;

  form: FormGroup;
  mascaraCpf = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/,];

  constructor(private toastService: ToastService,
              private exportacaoDadosAlunoService: ExportacaoDadosAlunoService,
              private activatedRoute: ActivatedRoute,
              private fileUtils: FileUtils,
              private dialog: MatDialog,
              private loadingPopupService: LoadingPopupService,          
              private dataUtilService: DataUtilService,
              private unidadeService: UnidadeService,
              protected formBuilder: FormBuilder,
              private programaService: ProgramaService,
              private projetoService: ProjetoService) { 
    super();
    this.carregarPerfil = new CarregarPerfil();
    this.createForm();
  }

  ngOnInit(): void {
    this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);

    this.limpar();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.carregarCombos();

    this.addColunasAlunoDadosPessoais();
    this.addColunasAlunoAdmissao();
    this.addColunasAlunoEscolaridade();
    this.addColunasAlunoDocumentos();
    this.addColunasAlunoOutrasInformacoes();

    this.addColunasFamiliarDadosPessoais();
    this.addColunasFamiliarParentesco();
    this.addColunasFamiliarResonsavel();
    this.addColunasFamiliarEscolaridade();
    this.addColunasFamiliarDocumentos();
    this.addColunasFamiliarDadosProfissionais();
    this.addColunasFamiliarOutrasInformacoes();
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      cpf: [null],
      dataInicioEntradaInstituicao: [null],
      dataFimEntradaInstituicao: [null],
      dataInicioVigenciaInstituicao: [null],
      dataFimVigenciaInstituicao: [null],
      ativo: [null],
      beneficiario: [null],
      nomeMae: [null],
      nomePai: [null],
      unidade: [null],
      programa: [null],
      projeto: [null],
    });
  }

  consultar() {
    this.exportacaoDadosAlunoService.listFiltered(this.createFiltro())
      .subscribe((dados: ExportacaoDadosAluno[]) => {
      this.exportacaoDadosAlunos = dados;
      
      this.dataSource.data = dados ? dados : [];
      this.verificaMostrarTabela(dados);

      this.selection.clear();
      this.dataSource.data.forEach(row => this.selection.select(row));
      
    })
  }

  createFiltro() {
    const filtro = new FiltroExportacao();
    filtro.beneficiario = this.getValueForm(this.form, 'beneficiario');
    filtro.cpfAluno = this.getValueForm(this.form, 'cpf');
    filtro.dataFimEntradaInstituicao = this.getValueForm(this.form, 'dataFimEntradaInstituicao');
    filtro.dataFimVigenciaInstituicao = this.getValueForm(this.form, 'dataFimVigenciaInstituicao');
    filtro.dataInicioEntradaInstituicao = this.getValueForm(this.form, 'dataInicioEntradaInstituicao');
    filtro.dataInicioVigenciaInstituicao = this.getValueForm(this.form, 'dataInicioVigenciaInstituicao');
    filtro.maeAluno = this.getValueForm(this.form, 'nomeMae');
    filtro.paiAluno = this.getValueForm(this.form, 'nomePai');
    filtro.ativo = this.getValueForm(this.form, 'ativo');
    filtro.unidade = this.getValueForm(this.form, 'unidade');
    filtro.programa = this.getValueForm(this.form, 'programa');
    filtro.projeto = this.getValueForm(this.form, 'projeto');
    return filtro;
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

  verificaMostrarTabela(lista: ExportacaoDadosAluno[]) {
    if (!lista || lista.length == 0) {
      this.mostrarTabela = false;
      this.msg = "Nenhuma registro encontrado para exportação."
    } else {
      this.mostrarTabela = true;
    }
  }

  public handlePageBottom(event: PageEvent) {
    this.paginator.pageSize = event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.page.emit(event);
  }

  exportar() {
    if(this.selection.selected && this.selection.selected.length === 0) {
      this.toastService.showAlerta('Selecione pelo menos um registro que deseja exportar.');
      return;
    }

    const listaCompletaDadosExportar = new ListaCompletaDadosExportar();
    listaCompletaDadosExportar.listaDadosExportacao = this.selection.selected;
    listaCompletaDadosExportar.exportarDados = this.dadosExportar;

    this.chamaCaixaDialogoExportar(listaCompletaDadosExportar);    
  }


  chamaCaixaDialogoExportar(listaCompletaDadosExportar: ListaCompletaDadosExportar) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: `Certeza que deseja exportar ?`,
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.loadingPopupService.mostrarMensagemDialog('Gerando arquivo, aguarde...');
        this.exportacaoDadosAlunoService.gerarArquivo(listaCompletaDadosExportar)
        .subscribe((dados: any) => {
          this.fileUtils.downloadFileXLS(dados, "exportacao-dados-alunos.xlsx");
          this.toastService.showSucesso('Dados exportados com sucesso!');
          this.loadingPopupService.closeDialog();
        }, 
        (error) => {
          this.loadingPopupService.closeDialog();
        })        
      } else {
        dialogRef.close();
      }
    });
  }


  limpar() {
    this.form.reset();
    this.selection.clear();
    this.exportacaoDadosAlunos = [];
    this.dataSource.data = [];
  }
  
  private carregarCombos(){
    this.unidadeService.getAllByInstituicaoDaUnidadeLogada().subscribe((unidades: Unidade[]) => {
      this.comboUnidades = unidades;
    });
    this.programaService.getAllCombo().subscribe((programas: ComboPrograma[]) => {
      this.compoPrograma = programas;
      this.compoPrograma.forEach(a => a.nome = a.nome);
      this.compoPrograma.sort((a,b) => {
        if (a.nome > b.nome) {return 1;}
        if (a.nome < b.nome) {return -1;}
        return 0;
      });
    });
    this.projetoService.getAllCombo().subscribe((projetos: ComboProjeto[]) => {
      this.compoProjeto = projetos;
      this.compoProjeto.forEach(a => a.nome = a.nome);
      this.compoProjeto.sort((a,b) => {
        if (a.nome > b.nome) {return 1;}
        if (a.nome < b.nome) {return -1;}
        return 0;
      });
    });
  }

  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }

  updateAllComplete(dados: GrupoDadosExportar) {
    dados.exportar = dados.colunas != null && dados.colunas.every(t => t.exportar);
  }
  someComplete(dados: GrupoDadosExportar): boolean {
    if (dados.colunas == null) {return false;}
    return dados.colunas.filter(t => t.exportar).length > 0 && !dados.exportar;
  }
  setAll(completed: boolean, dados: GrupoDadosExportar) {
    dados.exportar = completed;

    if (dados.colunas == null) {return;}
    dados.colunas.forEach(t => t.exportar = completed);
  }


  getGrupoDadosAluno(nomeGrupo): GrupoDadosExportar {
    const grupoDados = this.dadosExportar.dados.filter(d => d.entidade === 'aluno').find(d => d.nomeGrupo === nomeGrupo);
    return grupoDados;
  }

  getGrupoDadosFamiliar(nomeGrupo): GrupoDadosExportar {
    const grupoDados = this.dadosExportar.dados.filter(d => d.entidade === 'familiar').find(d => d.nomeGrupo === nomeGrupo);
    return grupoDados;
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////
  addColunasAlunoDadosPessoais() {
    const colunas:Coluna[] = [];

    colunas.push({'nome':'nomeCompleto', 'descricao':'Nome Completo', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'dataNascimento', 'descricao':'Data Nascimento', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'cidadeNaturalidade', 'descricao':'Cidade Naturalidade', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'uf', 'descricao':'UF Naturalidade', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'sexo', 'descricao':'Sexo', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'racaCor', 'descricao':'Raça/Cor', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'nomeMae', 'descricao':'Nome Mãe', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'nomePai', 'descricao':'Nome Pai', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'estadoCivil', 'descricao':'Estado Civil', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'tipoSangue', 'descricao':'Tipo Sangue', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'cep', 'descricao':'Cep', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'endereco', 'descricao':'Endereço', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'cidade', 'descricao':'Cidade', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'bairro', 'descricao':'Bairro', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'ufEndereco', 'descricao':'UF', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'pontoReferncia', 'descricao':'Ponto de Referência', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'telefoneResidencial', 'descricao':'TelefoneResidencial', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'celular', 'descricao':'Celular', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'email', 'descricao':'Email', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'autorizoRecebimentoEmail', 'descricao':'Autorizo Recebimento de emails', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'foneRecado', 'descricao':'Telefone Recado', 'exportar': true, 'color': 'primary'});


    const dados: GrupoDadosExportar = {
      descricao: 'Dados Pessoais',
      entidade: 'aluno',
      exportar: true,
      colunas: colunas,
      color:'primary',
      nomeGrupo: 'dados_pessoais'
    };

    this.dadosExportar.dados.push(dados);
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////
  addColunasAlunoAdmissao() {
    const colunas:Coluna[] = [];

    colunas.push({'nome':'matricula', 'descricao':'Matrícula', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'unidade', 'descricao':'Unidade', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'programa', 'descricao':'Programa', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'projeto', 'descricao':'Projeto', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'dataEntrada', 'descricao':'Data de Entrada', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'dataDesligamento', 'descricao':'Data Desligamento', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'moraComOsPais', 'descricao':'Mora com os pais ?', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'paisSaoCasados', 'descricao':'Pais são casados ?', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'alunoPublicoPrioritario', 'descricao':'Trata-se de público prioritário', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'descPessoaBuscaAlunoEscola', 'descricao':'Descrição da pessoa que busca', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'desligamento', 'descricao':'Desligamento', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'observacao', 'descricao':'Observação', 'exportar': true, 'color': 'primary'});


    const dados: GrupoDadosExportar = {
      descricao: 'Inclusão',
      entidade: 'aluno',
      exportar: true,
      colunas: colunas,
      color:'primary',
      nomeGrupo: 'admissao'
    };
    this.dadosExportar.dados.push(dados);
  }

  
  ///////////////////////////////////////////////////////////////////////////////////////////////
  addColunasAlunoEscolaridade() {
    const colunas:Coluna[] = [];

    colunas.push({'nome':'descricao', 'descricao':'Descrição', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'alunoMatriculadoEscolaPublica', 'descricao':'Está matriculado na escola pública ?', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'nivelEscolaridade', 'descricao':'Nível de Escolaridade', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'grauInstrucao', 'descricao':'Grau de Instrução', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'tipoEscolaRegular', 'descricao':'Tipo da Escola Regular', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'TurnoEscolaRegular', 'descricao':'Turno da Escola Regular', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'identificacaoEscolaFrequentada', 'descricao':'Escola Frequentada', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'serieCursoEscolaRegular', 'descricao':'Série do Curso Regular', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'regiaoAdministrativaEscola', 'descricao':'Região Administrativa da Escola', 'exportar': true, 'color': 'primary'});


    const dados: GrupoDadosExportar = {
      descricao: 'Escolaridade',
      entidade: 'aluno',
      exportar: true,
      colunas: colunas,
      color:'primary',
      nomeGrupo: 'escolaridade'
    };
    this.dadosExportar.dados.push(dados);
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////
  addColunasAlunoDocumentos() {
    const colunas:Coluna[] = [];

    colunas.push({'nome':'cpf', 'descricao':'CPF', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'nis', 'descricao':'NIS', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'pis', 'descricao':'PIS/PASEP', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'identidade', 'descricao':'Identidade', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'orgaoExpedidor', 'descricao':'Órgão Expedidor', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'ufCI', 'descricao':'UF Identidade', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'dataEmissao', 'descricao':'Data Emissão', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'tituloEleitoral', 'descricao':'Título Eleitoral', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'zona', 'descricao':'Zone', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'sessao', 'descricao':'Sessão', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'numeroReservista', 'descricao':'Número Reservista', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'numeroRegiaoMilitar', 'descricao':'Número Região Militar', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'ufReservista', 'descricao':'UF Reservista', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'cnh', 'descricao':'CNH', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'categoriaCnh', 'descricao':'Categoria CNH', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'dataVencimentoCnh', 'descricao':'Data Vencimento CNH', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'numeroCarteiraTrabalho', 'descricao':'Número Carteira Trabalho', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'numeroSerie', 'descricao':'Número Série', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'ufCarteiraTrabalho', 'descricao':'UF Carteira Trabalho', 'exportar': true, 'color': 'primary'});

    const dados: GrupoDadosExportar = {
      descricao: 'Documentos',
      entidade: 'aluno',
      exportar: true,
      colunas: colunas,
      color:'primary',
      nomeGrupo: 'documentos'
    };
    this.dadosExportar.dados.push(dados);
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////
  addColunasAlunoOutrasInformacoes() {
    const colunas:Coluna[] = [];

    colunas.push({'nome':'possuiDeficiencia', 'descricao':'Possui Deficiência ?', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'descricaoDeficiencia', 'descricao':'Descrição Deficiência', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'descricaoProblemaSaude', 'descricao':'Descrição Problema Saúde', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'descricaoMedicamentosControlados', 'descricao':'Descrição Medicamentos Controlados', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'condicaoMoradia', 'descricao':'Condição Moradia', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'descricaoCondicaoMoradia', 'descricao':'Descrição Condição Moradia', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'jaAtendidoEmOutroOrgao', 'descricao':'Já atendido em outro órgao da rede ?', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'descricaoRelevanteAtendimentoOutroOrgao', 'descricao':'Descrição relevante do Atendimento por outro órgão', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'descricaoOutrosBeneficiosFamilia', 'descricao':'Descrição de outros benefícios da familia', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'descricaoRelevanteRedeApoioSocial', 'descricao':'Descrição relevante da Rede de Apoio', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'descricaoRedeApoioSocial', 'descricao':'Descrição da Rede de Apoio', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'valorOutrosBeneficiosSociais', 'descricao':'Valor de outros benefícios sociais', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'identificacaoOrigemRenda', 'descricao':'Identificação da origem de renda', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'origemBeneficio', 'descricao':'Origem do Benefício', 'exportar': true, 'color': 'primary'});

    const dados: GrupoDadosExportar = {
      descricao: 'Outras Informações',
      entidade: 'aluno',
      exportar: true,
      colunas: colunas,
      color:'primary',
      nomeGrupo:'outras_informacoes'
    };
    this.dadosExportar.dados.push(dados);
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////
  addColunasFamiliarDadosPessoais() {
    const colunas:Coluna[] = [];

    colunas.push({'nome':'nomeCompleto', 'descricao':'Nome Completo', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'dataNascimento', 'descricao':'Data Nascimento', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'cidadeNaturalidade', 'descricao':'Cidade Naturalidade', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'ufNaturalidade', 'descricao':'UF Naturalidade', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'sexo', 'descricao':'Sexo', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'racaCor', 'descricao':'Raça/Cor', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'nomeMae', 'descricao':'Nome Mãe', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'nomePai', 'descricao':'Nome Pai', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'estadoCivil', 'descricao':'Estado Civil', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'tipoSangue', 'descricao':'Tipo Sangue', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'cep', 'descricao':'Cep', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'endereco', 'descricao':'Endereço', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'cidade', 'descricao':'Cidade', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'bairro', 'descricao':'Bairro', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'ufEndereco', 'descricao':'UF', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'pontoReferncia', 'descricao':'Ponto de Referência', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'telefoneResidencial', 'descricao':'TelefoneResidencial', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'celular', 'descricao':'Celular', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'email', 'descricao':'Email', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'autorizoRecebimentoEmail', 'descricao':'Autorizo Recebimento de emails', 'exportar': true, 'color': 'primary'});


    const dados: GrupoDadosExportar = {
      descricao: 'Dados Pessoais',
      entidade: 'familiar',
      exportar: true,
      colunas: colunas,
      color:'primary',
      nomeGrupo: 'dados_pessoais'
    };
    this.dadosExportar.dados.push(dados);
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////
  addColunasFamiliarParentesco() {
    const colunas:Coluna[] = [];

    colunas.push({'nome':'dataCadastro', 'descricao':'Data Cadastro', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'dataDesligamento', 'descricao':'Data Desligamento', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'situacaoParentesco', 'descricao':'Situação Parentesco', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'descricaoGrauParentesco', 'descricao':'Descrição Grau Parentesco', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'descricaoDesligamento', 'descricao':'Descrição desligamento', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'outrasInformacoes', 'descricao':'Outras Informações', 'exportar': true, 'color': 'primary'});

    const dados: GrupoDadosExportar = {
      descricao: 'Parentesco',
      entidade: 'familiar',
      exportar: true,
      colunas: colunas,
      color:'primary',
      nomeGrupo: 'parentesco'
    };

    this.dadosExportar.dados.push(dados);
  }    


  ///////////////////////////////////////////////////////////////////////////////////////////////
  addColunasFamiliarResonsavel() {
    const colunas:Coluna[] = [];

    colunas.push({'nome':'dataVinculacao', 'descricao':'Data Vinculação', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'dataDesvinculacao', 'descricao':'Data Desvinculação', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'beneficiarioMesmoEndereco', 'descricao':'Beneficiário tem o mesmo endereço ?', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'autorizaLevarBuscar', 'descricao':'Busca e Leva o beneficiário', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'temTutela', 'descricao':'Tem Tutela ?', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'responsavelFinanceiro', 'descricao':'Responsável Financeiro ?', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'descricaoGrauParentesco', 'descricao':'Descrição Grau Parentesco', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'descricaoDesligamento', 'descricao':'Descrição Desligamento', 'exportar': true, 'color': 'primary'});

    const dados: GrupoDadosExportar = {
      descricao: 'Responsável',
      entidade: 'familiar',
      exportar: true,
      colunas: colunas,
      color:'primary',
      nomeGrupo: 'responsavel'
    };

    this.dadosExportar.dados.push(dados);
  }  
  

  ///////////////////////////////////////////////////////////////////////////////////////////////
  addColunasFamiliarEscolaridade() {
    const colunas:Coluna[] = [];

    colunas.push({'nome':'descricao', 'descricao':'Descrição', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'nivel', 'descricao':'Nível', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'grauInstrucao', 'descricao':'Grau Instrução', 'exportar': true, 'color': 'primary'});

    const dados: GrupoDadosExportar = {
      descricao: 'Escolaridade',
      entidade: 'familiar',
      exportar: true,
      colunas: colunas,
      color:'primary',
      nomeGrupo: 'escolaridade'
    };

    this.dadosExportar.dados.push(dados);
  } 


  ///////////////////////////////////////////////////////////////////////////////////////////////
  addColunasFamiliarDocumentos() {
    const colunas:Coluna[] = [];

    colunas.push({'nome':'cpf', 'descricao':'CPF', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'nis', 'descricao':'NIS', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'pis', 'descricao':'PIS/PASEP', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'identidade', 'descricao':'Identidade', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'orgaoExpedidor', 'descricao':'Órgão Expedidor', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'ufCI', 'descricao':'UF Identidade', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'dataEmissao', 'descricao':'Data Emissão', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'tituloEleitoral', 'descricao':'Título Eleitoral', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'zona', 'descricao':'Zone', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'sessao', 'descricao':'Sessão', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'numeroReservista', 'descricao':'Número Reservista', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'numeroRegiaoMilitar', 'descricao':'Número Região Militar', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'ufReservista', 'descricao':'UF Reservista', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'cnh', 'descricao':'CNH', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'categoriaCnh', 'descricao':'Categoria CNH', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'dataVencimentoCnh', 'descricao':'Data Vencimento CNH', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'numeroCarteiraTrabalho', 'descricao':'Número Carteira Trabalho', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'numeroSerie', 'descricao':'Número Série', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'ufCarteiraTrabalho', 'descricao':'UF Carteira Trabalho', 'exportar': true, 'color': 'primary'});

    const dados: GrupoDadosExportar = {
      descricao: 'Documentos',
      entidade: 'familiar',
      exportar: true,
      colunas: colunas,
      color:'primary',
      nomeGrupo: 'documentos'
    };

    this.dadosExportar.dados.push(dados);
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////
  addColunasFamiliarDadosProfissionais() {
    const colunas:Coluna[] = [];

    colunas.push({'nome':'profissao', 'descricao':'Profissão', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'empresa', 'descricao':'Empresa', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'possuiBolsaFamilia', 'descricao':'Possui bolsa familia ?', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'valorBolsaFamilia', 'descricao':'Valor Bolsa Familia', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'valorRenda', 'descricao':'Valor da Renda', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'telefoneComercial', 'descricao':'Telefone Comercial', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'situacaoTrabalho', 'descricao':'Situação Trabalho', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'motivoNaoTrabalhar', 'descricao':'Motivo de não trabalhar', 'exportar': true, 'color': 'primary'});

    const dados: GrupoDadosExportar = {
      descricao: 'Dados Profissionais',
      entidade: 'familiar',
      exportar: true,
      colunas: colunas,
      color:'primary',
      nomeGrupo: 'dados_profissionais'
    };

    this.dadosExportar.dados.push(dados);
  }  

  
  ///////////////////////////////////////////////////////////////////////////////////////////////
  addColunasFamiliarOutrasInformacoes() {
    const colunas:Coluna[] = [];

    colunas.push({'nome':'tipoEscolaRegular', 'descricao':'Tipo da escola regular', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'turnoEscolaRegular', 'descricao':'Turno da escola regular', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'identificacaoEscolaFrequentada', 'descricao':'Itendificacao Escola Frenquentada', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'nomeCursoEscolaRegular', 'descricao':'Nome do curso da escola regular', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'periodoCursoEscolaRegular', 'descricao':'Período do curso da escola regular', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'serieCursoEscolaRegular', 'descricao':'Série do curso da escola regular', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'regiaoAdministrativaEscola', 'descricao':'Região Administrativa Escola', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'possuiDeficiencia', 'descricao':'Possui deficiência ?', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'descricaoDeficiencia', 'descricao':'Descrição deficiência', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'descricaoProblemaSaude', 'descricao':'Descrição Problema Saúde', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'descricaoMedicamentosControlados', 'descricao':'Descrição Medicamentos Controlados', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'condicaoMoradia', 'descricao':'Condição Moradia', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'descricaoCondicaoMoradia', 'descricao':'Descrição Condição Moradia', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'descricaoRelevanteAtendimentoOutroOrgao', 'descricao':'Descrição relevante do Atendimento por outro órgão', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'descricaoOutrosBeneficiosFamilia', 'descricao':'Descrição de outros benefícios da familia', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'descricaoRelevanteRedeApoioSocial', 'descricao':'Descrição relevante da Rede de Apoio', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'descricaoRedeApoioSocial', 'descricao':'Descrição da Rede de Apoio', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'valorOutrosBeneficiosSociais', 'descricao':'Valor de outros benefícios sociais', 'exportar': true, 'color': 'primary'});
    colunas.push({'nome':'identificacaoOrigemRenda', 'descricao':'Identificação da origem de renda', 'exportar': true, 'color': 'primary'});
    
    const dados: GrupoDadosExportar = {
      descricao: 'Outras Informações',
      entidade: 'familiar',
      exportar: true,
      colunas: colunas,
      color:'primary',
      nomeGrupo: 'outras_informacoes'
    };

    this.dadosExportar.dados.push(dados);
  }  

}
