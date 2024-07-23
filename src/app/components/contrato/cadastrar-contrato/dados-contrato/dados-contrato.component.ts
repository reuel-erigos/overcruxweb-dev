import {Component, Input, OnInit} from "@angular/core";
import {ControlContainer, NgForm} from "@angular/forms";
import {Contrato} from "src/app/core/contrato";
import {Empresa} from "src/app/core/empresa";
import {TipoContrato} from "src/app/core/tipo-contrato";
import {TipoContratoService} from "src/app/services/tipo-contrato/tipo-contrato.service";
import {DataUtilService} from "../../../../services/commons/data-util.service";
import * as _ from "lodash";

@Component({
    selector: "dados-contrato",
    templateUrl: "./dados-contrato.component.html",
    styleUrls: ["./dados-contrato.component.css"],
    viewProviders: [{provide: ControlContainer, useExisting: NgForm}],
})
export class DadosContratoComponent implements OnInit {
    @Input() contrato: Contrato = new Contrato();

    listaTiposContrato: TipoContrato[];

    constructor(
        private tipoContratoService: TipoContratoService,
        private dataUtilService: DataUtilService
    ) {
    }

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
    }

    inicializarObjetos() {
        this.contrato.tipoContrato = new TipoContrato();
        this.contrato.empresa = new Empresa();
    }

    onMascaraDataInput(event) {
        return this.dataUtilService.onMascaraDataInput(event);
    }

    onValorChangeEmpresa(registro: any) {
        this.contrato.empresa = registro;
    }

    onValorChangeTipoContrato(registro: any) {
        this.contrato.tipoContrato = registro;
    }

}
