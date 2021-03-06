import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Empresa } from 'src/app/core/empresa';
import { BaseService } from '../base/base.service';
import { Rotas } from 'src/app/core/rotas';



@Injectable({
  providedIn: 'root'
})
export class EmpresaService extends BaseService<Empresa> {

  constructor(http: HttpClient) {
    super(http, Rotas.EMPRESAS);
  }

  getAllPorTipo(tipo:string) {
    return this.http.get(`${this.rota}tipoempresa/${tipo}`);
  }

  getAllCombo() {
    return this.http.get(`${Rotas.EMPRESAS}combo/`);
  }
  
  getAllByCombo() {
    return this.http.get(`${Rotas.EMPRESAS}dados/combo/`);
  }



}
