import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { MaterialCommonModule } from "src/app/material-modules/material-common.module";
import { CadastrarPeriodoAtividadeComponent } from "./cadastrar-periodo-atividade/cadastrar-periodo-atividade.component";
import { PeriodoAtividadeRoutingModule } from "./periodo-atividade-routing.module";
import { PeriodoAtividadeComponent } from "./periodo-atividade.component";

@NgModule({
  declarations: [PeriodoAtividadeComponent, CadastrarPeriodoAtividadeComponent],
  imports: [CommonModule, PeriodoAtividadeRoutingModule, MaterialCommonModule],
})
export class PeriodoAtividadeModule {}
