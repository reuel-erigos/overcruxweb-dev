import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {ActivatedRoute, Router} from "@angular/router";
import {Acesso} from "src/app/core/acesso";
import {CarregarPerfil} from "src/app/core/carregar-perfil";
import {Percurso} from "src/app/core/percurso";
import {ConfirmDialogComponent} from "../common/confirm-dialog/confirm-dialog.component";
import {PercursoService} from "../../services/percurso/percurso.service";

@Component({
    selector: "percurso",
    templateUrl: "./percurso.component.html",
    styleUrls: ["./percurso.component.css"],
})
export class PercursoComponent implements OnInit {
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    listaPercurso: Percurso[];
    nomeFiltro: string = null;
    descricaoFiltro: string = null;
    msg: string;

    mostrarTabela = false;

    displayedColumns: string[] = ["nome", "descricao", "acoes"];
    dataSource: MatTableDataSource<Percurso> = new MatTableDataSource();

    perfilAcesso: Acesso = new Acesso();
    carregarPerfil: CarregarPerfil = new CarregarPerfil();

    constructor(
        private percursoService: PercursoService,
        private router: Router,
        private dialog: MatDialog,
        private activatedRoute: ActivatedRoute
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
        this.nomeFiltro = null;
        this.descricaoFiltro = null;
        this.dataSource.data = [];
    }

    consultar() {
        if (this.nomeFiltro != null || this.descricaoFiltro != null) {
            this.percursoService
                .getByFilter(this.nomeFiltro, this.descricaoFiltro)
                .subscribe((percurso: Percurso[]) => {
                    if (!percurso) {
                        this.mostrarTabela = false;
                        this.msg = "Nenhum registro para a pesquisa selecionada";
                    } else {
                        this.dataSource.data = percurso;
                        this.mostrarTabela = true;
                    }
                });
        } else {
            this.getAll();
        }
    }

    atualizar(percurso: Percurso) {
        this.router.navigate(["/percurso/cadastrar"], {
            queryParams: {id: percurso.id},
        });
    }

    deletar(percurso: Percurso) {
        this.chamaCaixaDialogo(percurso);
    }

    chamaCaixaDialogo(percurso: Percurso) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            pergunta: `Certeza que deseja excluir?`,
            textoConfirma: "SIM",
            textoCancela: "NÃO",
        };

        const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((confirma) => {
            if (confirma) {
                this.percursoService.excluir(percurso.id).subscribe(() => {
                    this.nomeFiltro = null;
                    this.descricaoFiltro = null;
                    this.consultar();
                });
            } else {
                dialogRef.close();
            }
        });
    }

    getAll() {
        this.percursoService
            .getAll()
            .subscribe((listaPercurso: Percurso[]) => {
                this.listaPercurso = listaPercurso;
                this.dataSource.data = listaPercurso ? listaPercurso : [];
                this.verificaMostrarTabela(listaPercurso);
            });
    }

    verificaMostrarTabela(listaPercurso: Percurso[]) {
        if (!listaPercurso || listaPercurso.length == 0) {
            this.mostrarTabela = false;
            this.msg = "Nenhum cadastro.";
        } else {
            this.mostrarTabela = true;
        }
    }
}
