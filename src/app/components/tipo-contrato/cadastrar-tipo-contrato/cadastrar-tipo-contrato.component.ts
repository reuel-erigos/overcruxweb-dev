import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Acesso } from "src/app/core/acesso";
import { CarregarPerfil } from "src/app/core/carregar-perfil";
import { TipoContrato } from "src/app/core/tipo-contrato";
import { TipoContratoService } from "src/app/services/tipo-contrato/tipo-contrato.service";
import { ToastService } from "src/app/services/toast/toast.service";

@Component({
  selector: "cadastrar-tipo-contrato",
  templateUrl: "./cadastrar-tipo-contrato.component.html",
  styleUrls: ["./cadastrar-tipo-contrato.component.css"],
})
export class CadastrarTipoContratoComponent implements OnInit {
  tipoContrato: TipoContrato;

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil = new CarregarPerfil();

  mostrarBotaoCadastrar = true;
  mostrarBotaoAtualizar = true;

  isAtualizar: boolean = false;

  constructor(
    private tipoContratoService: TipoContratoService,
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

    const id = this.activatedRoute.snapshot.queryParams.id
      ? this.activatedRoute.snapshot.queryParams.id
      : null;
    if (id) {
      this.isAtualizar = true;
      this.tipoContratoService
        .getById(id)
        .subscribe((tipoContrato: TipoContrato) => {
          this.tipoContrato = tipoContrato;
        });
    }
  }
  inicializarObjetos() {
    this.tipoContrato = new TipoContrato();
  }

  mostrarBotaoLimpar() {
    if (this.isAtualizar) return false;
    if (!this.mostrarBotaoAtualizar) return false;
    if (!this.mostrarBotaoCadastrar) return false;

    return true;
  }

  cadastrar() {
    this.tipoContratoService.cadastrar(this.tipoContrato).subscribe(() => {
      this.toastService.showSucesso("Cadastro realizado com sucesso");
      this.router.navigate(["tipocontrato"]);
    });
  }

  limpar() {
    this.inicializarObjetos();
    this.tipoContrato.descricao = null;
  }

  cancelar() {
    this.router.navigate(["tipocontrato"]);
  }

  atualizar() {
    this.tipoContratoService.alterar(this.tipoContrato).subscribe(() => {
      this.toastService.showSucesso("Registro atualizado com sucesso");
    });
  }

  camposDesabilitados() {
    if (this.isAtualizar) {
      return !this.perfilAcesso.altera;
    }
    return !this.perfilAcesso.insere;
  }
}
