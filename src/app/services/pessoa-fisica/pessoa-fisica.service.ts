import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PessoaFisica } from 'src/app/core/pessoa-fisica';
import { BaseService } from '../base/base.service';
import { Rotas } from 'src/app/core/rotas';

@Injectable({
  providedIn: 'root'
})
export class PessoaFisicaService extends BaseService<PessoaFisica> {
  constructor(http: HttpClient) {
    super(http, Rotas.PESSOA_FISICA);
  }

  getAllPessoasByCombo() {
    return this.http.get(`${Rotas.PESSOA_FISICA}dados/combo`);
  }

  getAllColaboradoresFornecedores() {
    return this.http.get(`${Rotas.PESSOA_FISICA}fornecedor_colaborador`);
  }

  getByCpf(cpf: string) {
    const params = {'cpf': cpf};
    return this.http.get(`${Rotas.PESSOA_FISICA}cpf`, {params: params});
  }
}
