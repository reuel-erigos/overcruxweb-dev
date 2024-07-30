import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {NgxCurrencyModule} from "ngx-currency";
import {MaterialCommonModule} from "src/app/material-modules/material-common.module";
import {CadastrarContratoComponent} from "./cadastrar-contrato/cadastrar-contrato.component";
import {DadosContratoComponent} from "./cadastrar-contrato/dados-contrato/dados-contrato.component";
import {ProgramaContratoComponent} from "./cadastrar-contrato/programa-contrato/programa-contrato.component";
import {ProjetoContratoComponent} from "./cadastrar-contrato/projeto-contrato/projeto-contrato.component";
import {ContratoRoutingModule} from "./contrato-routing.module";
import {ContratoComponent} from "./contrato.component";
import {ComboPesquisavelModule} from "../common/combo-pesquisavel/combo-pesquisavel.module";
import {ComboProgramaModule} from "../common/combo-programa/combo-programa.module";
import {ComboEmpresaModule} from "../common/combo-empresa/combo-empresa.module";
import {ComboProjetoModule} from "../common/combo-projeto/combo-projeto.module";
import {ObjetivoContratoComponent} from "./cadastrar-contrato/objetivo-contrato/objetivo-contrato.component";
import {FormularioMetaObjetivoComponent} from "./cadastrar-contrato/formulario-meta-objetivo/formulario-meta-objetivo.component";
import {
    FormularioIndicadorMetaComponent
} from "./cadastrar-contrato/formulario-indicador-meta/formulario-indicador-meta.component";

@NgModule({
    declarations: [
        ContratoComponent,
        CadastrarContratoComponent,
        DadosContratoComponent,
        ProgramaContratoComponent,
        ProjetoContratoComponent,
        ObjetivoContratoComponent,
        FormularioMetaObjetivoComponent,
        FormularioIndicadorMetaComponent
    ],
    imports: [
        CommonModule,
        NgxCurrencyModule,
        MaterialCommonModule,
        ContratoRoutingModule,
        ComboPesquisavelModule,
        ComboProgramaModule,
        ComboEmpresaModule,
        ComboProjetoModule
    ],
})
export class ContratoModule {
}
