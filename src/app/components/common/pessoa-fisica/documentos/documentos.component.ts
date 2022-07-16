import { PessoaFisica } from 'src/app/core/pessoa-fisica';
import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { EnderecoService } from 'src/app/services/endereco/endereco.service';
import { DataUtilService } from 'src/app/services/commons/data-util.service';

@Component({
  selector: 'documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class DocumentosComponent implements OnInit {

  @Input() pessoaFisica: PessoaFisica;
  @Input() validaCPF: boolean = true;
  @Input() apresentaCPF: boolean = true;

  public mascaraCpf = [];
  public mascaraNIS = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, '-', /\d/];
    
  ufs: any[] = [
    {nome: 'DF'}
  ]

  constructor(
    private enderecoService:EnderecoService,
    private dataUtilService: DataUtilService
  ) {
   }

  ngOnInit() {
    this.enderecoService.getAllEstados().subscribe((ufs:any)=> {
      this.ufs = ufs;
    });

    //if(this.validaCPF) {
      this.adicionarMascara();
    //}
  }


  adicionarMascara() {
    this.mascaraCpf = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/,];
  }

  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }
  
}
