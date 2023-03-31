import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialCommonModule } from 'src/app/material-modules/material-common.module';
import { ProjetoProgramaCellComponent } from './projeto-programa-cell/projeto-programa-cell.component';
import { CategoriasCellComponent } from './categorias-cell/categorias-cell.component';
import { ProximasFaturaCellComponent } from '././proximas-fatura-cell/proximas-fatura-cell.component';
import { ProjetoCellComponent } from './projeto-cell/projeto-cell.component';
import { CategoriaContabilCellComponent } from './categoria-contabil-cell/categoria-contabil-cell.component';



@NgModule({
  declarations: [ProjetoProgramaCellComponent, 
                 CategoriasCellComponent, 
                 ProximasFaturaCellComponent,
                 ProjetoCellComponent,
                 CategoriaContabilCellComponent],
  imports: [
    CommonModule,
    MaterialCommonModule,
    FlexLayoutModule,
  ],
  exports: [ProjetoProgramaCellComponent,
            CategoriasCellComponent, 
            ProximasFaturaCellComponent,
            ProjetoCellComponent,
            CategoriaContabilCellComponent]
})
export class TableCellModule { }
