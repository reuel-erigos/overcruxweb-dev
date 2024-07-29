import {Component, Input, OnInit, SimpleChanges, ViewChild,} from "@angular/core";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";

import {ActivatedRoute} from "@angular/router";
import * as _ from "lodash";
import {Acesso} from "src/app/core/acesso";
import {CarregarPerfil} from "src/app/core/carregar-perfil";
import {ToastService} from "src/app/services/toast/toast.service";
import {ObjetivoContrato} from "../../../../core/objetivoContrato";
import {MetaObjetivo} from "../../../../core/metaObjetivo";

@Component({
    selector: "objetivo-contrato",
    templateUrl: "./objetivo-contrato.component.html",
    styleUrls: ["./objetivo-contrato.component.css"],
})
export class ObjetivoContratoComponent implements OnInit {
    @Input() listaObjetivosContrato: ObjetivoContrato[];

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    mostrarTabela = false;
    msg: string;

    displayedColumns: string[] = [
        "nome",
        "descricao",
        "acoes",
    ];
    dataSource: MatTableDataSource<ObjetivoContrato> = new MatTableDataSource();

    openFormCadastro = false;

    perfilAcesso: Acesso = new Acesso();
    carregarPerfil: CarregarPerfil;

    isAtualizar = false;
    isAtualizarObjetivo = false;

    objetivoContrato: ObjetivoContrato = new ObjetivoContrato();
    objetivoContratoAtualizando: ObjetivoContrato = new ObjetivoContrato();

    constructor(
        private activatedRoute: ActivatedRoute,
        private toastService: ToastService,
    ) {
        this.carregarPerfil = new CarregarPerfil();
    }

    ngOnInit() {
        this.carregarPerfil.carregar(
            this.activatedRoute.snapshot.data.perfilAcesso,
            this.perfilAcesso
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes["listaObjetivosContrato"] &&
            !_.isEmpty(changes["listaObjetivosContrato"].currentValue)
        ) {
            this.carregarLista();
        }
    }

    limpar() {
        this.objetivoContrato = new ObjetivoContrato();
        this.objetivoContrato.metasObjetivo = [];
    }


    adicionar() {
        const objetivoAdicionado = new ObjetivoContrato();
        Object.assign(objetivoAdicionado, this.objetivoContrato);

        this.listaObjetivosContrato.push(objetivoAdicionado);
        this.limpar();
        this.openFormCadastro = !this.openFormCadastro;
        this.toastService.showSucesso("Objetivo adicionado com sucesso");
    }

    alterar() {
        const objetivoAlterado = new ObjetivoContrato();
        Object.assign(objetivoAlterado, this.objetivoContrato);
        const index = this.listaObjetivosContrato.indexOf(
            this.listaObjetivosContrato.find(
                (p) => p === this.objetivoContratoAtualizando
            )
        );
        this.listaObjetivosContrato[index] = objetivoAlterado;


        this.limpar();
        this.openFormCadastro = !this.openFormCadastro;
        this.toastService.showSucesso("Objetivo alterado com sucesso");
    }

    deletar(objetivoContrato: ObjetivoContrato): void {
        const index = this.listaObjetivosContrato.indexOf(
            this.listaObjetivosContrato.find((p) => p === objetivoContrato)
        );
        if (index >= 0) {
            this.listaObjetivosContrato.splice(index, 1);
            this.carregarLista();
        }
    }

    irNovo() {
        this.openFormCadastro = !this.openFormCadastro;
        this.limpar();
        this.isAtualizarObjetivo = false;
        this.objetivoContratoAtualizando = null;
    }

    irAtualizar(objetivoContrato: ObjetivoContrato) {
        this.objetivoContratoAtualizando = objetivoContrato;
        this.objetivoContrato = objetivoContrato;
        this.openFormCadastro = true;
        this.isAtualizarObjetivo = true;
    }

    carregarLista() {
        if (
            !this.listaObjetivosContrato ||
            this.listaObjetivosContrato.length === 0
        ) {
            this.mostrarTabela = false;
            this.msg = "Nenhum objetivo adicionado.";
        } else {
            this.dataSource.data = this.listaObjetivosContrato
                ? this.listaObjetivosContrato
                : [];
            this.mostrarTabela = true;
        }
    }

    addMetaObjetivo() {
        if (!this.objetivoContrato.metasObjetivo) {
            this.objetivoContrato.metasObjetivo = [];
        }

        const metaObjetivo: MetaObjetivo = new MetaObjetivo();
        metaObjetivo.id = undefined;
        metaObjetivo.codigo = "";
        metaObjetivo.descricao = "";
        this.objetivoContrato.metasObjetivo.push(metaObjetivo);
    }

}
