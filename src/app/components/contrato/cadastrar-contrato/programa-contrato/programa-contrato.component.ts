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
import { Programa } from "src/app/core/programa";
import { ProgramaContrato } from "src/app/core/programaContrato";
import { DataUtilService } from "src/app/services/commons/data-util.service";
import { ProgramaService } from "src/app/services/programa/programa.service";
import { ToastService } from "src/app/services/toast/toast.service";

@Component({
  selector: "programa-contrato",
  templateUrl: "./programa-contrato.component.html",
  styleUrls: ["./programa-contrato.component.css"],
})
export class ProgramaContratoComponent implements OnInit {
  @Input() listaProgramasContrato: ProgramaContrato[];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  mostrarTabela = false;
  msg: string;

  displayedColumns: string[] = [
    "programa",
    "dataInicio",
    "dataFim",
    "valorPrograma",
    "acoes",
  ];
  dataSource: MatTableDataSource<ProgramaContrato> = new MatTableDataSource();

  openFormCadastro = false;

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil;

  isAtualizar = false;
  isAtualizarPrograma = false;

  programasComboCadastro: Programa[];
  programaContrato: ProgramaContrato = new ProgramaContrato();
  programaContratoAtualizando: ProgramaContrato = new ProgramaContrato();

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private programaService: ProgramaService,
    private dataUtilService: DataUtilService
  ) {
    this.carregarPerfil = new CarregarPerfil();
  }

  ngOnInit() {
    this.carregarPerfil.carregar(
      this.activatedRoute.snapshot.data.perfilAcesso,
      this.perfilAcesso
    );

    this.programaService.getAll().subscribe((programas: Programa[]) => {
      this.programasComboCadastro = programas;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes["listaProgramasContrato"] &&
      !_.isEmpty(changes["listaProgramasContrato"].currentValue)
    ) {
      this.carregarLista();
    }
  }

  limpar() {
    this.programaContrato = new ProgramaContrato();
  }

  isProgramaJaAdicionado(): boolean {
    const programaAdicionado = this.listaProgramasContrato.find(
      (p: ProgramaContrato) =>
        p.programa.id === this.programaContrato.programa.id &&
        this.programaContratoAtualizando !== p
    );

    return !!programaAdicionado;
  }

  validarDatas(): boolean {
    const dataInicio = this.dataUtilService.getDataTruncata(
      this.programaContrato.dataInicioProgramaContrato
    );
    const dataFim = this.dataUtilService.getDataTruncata(
      this.programaContrato.dataFimProgramaContrato
    );
    
    if (dataFim) {
      if (dataInicio && dataInicio.getTime() > dataFim.getTime()) {
        this.toastService.showAlerta(
          "A data de início informada não pode ser maior que a data de fim do programa."
        );
        return false;
      }
    }
    return true;
  }

  adicionar() {
    if (this.isProgramaJaAdicionado()) {
      this.toastService.showAlerta("Programa já adicionado");
      return;
    }
    if(!this.validarDatas()) return;

    const programaAdicionado = new ProgramaContrato();
    Object.assign(programaAdicionado, this.programaContrato);

    this.listaProgramasContrato.push(programaAdicionado);
    this.limpar();
    this.openFormCadastro = !this.openFormCadastro;
    this.toastService.showSucesso("Programa adicionado com sucesso");
  }

  alterar() {
    if (this.isProgramaJaAdicionado()) {
      this.toastService.showAlerta("Programa já adicionado");
      return;
    }
    if(!this.validarDatas()) return;
    
    const programaAdicionado = this.listaProgramasContrato.find(
      (u: ProgramaContrato) =>
        u.programa.id === this.programaContrato.programa.id
    );

    programaAdicionado.dataInicioProgramaContrato =
      this.programaContrato.dataInicioProgramaContrato;
    programaAdicionado.dataFimProgramaContrato =
      this.programaContrato.dataFimProgramaContrato;
    programaAdicionado.valorProgramaContrato =
      this.programaContrato.valorProgramaContrato;

    this.limpar();
    this.openFormCadastro = !this.openFormCadastro;
    this.toastService.showSucesso("Programa alterado com sucesso");
  }

  deletar(programaContrato: ProgramaContrato): void {
    const index = this.listaProgramasContrato.indexOf(
      this.listaProgramasContrato.find((p) => p === programaContrato)
    );
    if (index >= 0) {
      this.listaProgramasContrato.splice(index, 1);
      this.carregarLista();
    }
  }

  irNovo() {
    this.openFormCadastro = !this.openFormCadastro;
    this.limpar();
    this.isAtualizarPrograma = false;
    this.programaContratoAtualizando = null;
  }

  irAtualizar(programaContrato: ProgramaContrato) {
    this.programaContratoAtualizando = programaContrato;
    this.programaContrato = programaContrato;
    this.openFormCadastro = true;
    this.isAtualizarPrograma = true;
    this.programaContrato.programa = this.programasComboCadastro.find(
      (p) => p.id === programaContrato.programa.id
    );
  }

  carregarLista() {
    if (
      !this.listaProgramasContrato ||
      this.listaProgramasContrato.length === 0
    ) {
      this.mostrarTabela = false;
      this.msg = "Nenhum programa adicionado.";
    } else {
      this.dataSource.data = this.listaProgramasContrato
        ? this.listaProgramasContrato
        : [];
      this.mostrarTabela = true;
    }
  }
}
