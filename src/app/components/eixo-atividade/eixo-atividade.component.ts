import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { Acesso } from "src/app/core/acesso";
import { CarregarPerfil } from "src/app/core/carregar-perfil";
import { EixoAtividade } from "src/app/core/eixo-atividade";
import { EixoAtividadeService } from "src/app/services/eixo-atividade/eixo-atividade.service";
import { ConfirmDialogComponent } from "../common/confirm-dialog/confirm-dialog.component";

@Component({
  selector: "eixo-atividade",
  templateUrl: "./eixo-atividade.component.html",
  styleUrls: ["./eixo-atividade.component.css"],
})
export class EixoAtividadeComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  nomeFiltro: string = null;
  descricaoFiltro: string = null;
  eixoAtividade = new EixoAtividade();
  msg: string;

  mostrarTabela = false;

  displayedColumns: string[] = ["nome", "descricao", "acoes"];
  dataSource: MatTableDataSource<EixoAtividade> = new MatTableDataSource();

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil = new CarregarPerfil();

  constructor(
    private eixoAtividadeService: EixoAtividadeService,
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
      this.eixoAtividadeService
        .getFilter(this.nomeFiltro, this.descricaoFiltro)
        .subscribe((listaEixoAtividades: EixoAtividade[]) => {
          if (!listaEixoAtividades) {
            this.mostrarTabela = false;
            this.msg = "Nenhum registro para a pesquisa selecionada";
          } else {
            this.dataSource.data = listaEixoAtividades;
            this.mostrarTabela = true;
          }
        });
    } else {
      this.getAll();
    }
  }

  atualizar(eixoAtividade: EixoAtividade) {
    this.router.navigate(["/eixoatividade/cadastrar"], {
      queryParams: { id: eixoAtividade.id },
    });
  }

  deletar(eixoAtividade: EixoAtividade) {
    this.chamaCaixaDialogo(eixoAtividade);
  }

  chamaCaixaDialogo(eixoAtividade: EixoAtividade) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: `Certeza que deseja excluir?`,
      textoConfirma: "SIM",
      textoCancela: "NÃO",
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((confirma) => {
      if (confirma) {
        this.eixoAtividadeService.excluir(eixoAtividade.id).subscribe(() => {
          this.eixoAtividade.id = null;
          this.consultar();
        });
      } else {
        dialogRef.close();
      }
    });
  }

  getAll() {
    this.eixoAtividadeService
      .getAll()
      .subscribe((listaEixoAtividades: EixoAtividade[]) => {
        this.dataSource.data = listaEixoAtividades ? listaEixoAtividades : [];
        this.verificaMostrarTabela(listaEixoAtividades);
      });
  }

  verificaMostrarTabela(listaEixoAtividades: EixoAtividade[]) {
    if (!listaEixoAtividades || listaEixoAtividades.length == 0) {
      this.mostrarTabela = false;
      this.msg = "Nenhum cadastro.";
    } else {
      this.mostrarTabela = true;
    }
  }
}
