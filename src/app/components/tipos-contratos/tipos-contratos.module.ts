import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MaterialCommonModule } from "src/app/material-modules/material-common.module";
import { DadosAlunoModule } from "../common/dados-aluno/dados-aluno.module";
import { ComboBeneficiarioModule } from "../common/combo-beneficiario/combo-beneficiario.module";
import { ComboPesquisavelModule } from "../common/combo-pesquisavel/combo-pesquisavel.module";
import { TiposContratosComponent } from "./tipos-contratos.component";
import { CadastrarTiposContratosComponent } from "./cadastrar-tipos-contratos/cadastrar-tipos-contratos.component";
import { TiposContratosRoutingModule } from "./tipos-contratos-routing.module";

@NgModule({
  declarations: [TiposContratosComponent, CadastrarTiposContratosComponent],
  imports: [
    CommonModule,
    TiposContratosRoutingModule,
    MaterialCommonModule,
    DadosAlunoModule,
    ComboBeneficiarioModule,
    ComboPesquisavelModule,
  ],
})
export class TiposContratosModule {}
