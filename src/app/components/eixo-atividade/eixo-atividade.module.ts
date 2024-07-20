import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MaterialCommonModule } from "src/app/material-modules/material-common.module";
import { DadosAlunoModule } from "../common/dados-aluno/dados-aluno.module";
import { ComboBeneficiarioModule } from "../common/combo-beneficiario/combo-beneficiario.module";
import { ComboPesquisavelModule } from "../common/combo-pesquisavel/combo-pesquisavel.module";
import { EixoAtividadeComponent } from "./eixo-atividade.component";
import { CadastrarEixoAtividadeComponent } from "./eixo-atividade/cadastrar-eixo-atividade.component";
import { EixoAtividadeRoutingModule } from "./eixo-atividade-routing.module";

@NgModule({
  declarations: [EixoAtividadeComponent, CadastrarEixoAtividadeComponent],
  imports: [CommonModule, EixoAtividadeRoutingModule, MaterialCommonModule],
})
export class EixoAtividadeModule {}
