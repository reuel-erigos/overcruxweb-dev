import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, forwardRef } from '@angular/core';
import { Acesso } from 'src/app/core/acesso';
import { ControlContainer, NgForm, FormControl, NgModelGroup } from '@angular/forms';
import { ToastService } from 'src/app/services/toast/toast.service';
import * as _ from 'lodash';
import { Acoes } from 'src/app/core/acoes';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { GrupoAcoes } from 'src/app/core/grupo-acoes';

@Component({
  selector: 'formulario-analise',
  templateUrl: './formulario-analise.component.html',
  styleUrls: ['./formulario-analise.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm },
                  { provide: ControlContainer, useExisting: forwardRef(() => NgModelGroup) }]
})
export class FormularioAnaliseComponent implements OnInit {

  @Input() grupoAcao: GrupoAcoes;
  @Input() perfilAcesso: Acesso;
  @Input() perfilAcessoAnalise: Acesso;
  @Input() isAprovado: boolean;

  statusAnaliseCombo: any[] = [{id: 'A', descricao: 'Aprovado'}, {id: 'R', descricao: 'Reprovado'}];
  
  constructor(private drc: ChangeDetectorRef,
              private dataUtilService: DataUtilService,
              private toastService: ToastService,) { }

  ngOnInit(): void {
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }


}
