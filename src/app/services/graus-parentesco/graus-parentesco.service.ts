import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { Rotas } from 'src/app/core/rotas';
import { HttpClient } from '@angular/common/http';
import { GrausParentesco } from '../../core/graus-parentesco';

@Injectable({
  providedIn: 'root'
})
export class GrausParentescoService extends BaseService<GrausParentesco> {

  constructor(http: HttpClient) {
    super(http, Rotas.GRAUS_PARENTESCO);
  }

}
