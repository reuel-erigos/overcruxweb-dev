import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatriculaRoutingModule } from './matricula-routing.module';
import { CadastrarMatriculaComponent } from './cadastrar-matricula/cadastrar-matricula.component';
import { MaterialCommonModule } from 'src/app/material-modules/material-common.module';
import { MatriculaComponent } from './matricula.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { DadosAlunoModule } from '../common/dados-aluno/dados-aluno.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { DadosOficinaComponent } from './dados-oficina/dados-oficina.component';
import { ComboBeneficiarioModule } from '../common/combo-beneficiario/combo-beneficiario.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [MatriculaComponent,
                 CadastrarMatriculaComponent,
                 DadosOficinaComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatriculaRoutingModule,
    MaterialCommonModule,
    DadosAlunoModule,
    NgxCurrencyModule,
    MatExpansionModule,
    ComboBeneficiarioModule
  ]
})
export class MatriculaModule { }
