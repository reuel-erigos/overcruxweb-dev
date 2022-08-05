import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { Rotas } from 'src/app/core/rotas';
import { Escola } from '../../core/escola';
import { SerieEscolar } from '../../core/serie-escolar';

@Injectable({
  providedIn: 'root'
})
export class SerieEscolarService extends BaseService<SerieEscolar> {

  constructor(http: HttpClient) {
    super(http, Rotas.SERIE_ESCOLAR);
  }

}
