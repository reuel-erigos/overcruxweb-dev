import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatExpansionModule } from '@angular/material/expansion';
import { MaterialCommonModule } from 'src/app/material-modules/material-common.module';
import { ImagemComponent } from './imagem.component';
import { ImagemRoutingModule } from './imagem-routing.module';


@NgModule({
  declarations: [ImagemComponent],
  imports: [
    CommonModule,
    ImagemRoutingModule,
    MaterialCommonModule,
    MatExpansionModule
  ]
})
export class ImagemModule { }
