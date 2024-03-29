import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatExpansionModule } from '@angular/material/expansion';
import { MaterialCommonModule } from 'src/app/material-modules/material-common.module';
import { ImagemComponent } from './imagem.component';
import { ImagemRoutingModule } from './imagem-routing.module';
import { CadastrarImagemComponent } from './cadastrar-imagem/cadastrar-imagem.component';
import { NgxImageDisplayModule } from '@creativeacer/ngx-image-display';
import { SharedPipesModule } from '../../pipes/shared-pipes.module';


@NgModule({
  declarations: [ImagemComponent, CadastrarImagemComponent],
  imports: [
    CommonModule,
    ImagemRoutingModule,
    MaterialCommonModule,
    MatExpansionModule,
    SharedPipesModule,
    NgxImageDisplayModule.forRoot()
  ]
})
export class ImagemModule { }
