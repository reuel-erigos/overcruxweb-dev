import {Component, Input, OnInit, SimpleChanges, ViewChild,} from "@angular/core";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";

import {ActivatedRoute} from "@angular/router";
import * as _ from "lodash";
import {Acesso} from "src/app/core/acesso";
import {CarregarPerfil} from "src/app/core/carregar-perfil";
import {AlunoContrato} from "src/app/core/alunoContrato";
import {DataUtilService} from "src/app/services/commons/data-util.service";
import {ToastService} from "src/app/services/toast/toast.service";
import {Contrato} from "../../../core/contrato";
import {ContratoService} from "../../../services/contrato/contrato.service";

@Component({
    selector: "aluno-contrato",
    templateUrl: "./aluno-contrato.component.html",
    styleUrls: ["./aluno-contrato.component.css"],
})
export class AlunoContratoComponent implements OnInit {
    @Input() listaAlunosContrato: AlunoContrato[];
    @Input() isAtualizar: boolean;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    mostrarTabela = false;
    msg: string;

    displayedColumns: string[] = [
        "contrato",
        "dataInicio",
        "dataFim",
        "valor",
        "acoes",
    ];
    dataSource: MatTableDataSource<AlunoContrato> = new MatTableDataSource();

    openFormCadastro = false;

    perfilAcesso: Acesso = new Acesso();
    carregarPerfil: CarregarPerfil;

    isAtualizarAluno = false;

    contratoComboCadastro: Contrato[];
    alunoContrato: AlunoContrato = new AlunoContrato();
    alunoContratoAtualizando: AlunoContrato = new AlunoContrato();

    constructor(
        private activatedRoute: ActivatedRoute,
        private toastService: ToastService,
        private contratoService: ContratoService,
        private dataUtilService: DataUtilService
    ) {
        this.carregarPerfil = new CarregarPerfil();
    }

    ngOnInit() {
        this.listaAlunosContrato = [];

        this.carregarPerfil.carregar(
            this.activatedRoute.snapshot.data.perfilAcesso,
            this.perfilAcesso
        );

        this.contratoService.getAllCombo().subscribe((alunos: Contrato[]) => {
            this.contratoComboCadastro = alunos;
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes["listaAlunosContrato"] &&
            !_.isEmpty(changes["listaAlunosContrato"].currentValue)
        ) {
            this.carregarLista();
        }
    }

    limpar() {
        this.alunoContrato = new AlunoContrato();
        this.alunoContrato.contrato = new Contrato();
        this.isAtualizarAluno = false;
        this.alunoContratoAtualizando = null;
        if (!this.perfilAcesso.insere)
            this.openFormCadastro = false;
    }

    isContratoJaAdicionado(): boolean {
        const alunoAdicionado = this.listaAlunosContrato.find(
            (p: AlunoContrato) =>
                p.contrato.id === this.alunoContrato.contrato.id &&
                this.alunoContratoAtualizando !== p
        );

        return !!alunoAdicionado;
    }

    validarDatas(): boolean {
        const dataInicio = this.dataUtilService.getDataTruncata(
            this.alunoContrato.dataInicio
        );
        const dataFim = this.dataUtilService.getDataTruncata(
            this.alunoContrato.dataFim
        );

        if (dataFim) {
            if (dataInicio && dataInicio.getTime() > dataFim.getTime()) {
                this.toastService.showAlerta(
                    "A data de início informada não pode ser maior que a data de fim do contrato."
                );
                return false;
            }
        }
        return true;
    }

    adicionar() {
        if (this.isContratoJaAdicionado()) {
            this.toastService.showAlerta("Contrato já adicionado");
            return;
        }
        if (!this.validarDatas()) return;

        const alunoAdicionado = new AlunoContrato();
        Object.assign(alunoAdicionado, this.alunoContrato);

        this.listaAlunosContrato.push(alunoAdicionado);
        this.limpar();
        this.openFormCadastro = !this.openFormCadastro;
        this.toastService.showSucesso("Contrato adicionado com sucesso");
    }

    alterar() {
        if (this.isContratoJaAdicionado()) {
            this.toastService.showAlerta("Contrato já adicionado");
            return;
        }
        if (!this.validarDatas()) return;

        const contratoAdicionado = this.listaAlunosContrato.find(
            (u: AlunoContrato) =>
                u.contrato.id === this.alunoContrato.contrato.id
        );

        contratoAdicionado.contrato = this.alunoContrato.contrato;
        contratoAdicionado.dataInicio = this.dataUtilService.getDataTruncata(this.alunoContrato.dataInicio);
        contratoAdicionado.dataFim = this.dataUtilService.getDataTruncata(this.alunoContrato.dataFim);
        contratoAdicionado.valor = this.alunoContrato.valor;

        this.limpar();
        this.openFormCadastro = false;
        this.toastService.showSucesso("Aluno alterado com sucesso");
    }

    deletar(alunoContrato: AlunoContrato): void {
        const index = this.listaAlunosContrato.indexOf(
            this.listaAlunosContrato.find((p) => p === alunoContrato)
        );
        if (index >= 0) {
            this.listaAlunosContrato.splice(index, 1);
            this.carregarLista();
        }
    }

    irNovo() {
        this.openFormCadastro = !this.openFormCadastro;
        this.limpar();
    }

    irAtualizar(alunoContrato: AlunoContrato) {
        this.alunoContratoAtualizando = alunoContrato;
        this.alunoContrato = alunoContrato;
        this.openFormCadastro = true;
        this.isAtualizarAluno = true;
        this.alunoContrato.contrato = this.contratoComboCadastro.find(
            (p) => p.id === alunoContrato.contrato.id
        );

        this.alunoContrato.dataInicio = this.dataUtilService.getDataTruncata(alunoContrato.dataInicio);
        this.alunoContrato.dataFim = this.dataUtilService.getDataTruncata(alunoContrato.dataFim);
    }

    carregarLista() {
        if (
            !this.listaAlunosContrato ||
            this.listaAlunosContrato.length === 0
        ) {
            this.mostrarTabela = false;
            this.msg = "Nenhum aluno adicionado.";
        } else {
            this.dataSource.data = this.listaAlunosContrato
                ? this.listaAlunosContrato
                : [];
            this.mostrarTabela = true;
        }
    }

    onMascaraDataInput(event) {
        return this.dataUtilService.onMascaraDataInput(event);
    }

    onValorChangeAluno(registro: any) {
        this.alunoContrato.contrato = registro;
    }

}
