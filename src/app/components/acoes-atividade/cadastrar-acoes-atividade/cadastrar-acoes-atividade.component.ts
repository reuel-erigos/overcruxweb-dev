import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Acesso } from 'src/app/core/acesso';
import { Atividade } from 'src/app/core/atividade';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { GrupoAcoes } from 'src/app/core/grupo-acoes';
import { Modulos } from 'src/app/core/modulos';
import { PessoaFisica } from 'src/app/core/pessoa-fisica';
import { UsuarioSistema } from 'src/app/core/usuario-sistema';
import { AcessoService } from 'src/app/services/acesso/acesso.service';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { FuncoesUteisService } from 'src/app/services/commons/funcoes-uteis.service';
import { FuncionarioService } from 'src/app/services/funcionario/funcionario.service';
import { GrupoAcoesService } from 'src/app/services/grupo-acoes/grupo-acoes.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ToolbarPrincipalService } from 'src/app/services/toolbarPrincipal/toolbar-principal.service';

@Component({
  selector: 'app-cadastrar-acoes-atividade',
  templateUrl: './cadastrar-acoes-atividade.component.html',
  styleUrls: ['./cadastrar-acoes-atividade.component.css']
})
export class CadastrarAcoesAtividadeComponent implements OnInit {

  grupoAcao: GrupoAcoes = new GrupoAcoes();

  //acoes: Acoes = new Acoes();

  carregarPerfil: CarregarPerfil;
  perfilAcesso: Acesso = new Acesso();
  perfilAcessoAnalise: Acesso = new Acesso();
  mostrarBotaoCadastrar = true;
  mostrarBotaoAtualizar = true;

  isAtualizar = false;


  constructor(
    //private acoesAtividadeService: AcoesAtividadeService,
    private funcoesUteisService: FuncoesUteisService,
    private grupoAcoesService: GrupoAcoesService, 
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private drc: ChangeDetectorRef,
    private dataUtilService: DataUtilService,
    private acessoService: AcessoService
  ) {
    this.grupoAcao.atividade = new Atividade();
    this.carregarPerfil = new CarregarPerfil();
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  ngOnInit() {
    this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);
    
    this.acessoService.getPerfilAcesso(Modulos["ANALISE_PLANEJAMENTO_ATIVIDADE"]).subscribe((perfilAcesso: Acesso[]) => {
      this.carregarPerfil.carregar(perfilAcesso, this.perfilAcessoAnalise);
    });

    if (!this.perfilAcesso.insere) {
      this.mostrarBotaoCadastrar = false;
    }

    if (!this.perfilAcesso.altera) {
      this.mostrarBotaoAtualizar = false;
    }

    this.grupoAcao.usuarioAnalise = new UsuarioSistema();
    this.grupoAcao.usuarioAnalise.pessoaFisica = new PessoaFisica();


    const idGrupoAcao = this.activatedRoute.snapshot.queryParams.codigoacao ? this.activatedRoute.snapshot.queryParams.codigoacao : null;
    if (idGrupoAcao) {
      this.isAtualizar = true;
      this.grupoAcoesService.getById(idGrupoAcao)
      .subscribe((grupoAcao: GrupoAcoes) => {
        this.grupoAcao = grupoAcao;

        if(this.grupoAcao.statusAnalise === 'A') {
          this.mostrarBotaoAtualizar = false;
        }

        if(!this.grupoAcao.usuarioAnalise) {
          this.grupoAcao.usuarioAnalise = new UsuarioSistema();
          this.grupoAcao.usuarioAnalise.pessoaFisica = new PessoaFisica();
        }
        this.verificarPermissaoAlterar();
        
      });
    }

  }

  mostrarBotaoLimpar() {
    if (this.isAtualizar) return false;
    if (!this.mostrarBotaoAtualizar) return false;
    if (!this.mostrarBotaoCadastrar) return false;

    return true;
  }

  cadastrar() {
    if (!this.validarDatas() ) { return; }
    if (!this.validarAcoes() ) { return; }

    this.grupoAcao.numeroGrupo = this.funcoesUteisService.getApenasNumeros(this.grupoAcao.numeroGrupo);
    this.grupoAcoesService.cadastrar(this.grupoAcao).subscribe(() => {
      this.router.navigate(['acoesoficinas']);
      this.toastService.showSucesso('Planejamento de atividade cadastrado com sucesso');
    });
  }



  limpar() {
    this.grupoAcao = new GrupoAcoes();
    this.grupoAcao.atividade = new Atividade();
    this.grupoAcao.usuarioAnalise = new UsuarioSistema();
    this.grupoAcao.acoes =  [];
  }

  cancelar() {
    this.router.navigate(['acoesoficinas']);
  }


  atualizar() {
    if (!this.validarDatas() ) { return; }
    if (!this.validarAcoes() ) { return; }

    this.grupoAcao.numeroGrupo = this.funcoesUteisService.getApenasNumeros(this.grupoAcao.numeroGrupo);
    this.grupoAcoesService.alterar(this.grupoAcao).subscribe(() => {
      this.router.navigate(['acoesoficinas']);
      this.toastService.showSucesso('Planejamento de atividade atualizado com sucesso');
    });

  }

  
  validarDatas(): boolean {
    let resultado = true;

    const dataInicioAtividade     = this.dataUtilService.getDataTruncata(this.grupoAcao.atividade.dataInicio);
    const dataFimAtividade        = this.dataUtilService.getDataTruncata(this.grupoAcao.atividade.dataFim);

    if(this.grupoAcao.acoes && this.grupoAcao.acoes.length > 0) {
      this.grupoAcao.acoes.forEach(acao => {
        const dataIncioMatricula      = this.dataUtilService.getDataTruncata(acao.dataPrevisaoInicio);
        if (dataIncioMatricula && dataIncioMatricula.getTime() < dataInicioAtividade.getTime()) {
          this.toastService.showAlerta('A data de início informada não pode ser menor que a data de início da atividade selecionada.');
          resultado = false;
        }

        if (dataFimAtividade) {
          if (dataIncioMatricula && dataIncioMatricula.getTime() > dataFimAtividade.getTime()) {
            this.toastService.showAlerta('A data de início informada não pode ser maior que a data de fim da atividade selecionada.');
            resultado = false;
          }
        }

      });
    }

    return resultado;
  }

  validarAcoes(): boolean {
    if (this.grupoAcao.acoes && this.grupoAcao.acoes.length <= 0) {
      this.toastService.showAlerta("É necessário adicionar ao menos uma ação.");
      return false;
    }
    return true;
  }

  updateGrupoAcao(novoGrupoAcao: any) {
    if (novoGrupoAcao.id) {
      this.grupoAcao = novoGrupoAcao;
      this.mostrarBotaoCadastrar = false;

      this.isAtualizar = true;
      this.verificarPermissaoAlterar();

      if(!this.grupoAcao.usuarioAnalise) {
        this.grupoAcao.usuarioAnalise = new UsuarioSistema();
        this.grupoAcao.usuarioAnalise.pessoaFisica = new PessoaFisica();
      }
    }
  }

  verificarPermissaoAlterar() {
    this.mostrarBotaoAtualizar = false;

    if (this.perfilAcesso.altera) {
      if (
        this.grupoAcao.statusAnalise === "A" ||
        this.grupoAcao.statusAnalise === "R"
      ) {
        if (this.perfilAcessoAnalise.altera) {
          this.mostrarBotaoAtualizar = true;
        }
      } else {
        this.mostrarBotaoAtualizar = true;
      }
    }
  }
  

  /*
  validarDatas(): boolean {
    const dataInicioAtividade     = this.dataUtilService.getValorByDate(this.acoes.oficina.dataInicio);
    const dataFimAtividade        = this.dataUtilService.getValorByDate(this.acoes.oficina.dataFim);

    const dataIncioMatricula      = this.dataUtilService.getValorByDate(this.acoes.dataInicio);
    const dataFimMatricula        = this.dataUtilService.getValorByDate(this.acoes.dataFim);

    if (dataIncioMatricula && dataIncioMatricula.getTime() < dataInicioAtividade.getTime()) {
      this.toastService.showAlerta('A data de início informada não pode ser menor que a data de início da atividade selecionada.');
      return false;
    }

    if (dataFimAtividade) {
      if (dataIncioMatricula && dataIncioMatricula.getTime() > dataFimAtividade.getTime()) {
        this.toastService.showAlerta('A data de início informada não pode ser menor que a data de início da atividade selecionada.');
        return false;
      }
    }

    if (dataFimAtividade && dataFimMatricula &&
      dataFimMatricula.getTime() > dataFimAtividade.getTime()) {
      this.toastService.showAlerta('A data de fim informada não pode ser maior que a data de fim da atividade selecionada.');
      return false;
    }

    if (dataFimMatricula &&
      dataFimMatricula.getTime() < dataInicioAtividade.getTime()) {
      this.toastService.showAlerta('A data de fim informada não pode ser menor que a data de início da atividade selecionada.');
      return false;
    }

    if (dataFimMatricula && dataIncioMatricula &&
      dataFimMatricula.getTime() < dataIncioMatricula.getTime()) {
      this.toastService.showAlerta('A data fim não pode ser menor que a data de inicio.');
      return false;
    }

    return true;
  }
  */


}
