import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { MaterialCommonModule } from "src/app/material-modules/material-common.module";
import { ComboBeneficiarioModule } from "../common/combo-beneficiario/combo-beneficiario.module";
import { ComboPesquisavelModule } from "../common/combo-pesquisavel/combo-pesquisavel.module";
import { DadosAlunoModule } from "../common/dados-aluno/dados-aluno.module";
import { CadastrarTipoContratoComponent } from "./cadastrar-tipo-contrato/cadastrar-tipo-contrato.component";
import { TipoContratoRoutingModule } from "./tipo-contrato-routing.module";
import { TipoContratoComponent } from "./tipo-contrato.component";

@NgModule({
  declarations: [TipoContratoComponent, CadastrarTipoContratoComponent],
  imports: [
    CommonModule,
    TipoContratoRoutingModule,
    MaterialCommonModule,
    DadosAlunoModule,
    ComboBeneficiarioModule,
    ComboPesquisavelModule,
  ],
})
export class TipoContratoModule {}
