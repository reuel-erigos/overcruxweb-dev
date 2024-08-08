import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Acesso} from "src/app/core/acesso";
import {CarregarPerfil} from "src/app/core/carregar-perfil";
import {ToastService} from "src/app/services/toast/toast.service";
import {PercursoService} from "../../../services/percurso/percurso.service";
import {Percurso} from "../../../core/percurso";

@Component({
    selector: "cadastrar-percurso",
    templateUrl: "./cadastrar-percurso.component.html",
    styleUrls: ["./cadastrar-percurso.component.css"],
})
export class CadastrarPercursoComponent implements OnInit {
    percurso: Percurso;

    perfilAcesso: Acesso = new Acesso();
    carregarPerfil: CarregarPerfil = new CarregarPerfil();

    mostrarBotaoCadastrar = true;
    mostrarBotaoAtualizar = true;

    isAtualizar: boolean = false;

    constructor(
        private percursoService: PercursoService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private toastService: ToastService
    ) {
    }

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
            this.percursoService
                .getById(id)
                .subscribe((percurso: Percurso) => {
                    this.percurso = percurso;
                });
        }
    }

    inicializarObjetos() {
        this.percurso = new Percurso();
    }

    mostrarBotaoLimpar() {
        if (this.isAtualizar) return false;
        if (!this.mostrarBotaoAtualizar) return false;
        if (!this.mostrarBotaoCadastrar) return false;

        return true;
    }

    cadastrar() {
        this.percursoService.cadastrar(this.percurso).subscribe(() => {
            this.toastService.showSucesso("Cadastro realizado com sucesso");
            this.router.navigate(["percurso"]);
        });
    }

    limpar() {
        this.inicializarObjetos();
        this.percurso.descricao = null;
    }

    cancelar() {
        this.router.navigate(["percurso"]);
    }

    atualizar() {
        this.percursoService.alterar(this.percurso).subscribe(() => {
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
