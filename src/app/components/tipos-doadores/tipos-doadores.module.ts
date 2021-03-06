import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialCommonModule } from 'src/app/material-modules/material-common.module';
import { DadosAlunoModule } from '../common/dados-aluno/dados-aluno.module';
import { ComboBeneficiarioModule } from '../common/combo-beneficiario/combo-beneficiario.module';
import { ComboPesquisavelModule } from '../common/combo-pesquisavel/combo-pesquisavel.module';
import { TiposDoadoresComponent } from './tipos-doadores.component';
import { CadastrarTiposDoadoresComponent } from './cadastrar-tipos-doadores/cadastrar-tipos-doadores.component';
import { TiposDoadoresRoutingModule } from './tipos-doadores-routing.module';


@NgModule({
  declarations: [TiposDoadoresComponent, CadastrarTiposDoadoresComponent],
  imports: [
    CommonModule,
    TiposDoadoresRoutingModule,
    MaterialCommonModule,
    DadosAlunoModule,
    ComboBeneficiarioModule,
    ComboPesquisavelModule

  ]
})
export class TiposDoadoresModule { }
