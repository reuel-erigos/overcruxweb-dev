import { CertificadoUnidadeComponent } from './certificado-unidade/certificado-unidade.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { MaterialCommonModule } from 'src/app/material-modules/material-common.module';
import { CadastrarUnidadeComponent } from './cadastrar-unidade/cadastrar-unidade.component';
import { EscolherUnidadeComponent } from './escolher-unidade/escolher-unidade.component';
import { UnidadeRoutingModule } from './unidade-routing.module';
import { UnidadeComponent } from './unidade.component';
import { CadastroEnderecoModule } from '../common/cadastro-endereco/cadastro-endereco.module';
import { DadosBasicosUnidadeComponent } from './dados-unidade/dados-basicos-unidade.component';
import { EstruturaUnidadeComponent } from './estrutura-unidade/estrutura-unidade.component';


@NgModule({
  declarations: [
    EscolherUnidadeComponent
    , UnidadeComponent
    , CadastrarUnidadeComponent, DadosBasicosUnidadeComponent, EstruturaUnidadeComponent, CertificadoUnidadeComponent

  ],
  imports: [
    CommonModule,
    UnidadeRoutingModule,
    MaterialCommonModule,
    SharedDirectivesModule,
    CadastroEnderecoModule
  ],

})
export class UnidadeModule { }
