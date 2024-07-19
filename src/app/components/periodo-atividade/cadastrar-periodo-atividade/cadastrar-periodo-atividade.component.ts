import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Acesso } from "src/app/core/acesso";
import { CarregarPerfil } from "src/app/core/carregar-perfil";
import { PeriodoAtividade } from "src/app/core/periodo-atividade";
import { PeriodoAtividadeService } from "src/app/services/periodo-atividade/periodo-atividade.service";
import { ToastService } from "src/app/services/toast/toast.service";

@Component({
  selector: "cadastrar-periodo-atividade",
  templateUrl: "./cadastrar-periodo-atividade.component.html",
  styleUrls: ["./cadastrar-periodo-atividade.component.css"],
})
export class CadastrarPeriodoAtividadeComponent implements OnInit {
  periodoAtividade: PeriodoAtividade;

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil = new CarregarPerfil();

  mostrarBotaoCadastrar = true;
  mostrarBotaoAtualizar = true;

  isAtualizar: boolean = false;

  constructor(
    private periodoAtividadeService: PeriodoAtividadeService,
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
      this.periodoAtividadeService
        .getById(id)
        .subscribe((periodoAtividade: PeriodoAtividade) => {
          this.periodoAtividade = periodoAtividade;
        });
    }
  }
  inicializarObjetos() {
    this.periodoAtividade = new PeriodoAtividade();
  }

  mostrarBotaoLimpar() {
    if (this.isAtualizar) return false;
    if (!this.mostrarBotaoAtualizar) return false;
    if (!this.mostrarBotaoCadastrar) return false;

    return true;
  }

  cadastrar() {
    this.periodoAtividadeService.cadastrar(this.periodoAtividade).subscribe(() => {
      this.toastService.showSucesso("Cadastro realizado com sucesso");
      this.router.navigate(["periodoatividade"]);
    });
  }

  limpar() {
    this.inicializarObjetos();
    this.periodoAtividade.nome = null;
    this.periodoAtividade.descricao = null;
  }

  cancelar() {
    this.router.navigate(["periodoatividade"]);
  }

  atualizar() {
    this.periodoAtividadeService.alterar(this.periodoAtividade).subscribe(() => {
      this.toastService.showSucesso("Registro atualizado com sucesso");
    });
  }
}
