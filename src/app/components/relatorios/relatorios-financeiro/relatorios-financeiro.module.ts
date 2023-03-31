import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialCommonModule } from 'src/app/material-modules/material-common.module';
import { ComboPesquisavelModule } from '../../common/combo-pesquisavel/combo-pesquisavel.module';
import { ComboProgramaModule } from '../../common/combo-programa/combo-programa.module';
import { ComboProjetoModule } from '../../common/combo-projeto/combo-projeto.module';
import { LoadingPopupModule } from 'src/app/services/loadingPopup/loading-popup.module';
import { ComboFuncionarioModule } from '../../common/combo-funcionario/combo-funcionario.module';
import { RelatoriosFinanceiroComponent } from './relatorios-financeiro.component';
import { RelatoriosFinanceiroRoutingModule } from './relatorios-financeiro-routing.module';
import { ComboPessoaFisicaModule } from '../../common/combo-pessoa-fisica/combo-pessoa-fisica.module';
import { ComboEmpresaModule } from '../../common/combo-empresa/combo-empresa.module';
import { TableCellModule } from '../../common/table-cell/table-cell.module';


@NgModule({
  declarations: [RelatoriosFinanceiroComponent],
  imports: [
    CommonModule,
    RelatoriosFinanceiroRoutingModule,
    MaterialCommonModule,
    ComboPesquisavelModule,
    ComboProgramaModule,
    ComboProjetoModule,
    ComboFuncionarioModule,
    LoadingPopupModule,
    ComboPessoaFisicaModule,
    ComboEmpresaModule,
    TableCellModule
  ]
})
export class RelatoriosFinanceiroModule { }
