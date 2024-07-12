import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, forwardRef } from '@angular/core';
import { Acesso } from 'src/app/core/acesso';
import { ControlContainer, NgForm, FormControl, NgModelGroup } from '@angular/forms';
import { ToastService } from 'src/app/services/toast/toast.service';
import * as _ from 'lodash';
import { Acoes } from 'src/app/core/acoes';
import { DataUtilService } from 'src/app/services/commons/data-util.service';

@Component({
  selector: 'formulario-acao',
  templateUrl: './formulario-acao.component.html',
  styleUrls: ['./formulario-acao.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm },
                  { provide: ControlContainer, useExisting: forwardRef(() => NgModelGroup) }]
})
export class FormularioAcaoComponent implements OnInit {

  @Input() index: number;
  @Input() acoes: Acoes[];
  @Input() acao: Acoes;
  @Input() perfilAcesso: Acesso;
  @Input() camposDesabilitados: boolean;

  pinDataPrevisaoInicio    = Date.now();
  pinLocalExecucao         = Date.now();
  pinDescricao             = Date.now();
  
  local_execucao: any[] = [
    {tipo: 'Interna', flag: 'I'},
    {tipo: 'Externa', flag: 'E'}
  ];

  
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

  deletarAcao() {
    this.acoes.splice(this.index, 1);
  }

}
