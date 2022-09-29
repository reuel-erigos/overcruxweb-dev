import { Component, OnInit, ViewChild } from '@angular/core';
import { PessoaFisica } from 'src/app/core/pessoa-fisica';
import { Aluno } from 'src/app/core/aluno';
import { AlunoService } from 'src/app/services/aluno/aluno.service';
import { Location } from '@angular/common';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ActivatedRoute } from '@angular/router';
import { ArquivoPessoaFisicaService } from 'src/app/services/arquivo-pessoa-fisica/arquivo-pessoa-fisica.service';
import { FileUtils } from 'src/app/utils/file-utils';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GrausInstrucao } from 'src/app/core/graus-instrucao';
import { Acesso } from 'src/app/core/acesso';
import { AutenticadorService } from 'src/app/services/autenticador/autenticador.service';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { RelatorioBeneficiarioService } from '../../../services/relatorio-beneficiario/relatorio-beneficiario.service';
import { Familiares } from '../../../core/familiares';
import { FamiliarAlunoService } from '../../../services/familiar-aluno/familiar-aluno.service';
import { ResponsaveisAluno } from '../../../core/responsaveis-aluno';
import { AtividadeAluno } from '../../../core/atividade-aluno';
import { AtividadeAlunoService } from '../../../services/atividade-aluno/atividade-aluno.service';
import { ProfissionalFamiliarAlunoComponent } from '../profissional-familiar-aluno/profissional-familiar-aluno.component';
import { Escola } from '../../../core/escola';
import { RegiaoAdministrativa } from '../../../core/regiao-administrativa';
import { SerieEscolar } from '../../../core/serie-escolar';
import { GrausParentesco } from '../../../core/graus-parentesco';
import { MatriculaService } from '../../../services/matricula/matricula.service';
import { AlunosTurma } from '../../../core/alunos-turma';

@Component({
  selector: 'app-cadastar-aluno',
  templateUrl: './cadastar-aluno.component.html',
  styleUrls: ['./cadastar-aluno.component.css']
})
export class CadastarAlunoComponent implements OnInit {

  aluno: Aluno = new Aluno();
  familiar: Familiares;
  responsavel: ResponsaveisAluno;
  matriculas: AlunosTurma[] = [];

  isAtualizar = false;

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil  = new CarregarPerfil();

  mostrarBotaoCadastrar = true;
  mostrarBotaoAtualizar = true;

  @ViewChild(ProfissionalFamiliarAlunoComponent) planoAplicacaoAnexoComponent: ProfissionalFamiliarAlunoComponent;
  

  constructor(
    private alunoService: AlunoService,
    private familiarAlunoService: FamiliarAlunoService,
    private matriculaService: MatriculaService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private toastService: ToastService,
    private arquivoPessoaFisicaService: ArquivoPessoaFisicaService,
    private fileUtils: FileUtils,
    private autenticadorService: AutenticadorService,
    private loadingPopupService: LoadingPopupService,
    private botoesRelatorio: MatBottomSheet,
    private relatorioBeneficiarioService: RelatorioBeneficiarioService,
    private atividadeAlunoService: AtividadeAlunoService,
  ) {
  }
  
  ngOnInit() {
    this.aluno = new Aluno();
    this.aluno.pessoaFisica = new PessoaFisica();
    this.aluno.pessoaFisica.serieEscolar = new SerieEscolar();
    this.aluno.vulnerabilidades = [];
    this.aluno.pessoaFisica.grausInstrucao = new GrausInstrucao();

    this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);

    if(!this.perfilAcesso.insere){
      this.mostrarBotaoCadastrar = false;
    }

    if(!this.perfilAcesso.altera){
      this.mostrarBotaoAtualizar = false;
    }

    let idAluno: number;
    idAluno = this.activatedRoute.snapshot.queryParams.id ? this.activatedRoute.snapshot.queryParams.id : null;
    if (idAluno) {
      this.isAtualizar = true;
      this.alunoService.getById(idAluno).pipe(
        switchMap((aluno: Aluno) => {
          this.aluno = aluno;
          if(!this.aluno.pessoaFisica.serieEscolar) {
            this.aluno.pessoaFisica.serieEscolar = new SerieEscolar();
          }
          this.recuperarAtividades(idAluno);
          return this.arquivoPessoaFisicaService.get(aluno.pessoaFisica.id);
        })
      ).subscribe((foto: any) => {
        this.aluno.pessoaFisica.foto = foto;
        foto = this.fileUtils.convertBufferArrayToBase64(foto);
        this.aluno.pessoaFisica.urlFoto = foto ? foto.changingThisBreaksApplicationSecurity : '';
      });

      this.recuperarResposavelVigente(idAluno);
      this.recuperarMatriculaAluno(idAluno);
    }
  }

  private recuperarAtividades(idAluno: number) {
    this.atividadeAlunoService.getAllUniformeByAlunoAndInstituicao(idAluno)
    .subscribe((atividadesAluno: AtividadeAluno[]) => {
      if (atividadesAluno && atividadesAluno.length === 0) {
        this.aluno.atividades = [];
      } else {
        this.aluno.atividades = atividadesAluno;
      }
    });
  }

  private recuperarResposavelVigente(idAluno: number) {
    this.familiarAlunoService.getResponsavelVigente(idAluno).subscribe((responsavel: ResponsaveisAluno) => {
      if (responsavel && responsavel.id) {
        this.responsavel = responsavel;
        this.familiar = responsavel.familiar;
        if(!this.familiar.grauParentesco || !this.familiar.grauParentesco.id) {
          this.familiar.grauParentesco = new GrausParentesco();
        }
      }
    });
  }

  private recuperarMatriculaAluno(idAluno: number) {
    this.matriculaService.getByAluno(idAluno).subscribe((resp: AlunosTurma[]) => {
      if (resp) {
        this.matriculas = resp;
      }
    });
  }

  addFamiliar() {
    this.familiar = new Familiares();
    this.familiar.grauParentesco = new GrausParentesco();
    this.familiar.pessoasFisica = new PessoaFisica();
    this.familiar.pessoasFisica.grausInstrucao = new GrausInstrucao();
    this.familiar.pessoasFisica.beneficiosSociaisPessoaFisica = [];
    this.responsavel = new ResponsaveisAluno();
  }
  
  removeFamiliar() {
    this.familiar = null;
    this.responsavel = null;
  }

  mostrarBotaoLimpar(){
    if(this.isAtualizar) return false;
    if(!this.mostrarBotaoAtualizar) return false;
    if(!this.mostrarBotaoCadastrar) return false;

    return true;
  }

  cadastrar() {
    this.tratarDados();
    this.aluno.familiar = this.familiar;
    this.aluno.responsavelVigente = this.responsavel;
    this.aluno.matriculas = this.matriculas;
    this.loadingPopupService.mostrarMensagemDialog('Salvando dados do aluno, aguarde...');
    this.alunoService.cadastrar(this.aluno).pipe(
      switchMap((alunoRetorno: Aluno) => {
        if (this.aluno.pessoaFisica.isFotoChanged && this.aluno.pessoaFisica.foto) {
          return this.arquivoPessoaFisicaService.gravar(this.aluno.pessoaFisica.foto, alunoRetorno.pessoaFisica.id);
        } else {
          return new Observable(obs => obs.next());
        }
      })
    ).subscribe(() => {
      this.location.back();
      this.loadingPopupService.closeDialog();
      this.toastService.showSucesso('Aluno cadastrado com sucesso');
      this.recuperarResposavelVigente(this.aluno.id);
    });
  }

  tratarDados() {
    this.aluno.pessoaFisica.cep = this.aluno.pessoaFisica.cep ? this.retiraMascara(this.aluno.pessoaFisica.cep.toString()) : null
    this.aluno.pessoaFisica.cpf = this.aluno.pessoaFisica.cpf ? this.retiraMascara(this.aluno.pessoaFisica.cpf.toString()) : null

    this.aluno.pessoaFisica.celular = this.aluno.pessoaFisica.celular ? this.retiraMascara(this.aluno.pessoaFisica.celular.toString()) : null
    this.aluno.pessoaFisica.telefoneResidencial = this.aluno.pessoaFisica.telefoneResidencial ? this.retiraMascara(this.aluno.pessoaFisica.telefoneResidencial.toString()) : null
    this.aluno.pessoaFisica.foneRecado = this.aluno.pessoaFisica.foneRecado ? this.retiraMascara(this.aluno.pessoaFisica.foneRecado.toString()) : null
    this.aluno.pessoaFisica.celular2 = this.aluno.pessoaFisica.celular2 ? this.retiraMascara(this.aluno.pessoaFisica.celular2.toString()) : null
    this.aluno.pessoaFisica.celular3 = this.aluno.pessoaFisica.celular3 ? this.retiraMascara(this.aluno.pessoaFisica.celular3.toString()) : null

    if(this.familiar && this.familiar.pessoasFisica) {
      this.familiar.pessoasFisica.cep =  this.familiar.pessoasFisica.cep ? this.retiraMascara( this.familiar.pessoasFisica.cep.toString()) : null
      this.familiar.pessoasFisica.cpf =  this.familiar.pessoasFisica.cpf ? this.retiraMascara( this.familiar.pessoasFisica.cpf.toString()) : null
  
      this.familiar.pessoasFisica.celular =  this.familiar.pessoasFisica.celular ? this.retiraMascara( this.familiar.pessoasFisica.celular.toString()) : null
      this.familiar.pessoasFisica.telefoneResidencial =  this.familiar.pessoasFisica.telefoneResidencial ? this.retiraMascara( this.familiar.pessoasFisica.telefoneResidencial.toString()) : null
      this.familiar.pessoasFisica.foneRecado =  this.familiar.pessoasFisica.foneRecado ? this.retiraMascara( this.familiar.pessoasFisica.foneRecado.toString()) : null
      this.familiar.pessoasFisica.celular2 =  this.familiar.pessoasFisica.celular2 ? this.retiraMascara( this.familiar.pessoasFisica.celular2.toString()) : null
      this.familiar.pessoasFisica.celular3 =  this.familiar.pessoasFisica.celular3 ? this.retiraMascara( this.familiar.pessoasFisica.celular3.toString()) : null
      this.familiar.pessoasFisica.telefoneComercial =  this.familiar.pessoasFisica.telefoneComercial ? this.retiraMascara( this.familiar.pessoasFisica.telefoneComercial.toString()) : null
  
    }
  }

  limpar() {
    this.aluno = new Aluno();
  }

  cancelar() {
    this.location.back();
  }

  retiraMascara(objeto) {
    return objeto.replace(/\D/g, '');
  }

  atualizar() {
    this.tratarDados();
    this.aluno.familiar = this.familiar;
    this.aluno.responsavelVigente = this.responsavel;
    this.aluno.matriculas = this.matriculas;
    this.loadingPopupService.mostrarMensagemDialog('Salvando dados do aluno, aguarde...');
    this.alunoService.alterar(this.aluno).pipe(
      switchMap((aluno: Aluno) => {
        if (this.aluno.pessoaFisica.isFotoChanged && this.aluno.pessoaFisica.foto) {
          return this.arquivoPessoaFisicaService.alterar(this.aluno.pessoaFisica.foto, aluno.pessoaFisica.id);
        } else {
         return new Observable(obs => obs.next());
        }
      })
    ).subscribe(
      () => {
        this.loadingPopupService.closeDialog();
        this.toastService.showSucesso('Aluno atualizado com sucesso');
        this.autenticadorService.revalidarSessao();
      
        this.alunoService.getById(this.aluno.id).subscribe((aluno: Aluno) => {
          Object.assign(this.aluno, aluno);
          if(!this.aluno.pessoaFisica.serieEscolar) {
            this.aluno.pessoaFisica.serieEscolar = new SerieEscolar();
          }
          if(!this.aluno.familiar.grauParentesco) {
            this.aluno.familiar.grauParentesco = new GrausParentesco();
          }
        });
        this.recuperarAtividades(this.aluno.id);
        this.recuperarResposavelVigente(this.aluno.id);
    },
    (error) => {
      this.loadingPopupService.closeDialog();
    });

  }

  abrirOpcoesRelatorio() {
    const botoesRelatorioRef =  this.botoesRelatorio.open(BotoesRelatorioComponent);
    botoesRelatorioRef.afterDismissed().subscribe((tipo) => {
      this.getRelatorio(tipo);
    });
  }

  getRelatorio(tipo: string) {
    
    this.loadingPopupService.mostrarMensagemDialog('Gerando relatório ..');

    const listaIdsPessoaFisica = [];
    listaIdsPessoaFisica.push(this.aluno.pessoaFisica.id);
    this.relatorioBeneficiarioService.showRelatorio(tipo, "pdf", listaIdsPessoaFisica).subscribe(
      response => {
          this.fileUtils.showFilePDF(response);
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

  isDataResponsavelInvalida() {
    return this.responsavel && !this.responsavel.dataVinculacao;
  }

  carregarPessoaFisica(pessoaFisica: PessoaFisica) {
    this.aluno.pessoaFisica = pessoaFisica;
  }

  carregarFamiliarPessoaFisica(pessoaFisica: PessoaFisica) {
    this.familiar.pessoasFisica = pessoaFisica;
  }

  copiarEnderecoBeneficiario() {
    this.familiar.pessoasFisica.cep = this.aluno.pessoaFisica.cep;
    this.familiar.pessoasFisica.endereco = this.aluno.pessoaFisica.endereco;
    this.familiar.pessoasFisica.complementoEndereco = this.aluno.pessoaFisica.complementoEndereco;
    this.familiar.pessoasFisica.cidade = this.aluno.pessoaFisica.cidade;
    this.familiar.pessoasFisica.bairro = this.aluno.pessoaFisica.bairro;
    this.familiar.pessoasFisica.uf = this.aluno.pessoaFisica.uf;
  }

  calcularValorRenda() {
    this.planoAplicacaoAnexoComponent.calcularValorRenda();
  }
}

@Component({
  selector: 'botoes-relatorios',
  templateUrl: 'botoes-relatorio.html',
})
export class BotoesRelatorioComponent {
  constructor(private botoesRelatorioRef: MatBottomSheetRef<BotoesRelatorioComponent>) {}

  selecionaRelatorio(tipo: string): void {
    this.botoesRelatorioRef.dismiss(tipo);
  }
}