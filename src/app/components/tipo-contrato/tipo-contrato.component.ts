import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { Acesso } from "src/app/core/acesso";
import { CarregarPerfil } from "src/app/core/carregar-perfil";
import { TipoContrato } from "src/app/core/tipo-contrato";
import { TipoContratoService } from "src/app/services/tipo-contrato/tipo-contrato.service";
import { ConfirmDialogComponent } from "../common/confirm-dialog/confirm-dialog.component";

@Component({
  selector: "tipo-contrato",
  templateUrl: "./tipo-contrato.component.html",
  styleUrls: ["./tipo-contrato.component.css"],
})
export class TipoContratoComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  listaTipoContrato: TipoContrato[];
  descricaoFiltro: string = null;
  msg: string;

  mostrarTabela = false;

  displayedColumns: string[] = ["descricao", "acoes"];
  dataSource: MatTableDataSource<TipoContrato> = new MatTableDataSource();

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil = new CarregarPerfil();

  constructor(
    private tipoContratoService: TipoContratoService,
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
    this.descricaoFiltro = null;
    this.dataSource.data = [];
  }

  consultar() {
    if (this.descricaoFiltro != null) {
      this.tipoContratoService
        .getByDescricao(this.descricaoFiltro)
        .subscribe((tipoContrato: TipoContrato[]) => {
          if (!tipoContrato) {
            this.mostrarTabela = false;
            this.msg = "Nenhum registro para a pesquisa selecionada";
          } else {
            this.dataSource.data = tipoContrato;
            this.mostrarTabela = true;
          }
        });
    } else {
      this.getAll();
    }
  }

  atualizar(tipoContrato: TipoContrato) {
    this.router.navigate(["/tipocontrato/cadastrar"], {
      queryParams: { id: tipoContrato.id },
    });
  }

  deletar(tipoContrato: TipoContrato) {
    this.chamaCaixaDialogo(tipoContrato);
  }

  chamaCaixaDialogo(tipoContrato: TipoContrato) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: `Certeza que deseja excluir?`,
      textoConfirma: "SIM",
      textoCancela: "NÃO",
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((confirma) => {
      if (confirma) {
        this.tipoContratoService.excluir(tipoContrato.id).subscribe(() => {
          this.descricaoFiltro = null;
          this.consultar();
        });
      } else {
        dialogRef.close();
      }
    });
  }

  getAll() {
    this.tipoContratoService
      .getAll()
      .subscribe((listaTipoContrato: TipoContrato[]) => {
        this.listaTipoContrato = listaTipoContrato;
        this.dataSource.data = listaTipoContrato ? listaTipoContrato : [];
        this.verificaMostrarTabela(listaTipoContrato);
      });
  }
  verificaMostrarTabela(listaTipoContrato: TipoContrato[]) {
    if (!listaTipoContrato || listaTipoContrato.length == 0) {
      this.mostrarTabela = false;
      this.msg = "Nenhum cadastro.";
    } else {
      this.mostrarTabela = true;
    }
  }
}
