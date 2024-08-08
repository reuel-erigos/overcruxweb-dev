import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";

import {MaterialCommonModule} from "src/app/material-modules/material-common.module";
import {ComboBeneficiarioModule} from "../common/combo-beneficiario/combo-beneficiario.module";
import {ComboPesquisavelModule} from "../common/combo-pesquisavel/combo-pesquisavel.module";
import {DadosAlunoModule} from "../common/dados-aluno/dados-aluno.module";
import {CadastrarPercursoComponent} from "./cadastrar-percurso/cadastrar-percurso.component";
import {PercursoRoutingModule} from "./percurso-routing.module";
import {PercursoComponent} from "./percurso.component";

@NgModule({
    declarations: [PercursoComponent, CadastrarPercursoComponent],
    imports: [
        CommonModule,
        PercursoRoutingModule,
        MaterialCommonModule,
    ],
})
export class PercursoModule {
}
