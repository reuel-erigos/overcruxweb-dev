import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatExpansionModule } from '@angular/material/expansion';
import { RegiaoAdministrativaComponent } from './regiao-administrativa.component';
import { MaterialCommonModule } from 'src/app/material-modules/material-common.module';
import { RegiaoAdministrativaRoutingModule } from './regiao-administrativa-routing.module';
import { CadastrarRegiaoAdministrativaComponent } from './cadastrar-regiao-administrativa/cadastrar-regiao-administrativa.component';


@NgModule({
  declarations: [RegiaoAdministrativaComponent, CadastrarRegiaoAdministrativaComponent],
  imports: [
    CommonModule,
    RegiaoAdministrativaRoutingModule,
    MaterialCommonModule,
    MatExpansionModule
  ]
})
export class RegiaoAdministrativaModule { }
