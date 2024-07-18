import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

import { ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import { Acesso } from "src/app/core/acesso";
import { CarregarPerfil } from "src/app/core/carregar-perfil";
import { Projeto } from "src/app/core/projeto";
import { ProjetoContrato } from "src/app/core/projetoContrato";
import { DataUtilService } from "src/app/services/commons/data-util.service";
import { ProjetoService } from "src/app/services/projeto/projeto.service";
import { ToastService } from "src/app/services/toast/toast.service";

@Component({
  selector: "projeto-contrato",
  templateUrl: "./projeto-contrato.component.html",
  styleUrls: ["./projeto-contrato.component.css"],
})
export class ProjetoContratoComponent implements OnInit {
  @Input() listaProjetosContrato: ProjetoContrato[];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  mostrarTabela = false;
  msg: string;

  displayedColumns: string[] = [
    "projeto",
    "dataInicio",
    "dataFim",
    "valorProjeto",
    "acoes",
  ];
  dataSource: MatTableDataSource<ProjetoContrato> = new MatTableDataSource();

  openFormCadastro = false;

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil;

  isAtualizar = false;
  isAtualizarProjeto = false;

  projetosComboCadastro: Projeto[];
  projetoContrato: ProjetoContrato = new ProjetoContrato();
  projetoContratoAtualizando: ProjetoContrato = new ProjetoContrato();

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private projetoService: ProjetoService,
    private dataUtilService: DataUtilService
  ) {
    this.carregarPerfil = new CarregarPerfil();
  }

  ngOnInit() {
    this.carregarPerfil.carregar(
      this.activatedRoute.snapshot.data.perfilAcesso,
      this.perfilAcesso
    );

    this.projetoService.getAll().subscribe((projetos: Projeto[]) => {
      this.projetosComboCadastro = projetos;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes["listaProjetosContrato"] &&
      !_.isEmpty(changes["listaProjetosContrato"].currentValue)
    ) {
      this.carregarLista();
    }
  }

  limpar() {
    this.projetoContrato = new ProjetoContrato();
  }

  isProjetoJaAdicionado(): boolean {
    const projetoAdicionado = this.listaProjetosContrato.find(
      (p: ProjetoContrato) =>
        p.projeto.id === this.projetoContrato.projeto.id &&
        this.projetoContratoAtualizando !== p
    );

    return !!projetoAdicionado;
  }

  validarDatas(): boolean {
    const dataInicio = this.dataUtilService.getDataTruncata(
      this.projetoContrato.dataInicioProjetoContrato
    );
    const dataFim = this.dataUtilService.getDataTruncata(
      this.projetoContrato.dataFimProjetoContrato
    );
    
    if (dataFim) {
      if (dataInicio && dataInicio.getTime() > dataFim.getTime()) {
        this.toastService.showAlerta(
          "A data de início informada não pode ser maior que a data de fim do projeto."
        );
        return false;
      }
    }
    return true;
  }

  adicionar() {
    if (this.isProjetoJaAdicionado()) {
      this.toastService.showAlerta("Projeto já adicionado");
      return;
    }
    if(!this.validarDatas()) return;

    const projetoAdicionado = new ProjetoContrato();
    Object.assign(projetoAdicionado, this.projetoContrato);

    this.listaProjetosContrato.push(projetoAdicionado);
    this.limpar();
    this.openFormCadastro = !this.openFormCadastro;
    this.toastService.showSucesso("Projeto adicionado com sucesso");
  }

  alterar() {
    if (this.isProjetoJaAdicionado()) {
      this.toastService.showAlerta("Projeto já adicionado");
      return;
    }
    if(!this.validarDatas()) return;
    
    const projetoAdicionado = this.listaProjetosContrato.find(
      (u: ProjetoContrato) => u.projeto.id === this.projetoContrato.projeto.id
    );

    projetoAdicionado.dataInicioProjetoContrato =
      this.projetoContrato.dataInicioProjetoContrato;
    projetoAdicionado.dataFimProjetoContrato =
      this.projetoContrato.dataFimProjetoContrato;
    projetoAdicionado.valorProjetoContrato =
      this.projetoContrato.valorProjetoContrato;

    this.limpar();
    this.openFormCadastro = !this.openFormCadastro;
    this.toastService.showSucesso("Projeto alterado com sucesso");
  }

  deletar(projetoContrato: ProjetoContrato): void {
    const index = this.listaProjetosContrato.indexOf(
      this.listaProjetosContrato.find((p) => p === projetoContrato)
    );
    if (index >= 0) {
      this.listaProjetosContrato.splice(index, 1);
      this.carregarLista();
    }
  }

  irNovo() {
    this.openFormCadastro = !this.openFormCadastro;
    this.limpar();
    this.isAtualizarProjeto = false;
    this.projetoContratoAtualizando = null;
  }

  irAtualizar(projetoContrato: ProjetoContrato) {
    this.projetoContratoAtualizando = projetoContrato;
    this.projetoContrato = projetoContrato;
    this.openFormCadastro = true;
    this.isAtualizarProjeto = true;
    this.projetoContrato.projeto = this.projetosComboCadastro.find(
      (p) => p.id === projetoContrato.projeto.id
    );
  }

  carregarLista() {
    if (
      !this.listaProjetosContrato ||
      this.listaProjetosContrato.length === 0
    ) {
      this.mostrarTabela = false;
      this.msg = "Nenhum projeto adicionado.";
    } else {
      this.dataSource.data = this.listaProjetosContrato
        ? this.listaProjetosContrato
        : [];
      this.mostrarTabela = true;
    }
  }
}
