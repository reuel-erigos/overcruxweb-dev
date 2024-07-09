import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Atividade } from 'src/app/core/atividade';
import { Acesso } from 'src/app/core/acesso';
import { AtividadeService } from 'src/app/services/atividade/atividade.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Acoes } from './../../../core/acoes';
import { AcoesAtividadeService } from './../../../services/acoes-atividade/acoes-atividade.service';
import * as _ from 'lodash';
import { FuncionarioService } from 'src/app/services/funcionario/funcionario.service';
import { Funcionario } from 'src/app/core/funcionario';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { PessoaFisica } from 'src/app/core/pessoa-fisica';
import { ToolbarPrincipalService } from 'src/app/services/toolbarPrincipal/toolbar-principal.service';
import { GrupoAcoes } from 'src/app/core/grupo-acoes';
import { GrupoAcoesService } from 'src/app/services/grupo-acoes/grupo-acoes.service';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { FuncoesUteisService } from 'src/app/services/commons/funcoes-uteis.service';
import { log } from 'console';

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
  mostrarBotaoCadastrar = true;
  mostrarBotaoAtualizar = true;

  isAtualizar = false;


  constructor(
    //private acoesAtividadeService: AcoesAtividadeService,
    private funcoesUteisService: FuncoesUteisService,
    private grupoAcoesService: GrupoAcoesService,
    private funcionarioService: FuncionarioService,    
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private drc: ChangeDetectorRef,
    private dataUtilService: DataUtilService,
    private toolbarPrincipalService: ToolbarPrincipalService
  ) {
    this.grupoAcao.atividade = new Atividade();
    this.carregarPerfil = new CarregarPerfil();
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  ngOnInit() {
    this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);

    if (!this.perfilAcesso.insere) {
      this.mostrarBotaoCadastrar = false;
    }

    if (!this.perfilAcesso.altera) {
      this.mostrarBotaoAtualizar = false;
    }

    this.grupoAcao.funcionarioAnalise = new Funcionario();
    this.grupoAcao.funcionarioAnalise.pessoasFisica = new PessoaFisica();


    const idGrupoAcao = this.activatedRoute.snapshot.queryParams.codigoacao ? this.activatedRoute.snapshot.queryParams.codigoacao : null;
    if (idGrupoAcao) {
      this.isAtualizar = true;
      this.grupoAcoesService.getById(idGrupoAcao)
      .subscribe((grupoAcao: GrupoAcoes) => {
        this.grupoAcao = grupoAcao;

        if(this.grupoAcao.statusAnalise === 'A') {
          this.mostrarBotaoAtualizar = false;
        }

        if(!this.grupoAcao.funcionarioAnalise.pessoasFisica) {
          this.grupoAcao.funcionarioAnalise.pessoasFisica = new PessoaFisica();

          this.funcionarioService.getByPessoaFisica(this.toolbarPrincipalService.idPessoaFisica)
          .subscribe((funcionario: Funcionario) => {
            if(funcionario && funcionario.id) {
              this.grupoAcao.funcionarioAnalise = funcionario;
            }
          });
        }

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

    this.grupoAcao.numeroGrupo = this.funcoesUteisService.getApenasNumeros(this.grupoAcao.numeroGrupo);
    this.grupoAcoesService.cadastrar(this.grupoAcao).subscribe(() => {
      this.router.navigate(['acoesoficinas']);
      this.toastService.showSucesso('Planejamento de atividade cadastrado com sucesso');
    });
  }



  limpar() {
    this.grupoAcao = new GrupoAcoes();
    this.grupoAcao.atividade = new Atividade();
    this.grupoAcao.funcionarioAnalise = new Funcionario();
    this.grupoAcao.acoes =  [];
  }

  cancelar() {
    this.router.navigate(['acoesoficinas']);
  }


  atualizar() {
    if (!this.validarDatas() ) { return; }

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

  updateGrupoAcao(novoGrupoAcao: any) {
    if (novoGrupoAcao.id) {
      this.grupoAcao = novoGrupoAcao;
      this.mostrarBotaoCadastrar = false;

      this.isAtualizar = true;
      if (this.grupoAcao.statusAnalise === "A") {
        this.mostrarBotaoAtualizar = false;
      } else {
        this.mostrarBotaoAtualizar = true;
      }

      this.funcionarioService
        .getByPessoaFisica(this.toolbarPrincipalService.idPessoaFisica)
        .subscribe((funcionario: Funcionario) => {
          if (funcionario && funcionario.id) {
            this.grupoAcao.funcionarioAnalise = funcionario;
          }
        });
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
