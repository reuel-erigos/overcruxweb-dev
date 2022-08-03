import { PessoaFisica } from 'src/app/core/pessoa-fisica';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EnderecoService } from 'src/app/services/endereco/endereco.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { of } from 'rxjs';
import { ControlContainer, NgForm } from '@angular/forms';

@Component({
  selector: 'cadastro-endereco',
  templateUrl: './cadastro-endereco.component.html',
  styleUrls: ['./cadastro-endereco.component.css'],
  viewProviders:  [{ provide:  ControlContainer, useExisting:  NgForm }]
})
export class CadastroEnderecoComponent implements OnInit {

  ufs: any[] = [
    {nome: 'DF'}
  ];

  @Input() dadosEndereco;
  @Input() obrigatorio = true;
  @Output() copiarEndereco = new EventEmitter();

  public maskCep = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];

  constructor(private enderecoService: EnderecoService,
              private toastService: ToastService) { }

  ngOnInit() {
    this.enderecoService.getAllEstados().subscribe((ufs: any) => {
      this.ufs = ufs;
    });
  }

  validaCep(cep) {
    const regex = /^\d{2}((?!000000).)*$/;
    return regex.test(cep);
  }

  enderecoBuilder(endereco) {
    if (endereco && endereco.sucesso) {
      this.dadosEndereco.uf       = endereco.uf;
      this.dadosEndereco.cidade   = endereco.localidade + ' ' + endereco.complemento;
      this.dadosEndereco.bairro   = endereco.bairro;
      this.dadosEndereco.endereco = endereco.logradouro;
    } else {
      this.dadosEndereco.uf       = null;
      this.dadosEndereco.cidade   = null;
      this.dadosEndereco.bairro   = null;
      this.dadosEndereco.endereco = null;
      this.toastService.showAlerta('Cep inexistente ou endereço não encontrado.');
    }
  }

  onChangeCep() {
    if (this.dadosEndereco.cep && this.validaCep(this.dadosEndereco.cep)) {
      this.enderecoService.getEnderecoPorCep(this.dadosEndereco.cep).subscribe(
          (dados) => {
            this.enderecoBuilder(dados);
          },
          (err) => {
            this.enderecoBuilder(null);
            this.toastService.showAlerta('Ocorreu um erro ao buscar o endereço.');
          }
        );
    }
  }

  copiarEnderecoBeneficiario() {
    this.copiarEndereco.emit();
  }


}
