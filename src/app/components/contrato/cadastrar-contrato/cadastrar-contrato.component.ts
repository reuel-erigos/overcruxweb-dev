import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Acesso } from 'src/app/core/acesso';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { ContratoService } from 'src/app/services/contrato/contrato.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Contrato } from '../../../core/contrato';

@Component({
  selector: "app-cadastrar-contrato",
  templateUrl: "./cadastrar-contrato.component.html",
  styleUrls: ["./cadastrar-contrato.component.css"],
})
export class CadastrarContratoComponent implements OnInit {
  contrato: Contrato = new Contrato();

  isAtualizar: boolean = false;

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil = new CarregarPerfil();

  mostrarBotaoCadastrar = true;
  mostrarBotaoAtualizar = true;

  constructor(
    private contratoService: ContratoService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.inicializarObjetos();

    this.carregarPerfil.carregar(
      this.activatedRoute.snapshot.data.perfilAcesso,
      this.perfilAcesso
    );

    if (!this.perfilAcesso.insere) {
      this.mostrarBotaoCadastrar = false;
    }

    if (!this.perfilAcesso.altera) {
      this.mostrarBotaoAtualizar = false;
    }

    let idContrato: number;
    idContrato = this.activatedRoute.snapshot.queryParams.idContrato
      ? this.activatedRoute.snapshot.queryParams.idContrato
      : null;
    if (idContrato) {
      this.isAtualizar = true;
      this.contratoService
        .getById(idContrato)
        .subscribe((contrato: Contrato) => {
          this.contrato = contrato;
        });
    }
  }
  inicializarObjetos() {
    this.contrato = new Contrato();
    this.contrato.programasContrato = [];
    this.contrato.projetosContrato = [];
  }

  mostrarBotaoLimpar() {
    if (this.isAtualizar) return false;
    if (!this.mostrarBotaoAtualizar) return false;
    if (!this.mostrarBotaoCadastrar) return false;

    return true;
  }

  cadastrar() {
    this.contratoService.cadastrar(this.contrato).subscribe(() => {
      this.toastService.showSucesso("Contrato cadastrado com sucesso");
    });
  }

  limpar() {
    this.inicializarObjetos();
  }

  cancelar() {
    this.router.navigate(["contrato"]);
  }

  atualizar() {
    this.contratoService.alterar(this.contrato).subscribe(() => {
      this.toastService.showSucesso("Contrato atualizado com sucesso");
    });
  }
}
