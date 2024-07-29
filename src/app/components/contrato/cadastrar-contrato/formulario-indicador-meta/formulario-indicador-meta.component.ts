import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Acesso} from 'src/app/core/acesso';
import {ControlContainer, NgForm} from '@angular/forms';
import {ToastService} from 'src/app/services/toast/toast.service';
import {IndicadorMeta} from "../../../../core/indicadorMeta";

@Component({
    selector: 'formulario-indicador-meta',
    templateUrl: './formulario-indicador-meta.component.html',
    styleUrls: ['./formulario-indicador-meta.component.css'],
    viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class FormularioIndicadorMetaComponent implements OnInit {

    @Input() indicadoresMeta: IndicadorMeta[];
    @Input() indicadorMeta: IndicadorMeta;
    @Input() index: number;
    @Input() perfilAcesso: Acesso;


    pinCodigo = Math.random();

    constructor(private drc: ChangeDetectorRef,
                private toastService: ToastService,) {
    }

    ngOnInit(): void {
    }

    ngAfterContentChecked(): void {
        this.drc.detectChanges();

    }

    deletar() {
        this.indicadoresMeta.splice(this.index, 1);
        this.toastService.showSucesso("Indicador removido com sucesso.")
    }

}
