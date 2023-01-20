import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { RateiosMovimentacoes } from 'src/app/core/rateios-movimentacoes';
import { Acesso } from 'src/app/core/acesso';
import { Projeto } from 'src/app/core/projeto';
import { Programa } from 'src/app/core/programa';
import { ControlContainer, NgForm, FormControl } from '@angular/forms';
import { ToastService } from 'src/app/services/toast/toast.service';
import * as _ from 'lodash';
import { FilterMovimentacoes } from 'src/app/core/filter-movimentacoes';
import { ComboProjeto } from 'src/app/core/combo-projeto';
import { ComboPrograma } from 'src/app/core/combo-programa';
import { ProgramaService } from 'src/app/services/programa/programa.service';
import { ProjetoService } from 'src/app/services/projeto/projeto.service';

@Component({
  selector: 'formulario-rateio',
  templateUrl: './formulario-rateio.component.html',
  styleUrls: ['./formulario-rateio.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class FormularioRateioComponent implements OnInit {

  @ViewChild('campoPrograma', {static: false}) campoPrograma;
  @ViewChild('campoProjeto', {static: false}) campoProjeto;

  @Input() rateios: RateiosMovimentacoes[];
  @Input() index: number;
  @Input() rateio: RateiosMovimentacoes;
  @Input() perfilAcesso: Acesso;

  pinPrograma    = Date.now();
  pinProjeto     = Date.now();
  pinValor       = Date.now();
  pinCheckRateio = Date.now();

  toogle = new FormControl('', []);

  filtro: FilterMovimentacoes;
  
  constructor(private drc: ChangeDetectorRef,
              private programaService: ProgramaService,
              private projetoService: ProjetoService,
              private toastService: ToastService,) { }

  ngOnInit(): void {
    this.filtro = new FilterMovimentacoes();
    this.filtro.projeto = new ComboProjeto();
    this.filtro.programa = new ComboPrograma();

    if(!this.rateio.projeto) {
      this.rateio.projeto = new Projeto();
    }
    if(!this.rateio.programa) {
      this.rateio.programa = new Programa();
    }


    this.toogle.valueChanges.subscribe(newToogleValue=> {
      this.rateio.statusPercentual = newToogleValue;
    });
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();

    this.filtro.programa.id = this.rateio.programa.id;
    this.filtro.projeto.id  = this.rateio.projeto.id;
  }

  validarDuplicado() {
    if(this.rateio.projeto && this.rateio.projeto.id) {
      const jaExiste = this.rateios.find(m => m != this.rateio && m.projeto.id === this.rateio.projeto.id);
      if(jaExiste) {
        this.toastService.showAlerta('Esse projeto já está incluso na lista.');
        this.campoProjeto.comboProjeto.itensSelect.control.setValue(null);
        this.filtro.projeto = new ComboProjeto();
      } else {
        if(this.filtro.projeto.id && this.rateio.projeto.id !== this.filtro.projeto.id){
          this.projetoService.getById(this.rateio.projeto.id).subscribe((projeto: Projeto) => {
            this.rateio.projeto = projeto;  
          })
        }
      }
    }
  }

  deletarRateio() {
    this.rateios.splice(this.index, 1);
  }

  onCampoPorcentagem(rateio: RateiosMovimentacoes) {
    rateio.statusPercentual = !rateio.statusPercentual;

    if(rateio.statusPercentual) {
      rateio.placeHolderRateio = 'Porcentagem';
    } else {
      rateio.placeHolderRateio = 'Valor do rateio';
    }
  }

  onValorChangeProjeto(registro: any) {
    this.filtro.projeto = registro;
    
    if(registro) {
      this.rateio.projeto.id = registro.id;
      this.validarDuplicado();
    }else{
      this.rateio.projeto = new Projeto();
    }
  }
}
