import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";
import { Contrato } from "src/app/core/contrato";
import { Empresa } from "src/app/core/empresa";
import { TipoContrato } from "src/app/core/tipo-contrato";
import { EmpresaService } from "src/app/services/empresa/empresa.service";
import { TipoContratoService } from "src/app/services/tipo-contrato/tipo-contrato.service";

@Component({
  selector: "dados-contrato",
  templateUrl: "./dados-contrato.component.html",
  styleUrls: ["./dados-contrato.component.css"],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class DadosContratoComponent implements OnInit {
  @Input() contrato: Contrato = new Contrato();

  listaTiposContrato: TipoContrato[];
  listaEmpresas: Empresa[];

  constructor(
    private tipoContratoService: TipoContratoService,
    private empresaService: EmpresaService
  ) {}

  ngOnInit() {
    this.inicializarObjetos();

    this.tipoContratoService
      .getAll()
      .subscribe((listaTiposContrato: TipoContrato[]) => {
        this.listaTiposContrato = listaTiposContrato;
        this.contrato.tipoContrato = this.listaTiposContrato.find(
          (tipoContrato) => tipoContrato.id == this.contrato.tipoContrato.id
        );
      });

    this.empresaService.getAll().subscribe((listaEmpresas: Empresa[]) => {
      this.listaEmpresas = listaEmpresas;
      this.contrato.empresa = this.listaEmpresas.find(
        (empresa) => empresa.id == this.contrato.empresa.id
      );
    });
  }

  inicializarObjetos() {
    this.contrato.tipoContrato = new TipoContrato();
    this.contrato.empresa = new Empresa();
  }
}
