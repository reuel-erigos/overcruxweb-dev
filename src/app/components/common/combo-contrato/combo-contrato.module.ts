import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComboContratoComponent} from './combo-contrato.component';
import {MaterialCommonModule} from 'src/app/material-modules/material-common.module';
import {MatExpansionModule} from '@angular/material/expansion';
import {ComboPesquisavelModule} from '../combo-pesquisavel/combo-pesquisavel.module';


@NgModule({
    declarations: [ComboContratoComponent],
    imports: [
        CommonModule,
        MaterialCommonModule,
        MatExpansionModule,
        ComboPesquisavelModule
    ],
    exports: [ComboContratoComponent]
})
export class ComboContratoModule {
}
