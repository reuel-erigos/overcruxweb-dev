import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { Acesso } from "src/app/core/acesso";
import { CarregarPerfil } from "src/app/core/carregar-perfil";
import { PeriodoAtividade } from "src/app/core/periodo-atividade";
import { PeriodoAtividadeService } from "src/app/services/periodo-atividade/periodo-atividade.service";
import { ConfirmDialogComponent } from "../common/confirm-dialog/confirm-dialog.component";

@Component({
  selector: "periodo-atividade",
  templateUrl: "./periodo-atividade.component.html",
  styleUrls: ["./periodo-atividade.component.css"],
})
export class PeriodoAtividadeComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  nomeFiltro: string = null;
  descricaoFiltro: string = null;
  periodoAtividade = new PeriodoAtividade();
  msg: string;

  mostrarTabela = false;

  displayedColumns: string[] = ["nome", "descricao", "acoes"];
  dataSource: MatTableDataSource<PeriodoAtividade> = new MatTableDataSource();

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil = new CarregarPerfil();

  constructor(
    private periodoAtividadeService: PeriodoAtividadeService,
    private router: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {}

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
    if (this.nomeFiltro || this.descricaoFiltro) {
      this.periodoAtividadeService
        .getFilter(this.nomeFiltro, this.descricaoFiltro)
        .subscribe((listaPeriodoAtividades: PeriodoAtividade[]) => {
          if (!listaPeriodoAtividades) {
            this.mostrarTabela = false;
            this.msg = "Nenhum registro para a pesquisa selecionada";
          } else {
            this.dataSource.data = listaPeriodoAtividades;
            this.mostrarTabela = true;
          }
        });
    } else {
      this.getAll();
    }
  }

  atualizar(periodoAtividade: PeriodoAtividade) {
    this.router.navigate(["/periodoatividade/cadastrar"], {
      queryParams: { id: periodoAtividade.id },
    });
  }

  deletar(periodoAtividade: PeriodoAtividade) {
    this.chamaCaixaDialogo(periodoAtividade);
  }

  chamaCaixaDialogo(periodoAtividade: PeriodoAtividade) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: `Certeza que deseja excluir?`,
      textoConfirma: "SIM",
      textoCancela: "NÃO",
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((confirma) => {
      if (confirma) {
        this.periodoAtividadeService.excluir(periodoAtividade.id).subscribe(() => {
          this.periodoAtividade.id = null;
          this.consultar();
        });
      } else {
        dialogRef.close();
      }
    });
  }

  getAll() {
    this.periodoAtividadeService
      .getAll()
      .subscribe((listaPeriodoAtividades: PeriodoAtividade[]) => {
        this.dataSource.data = listaPeriodoAtividades ? listaPeriodoAtividades : [];
        this.verificaMostrarTabela(listaPeriodoAtividades);
      });
  }

  verificaMostrarTabela(listaPeriodoAtividades: PeriodoAtividade[]) {
    if (!listaPeriodoAtividades || listaPeriodoAtividades.length == 0) {
      this.mostrarTabela = false;
      this.msg = "Nenhum cadastro.";
    } else {
      this.mostrarTabela = true;
    }
  }
}
