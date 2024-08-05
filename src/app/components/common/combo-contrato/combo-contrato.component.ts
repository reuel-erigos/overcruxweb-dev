import {Component, EventEmitter, forwardRef, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {ControlContainer, NgForm, NgModelGroup} from '@angular/forms';
import * as _ from 'lodash';
import {ContratoService} from "../../../services/contrato/contrato.service";
import {ComboContrato} from "../../../core/combo-contrato";


@Component({
    selector: 'combo-contrato',
    templateUrl: './combo-contrato.component.html',
    styleUrls: ['./combo-contrato.component.css'],
    viewProviders: [{provide: ControlContainer, useExisting: NgForm},
        {provide: ControlContainer, useExisting: forwardRef(() => NgModelGroup)}],
})
export class ComboContratoComponent implements OnInit {

    @ViewChild('comboContrato', {static: false}) comboContrato;

    @Input() showDisplayId;
    @Input() obrigatorio;
    @Input() selecionado;
    @Input() desabilitado;

    @Output() valorChange = new EventEmitter();

    dados = [];
    data: any = {};

    constructor(private contratoService: ContratoService) {
    }

    ngOnInit(): void {
        this.data = Date.now();

        setTimeout(() => {
            this.contratoService.getAllCombo().subscribe((contratos: ComboContrato[]) => {
                this.dados = contratos;
                this.preencherCombo();

                this.dados.forEach(a => a.numeroContrato = a.numeroContrato);
                this.dados.sort((a, b) => {
                    if (a.numeroContrato > b.numeroContrato) {
                        return 1;
                    }
                    if (a.numeroContrato < b.numeroContrato) {
                        return -1;
                    }
                    return 0;
                });
            });
        }, 0)

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["selecionado"] && this.selecionado && this.selecionado.id) {
            this.preencherCombo();
        }
    }

    private preencherCombo() {
        if (this.selecionado && this.selecionado.id && this.dados.length) {
            this.selecionado = _.find(this.dados, {id: this.selecionado.id});
        }
    }

    onValorChange(registro: any) {
        this.valorChange.emit(registro);
        this.preencherCombo();
    }


}
