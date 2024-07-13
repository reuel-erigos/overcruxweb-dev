import { SituacoesExAlunosService } from "src/app/services/situacoes-ex-alunos/situacoes-ex-alunos.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router, ActivatedRoute } from "@angular/router";
import { Acesso } from "src/app/core/acesso";
import { ConfirmDialogComponent } from "../common/confirm-dialog/confirm-dialog.component";
import { TiposContratos } from "src/app/core/tipos-contratos";
import { TiposContratosService } from "src/app/services/tipos-contratos/tipos-contratos.service";
import { CarregarPerfil } from "src/app/core/carregar-perfil";

@Component({
  selector: "tipos-contratos",
  templateUrl: "./tipos-contratos.component.html",
  styleUrls: ["./tipos-contratos.component.css"],
})
export class TiposContratosComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  listaTiposContratos: TiposContratos[];
  tiposContratos: TiposContratos = new TiposContratos();
  msg: string;

  mostrarTabela = false;

  displayedColumns: string[] = ["descricao", "acoes"];
  dataSource: MatTableDataSource<TiposContratos> = new MatTableDataSource();

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil = new CarregarPerfil();

  constructor(
    private tiposContratosService: TiposContratosService,
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
    this.tiposContratos = new TiposContratos();
    this.dataSource.data = [];
  }

  consultar() {
    if (this.tiposContratos && this.tiposContratos.id) {
      this.tiposContratosService
        .getById(this.tiposContratos.id)
        .subscribe((tiposContratos: TiposContratos) => {
          if (!tiposContratos) {
            this.mostrarTabela = false;
            this.msg = "Nenhum registro para a pesquisa selecionada";
          } else {
            this.dataSource.data = [tiposContratos];
            this.mostrarTabela = true;
          }
        });
    } else {
      this.getAll();
    }
  }

  atualizar(tiposContratos: TiposContratos) {
    this.router.navigate(["/tiposcontratos/cadastrar"], {
      queryParams: { id: tiposContratos.id },
    });
  }

  deletar(tiposContratos: TiposContratos) {
    this.chamaCaixaDialogo(tiposContratos);
  }

  chamaCaixaDialogo(tiposContratos: TiposContratos) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: `Certeza que deseja excluir?`,
      textoConfirma: "SIM",
      textoCancela: "NÃO",
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((confirma) => {
      if (confirma) {
        this.tiposContratosService.excluir(tiposContratos.id).subscribe(() => {
          this.tiposContratos.id = null;
          this.consultar();
        });
      } else {
        dialogRef.close();
      }
    });
  }

  getAll() {
    this.tiposContratosService
      .getAll()
      .subscribe((listaSituacoesExAlunos: TiposContratos[]) => {
        this.listaTiposContratos = listaSituacoesExAlunos;
        this.dataSource.data = listaSituacoesExAlunos
          ? listaSituacoesExAlunos
          : [];
        this.verificaMostrarTabela(listaSituacoesExAlunos);
      });
  }
  verificaMostrarTabela(listaSituacoesExAlunos: TiposContratos[]) {
    if (!listaSituacoesExAlunos || listaSituacoesExAlunos.length == 0) {
      this.mostrarTabela = false;
      this.msg = "Nenhum cadastro.";
    } else {
      this.mostrarTabela = true;
    }
  }
}
