import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgxCurrencyModule } from "ngx-currency";
import { MaterialCommonModule } from "src/app/material-modules/material-common.module";
import { CadastrarContratoComponent } from "./cadastrar-contrato/cadastrar-contrato.component";
import { DadosContratoComponent } from "./cadastrar-contrato/dados-contrato/dados-contrato.component";
import { ProgramaContratoComponent } from "./cadastrar-contrato/programa-contrato/programa-contrato.component";
import { ProjetoContratoComponent } from "./cadastrar-contrato/projeto-contrato/projeto-contrato.component";
import { ContratoRoutingModule } from "./contrato-routing.module";
import { ContratoComponent } from "./contrato.component";

@NgModule({
  declarations: [
    ContratoComponent,
    CadastrarContratoComponent,
    DadosContratoComponent,
    ProgramaContratoComponent,
    ProjetoContratoComponent,
  ],
  imports: [
    CommonModule,
    NgxCurrencyModule,
    MaterialCommonModule,
    ContratoRoutingModule,
  ],
})
export class ContratoModule {}
