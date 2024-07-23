import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";

import {ActivatedRoute, Router} from "@angular/router";
import {Acesso} from "src/app/core/acesso";
import {CarregarPerfil} from "src/app/core/carregar-perfil";
import {Empresa} from "src/app/core/empresa";
import {Programa} from "src/app/core/programa";
import {Projeto} from "src/app/core/projeto";
import {ContratoService} from "src/app/services/contrato/contrato.service";
import {ConfirmDialogComponent} from "../common/confirm-dialog/confirm-dialog.component";
import {Contrato} from "./../../core/contrato";
import {DataUtilService} from "../../services/commons/data-util.service";

@Component({
    selector: "app-contrato",
    templateUrl: "./contrato.component.html",
    styleUrls: ["./contrato.component.css"],
})
export class ContratoComponent implements OnInit {
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    empresaSelecionada: Empresa = new Empresa();
    programaSelecionado: Programa = new Programa();
    projetoSelecionado: Projeto = new Projeto();
    dataInicioVigencia: Date;
    dataFimVigencia: Date;
    numeroContrato: string;
    valorContrato: string;

    contrato: Contrato = new Contrato();

    msg: string;
    mostrarTabela = false;

    displayedColumns: string[] = [
        "numeroContrato",
        "tipoContrato",
        "empresa",
        "dataInicio",
        "dataFim",
        "numeroProcesso",
        "valor",
        "acoes",
    ];
    dataSource: MatTableDataSource<Contrato> = new MatTableDataSource();

    perfilAcesso: Acesso = new Acesso();
    carregarPerfil: CarregarPerfil = new CarregarPerfil();

    constructor(
        private contratoService: ContratoService,
        private router: Router,
        private dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private dataUtilService: DataUtilService
    ) {
    }

    ngOnInit() {
        this.carregarPerfil.carregar(
            this.activatedRoute.snapshot.data.perfilAcesso,
            this.perfilAcesso
        );

        this.dataSource.paginator = this.paginator;
        this.getAll();
    }

    limpar() {
        this.mostrarTabela = false;
        this.dataSource.data = [];
        this.empresaSelecionada = new Empresa();
        this.programaSelecionado = new Programa();
        this.projetoSelecionado = new Projeto();
        this.dataInicioVigencia = null;
        this.dataFimVigencia = null;
        this.numeroContrato = null;
        this.valorContrato = null;
    }

    consultar() {
        if (
            this.empresaSelecionada ||
            this.programaSelecionado ||
            this.projetoSelecionado ||
            this.dataInicioVigencia ||
            this.dataFimVigencia ||
            this.numeroContrato ||
            this.valorContrato
        ) {
            this.contratoService
                .getFilter(
                    this.empresaSelecionada?.id,
                    this.programaSelecionado?.id,
                    this.projetoSelecionado?.id,
                    this.dataInicioVigencia?.getTime(),
                    this.dataFimVigencia?.getTime(),
                    this.numeroContrato,
                    this.valorContrato
                )
                .subscribe((listaContratos: Contrato[]) => {
                    if (!listaContratos) {
                        this.mostrarTabela = false;
                        this.msg = "Nenhum registro para a pesquisa selecionada";
                    } else {
                        this.dataSource.data = listaContratos ? listaContratos : [];
                        this.mostrarTabela = true;
                    }
                });
        } else {
            this.getAll();
        }
    }

    atualizar(contrato: Contrato) {
        this.router.navigate(["/contrato/cadastrar"], {
            queryParams: {idContrato: contrato.id},
        });
    }

    deletar(contrato: Contrato) {
        this.chamaCaixaDialogo(contrato);
    }

    chamaCaixaDialogo(contrato: Contrato) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            pergunta: `Certeza que deseja excluir o contrato ${contrato.numeroContrato}?`,
            textoConfirma: "SIM",
            textoCancela: "NÃO",
        };

        const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((confirma) => {
            if (confirma) {
                this.contratoService.excluir(contrato.id).subscribe(() => {
                    this.contrato.id = null;
                    this.consultar();
                });
            } else {
                dialogRef.close();
            }
        });
    }

    getAll() {
        this.contratoService.getAll().subscribe((listaContrato: Contrato[]) => {
            this.dataSource.data = listaContrato ? listaContrato : [];
            this.verificaMostrarTabela(listaContrato);
        });
    }

    verificaMostrarTabela(listaContrato: Contrato[]) {
        if (!listaContrato || listaContrato.length == 0) {
            this.mostrarTabela = false;
            this.msg = "Nenhum contrato cadastrado.";
        } else {
            this.mostrarTabela = true;
        }
    }

    onMascaraDataInput(event) {
        return this.dataUtilService.onMascaraDataInput(event);
    }

    onValorChangeEmpresa(registro: any) {
        this.empresaSelecionada = registro;
    }

    onValorChangePrograma(registro: any) {
        this.programaSelecionado = registro;
    }

    onValorChangeProjeto(registro: any) {
        this.projetoSelecionado = registro;
    }

}
