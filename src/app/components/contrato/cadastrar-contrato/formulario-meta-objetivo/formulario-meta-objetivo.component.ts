import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Acesso} from 'src/app/core/acesso';
import {ControlContainer, NgForm} from '@angular/forms';
import {ToastService} from 'src/app/services/toast/toast.service';
import {MetaObjetivo} from "../../../../core/metaObjetivo";
import {IndicadorMeta} from "../../../../core/indicadorMeta";

@Component({
    selector: 'formulario-meta-objetivo',
    templateUrl: './formulario-meta-objetivo.component.html',
    styleUrls: ['./formulario-meta-objetivo.component.css'],
    viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class FormularioMetaObjetivoComponent implements OnInit {

    @Input() metasObjetivo: MetaObjetivo[];
    @Input() metaObjetivo: MetaObjetivo;
    @Input() index: number;
    @Input() perfilAcesso: Acesso;


    pinCodigo = Math.random();
    pinDescricao = Math.random();

    constructor(private drc: ChangeDetectorRef,
                private toastService: ToastService,) {
    }

    ngOnInit(): void {
    }

    ngAfterContentChecked(): void {
        this.drc.detectChanges();

    }

    deletar() {
        this.metasObjetivo.splice(this.index, 1);
        this.toastService.showSucesso("Meta removida com sucesso.")
    }

    addIndicadorMeta() {
        if (!this.metaObjetivo.indicadoresMeta) {
            this.metaObjetivo.indicadoresMeta = [];
        }

        const indicadorMeta: IndicadorMeta = new IndicadorMeta();
        indicadorMeta.id = undefined;
        indicadorMeta.codigo = "";
        indicadorMeta.descricao = "";
        this.metaObjetivo.indicadoresMeta.push(indicadorMeta);

    }

}
