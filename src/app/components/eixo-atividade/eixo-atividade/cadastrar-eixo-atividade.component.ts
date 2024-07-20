import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Acesso } from "src/app/core/acesso";
import { CarregarPerfil } from "src/app/core/carregar-perfil";
import { EixoAtividade } from "src/app/core/eixo-atividade";
import { EixoAtividadeService } from "src/app/services/eixo-atividade/eixo-atividade.service";
import { ToastService } from "src/app/services/toast/toast.service";

@Component({
  selector: "cadastrar-eixo-atividade",
  templateUrl: "./cadastrar-eixo-atividade.component.html",
  styleUrls: ["./cadastrar-eixo-atividade.component.css"],
})
export class CadastrarEixoAtividadeComponent implements OnInit {
  eixoAtividade: EixoAtividade;

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil = new CarregarPerfil();

  mostrarBotaoCadastrar = true;
  mostrarBotaoAtualizar = true;

  isAtualizar: boolean = false;

  constructor(
    private eixoAtividadeService: EixoAtividadeService,
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
      this.eixoAtividadeService
        .getById(id)
        .subscribe((eixoAtividade: EixoAtividade) => {
          this.eixoAtividade = eixoAtividade;
        });
    }
  }
  inicializarObjetos() {
    this.eixoAtividade = new EixoAtividade();
  }

  mostrarBotaoLimpar() {
    if (this.isAtualizar) return false;
    if (!this.mostrarBotaoAtualizar) return false;
    if (!this.mostrarBotaoCadastrar) return false;

    return true;
  }

  cadastrar() {
    this.eixoAtividadeService.cadastrar(this.eixoAtividade).subscribe(() => {
      this.toastService.showSucesso("Cadastro realizado com sucesso");
      this.router.navigate(["eixoatividade"]);
    });
  }

  limpar() {
    this.inicializarObjetos();
    this.eixoAtividade.nome = null;
    this.eixoAtividade.descricao = null;
  }

  cancelar() {
    this.router.navigate(["eixoatividade"]);
  }

  atualizar() {
    this.eixoAtividadeService.alterar(this.eixoAtividade).subscribe(() => {
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
