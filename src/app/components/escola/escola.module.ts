import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatExpansionModule } from '@angular/material/expansion';
import { MaterialCommonModule } from 'src/app/material-modules/material-common.module';
import { EscolaComponent } from './escola.component';
import { EscolaRoutingModule } from './escola-routing.module';
import { CadastrarEscolaComponent } from './cadastrar-escola/cadastrar-escola.component';


@NgModule({
  declarations: [EscolaComponent, CadastrarEscolaComponent],
  imports: [
    CommonModule,
    EscolaRoutingModule,
    MaterialCommonModule,
    MatExpansionModule
  ]
})
export class EscolaModule { }
