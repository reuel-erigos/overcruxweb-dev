import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EncaminhamentoAluno } from 'src/app/core/encaminhamento-aluno';
import { Acesso } from 'src/app/core/acesso';
import { EntidadesSociais } from 'src/app/core/entidades-sociais';
import { ControlContainer, NgForm } from '@angular/forms';
import * as _ from 'lodash';
import { BeneficioSocialPessoaFisica } from 'src/app/core/beneficio-social-pessoa-fisica';
import { BeneficioSocial } from 'src/app/core/beneficio-social';

@Component({
  selector: 'beneficio-social-pessoa-fisica',
  templateUrl: './beneficio-social-pessoa-fisica.component.html',
  styleUrls: ['./beneficio-social-pessoa-fisica.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class BeneficioSocialPessoaFisicaComponent implements OnInit {

  @Input() beneficiosSociaisPessoaFisica: BeneficioSocialPessoaFisica[];
  @Input() beneficio: BeneficioSocialPessoaFisica;
  @Input() index: number;
  @Input() perfilAcesso: Acesso;
  @Input() beneficiosSociais: BeneficioSocial[];
  @Output() calcularValor = new EventEmitter();

  pinBeneficioSocial  = Date.now();
  pinValor            = Date.now();
  pinDataInicio       = Date.now();
  pinDataFim          = Date.now();

  constructor(private dataUtilService: DataUtilService) { }

  ngOnInit(): void {
  }

  deletar() {
    this.beneficiosSociaisPessoaFisica.splice(this.index, 1);
    this.calcularValorRenda();
  }


  carregarDadosBenficioSocial(){
    if (this.beneficio.beneficioSocial.id) {
      this.beneficio.beneficioSocial = _.cloneDeep(_.find(this.beneficiosSociais,  (f: BeneficioSocial) => f.id === this.beneficio.beneficioSocial.id));
    }
  }
  
  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }

  calcularValorRenda() {
    this.calcularValor.emit();
  }
}
