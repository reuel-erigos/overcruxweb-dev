import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Acesso } from "src/app/core/acesso";
import { CarregarPerfil } from "src/app/core/carregar-perfil";
import { TiposContratos } from "src/app/core/tipos-contratos";
import { TiposContratosService } from "src/app/services/tipos-contratos/tipos-contratos.service";
import { ToastService } from "src/app/services/toast/toast.service";

@Component({
  selector: "cadastrar-tipos-contratos",
  templateUrl: "./cadastrar-tipos-contratos.component.html",
  styleUrls: ["./cadastrar-tipos-contratos.component.css"],
})
export class CadastrarTiposContratosComponent implements OnInit {
  tiposContratos: TiposContratos;

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil = new CarregarPerfil();

  mostrarBotaoCadastrar = true;
  mostrarBotaoAtualizar = true;

  isAtualizar: boolean = false;

  constructor(
    private tiposContratosService: TiposContratosService,
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
      this.tiposContratosService
        .getById(id)
        .subscribe((tiposContratos: TiposContratos) => {
          this.tiposContratos = tiposContratos;
        });
    }
  }
  inicializarObjetos() {
    this.tiposContratos = new TiposContratos();
  }

  mostrarBotaoLimpar() {
    if (this.isAtualizar) return false;
    if (!this.mostrarBotaoAtualizar) return false;
    if (!this.mostrarBotaoCadastrar) return false;

    return true;
  }

  cadastrar() {
    this.tiposContratosService.cadastrar(this.tiposContratos).subscribe(() => {
      this.toastService.showSucesso("Cadastro realizado com sucesso");
      this.router.navigate(["tiposcontratos"]);
    });
  }

  limpar() {
    this.inicializarObjetos();
    this.tiposContratos.descricao = null;
  }

  cancelar() {
    this.router.navigate(["tiposcontratos"]);
  }

  atualizar() {
    this.tiposContratosService.alterar(this.tiposContratos).subscribe(() => {
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
