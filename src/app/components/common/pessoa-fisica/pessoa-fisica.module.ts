import { BeneficioSocialPessoaFisicaComponent } from './beneficio-social-pessoa-fisica/beneficio-social-pessoa-fisica.component';
import { BeneficioSocialPessoaFisica } from './../../../core/beneficio-social-pessoa-fisica';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DadosPessoaisComponent } from './dados-pessoais/dados-pessoais.component';
import { MatButtonModule} from '@angular/material/button';
import { EscolaridadeComponent } from './escolaridade/escolaridade.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { DadosProfissionaisComponent } from './dados-profissionais/dados-profissionais.component';
import { OutrasInformacoesComponent } from './outras-informacoes/outras-informacoes.component';
import { FuncionalComponent } from './funcional/funcional.component';
import { MaterialCommonModule } from 'src/app/material-modules/material-common.module';
import { AcademicoComponent } from './academico/academico.component';
import { EscolarComponent } from './escolar/escolar.component';
import { AtendimentoApoioComponent } from './atendimento-apoio/atendimento-apoio.component';
import { NgxCurrencyModule } from "ngx-currency";
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { CadastroEnderecoModule } from '../cadastro-endereco/cadastro-endereco.module';
import { FormularioEncaminhamentoComponent } from './formulario-encaminhamento/formulario-encaminhamento.component';
import { ComboPesquisavelModule } from '../combo-pesquisavel/combo-pesquisavel.module';
import { ComboProgramaModule } from '../combo-programa/combo-programa.module';
import { ComboProjetoModule } from '../combo-projeto/combo-projeto.module';

@NgModule({
  declarations: [
    DadosPessoaisComponent,
    EscolaridadeComponent,
    DocumentosComponent,
    DadosProfissionaisComponent,
    OutrasInformacoesComponent,
    FuncionalComponent,
    AcademicoComponent,
    EscolarComponent,
    AtendimentoApoioComponent,
    FormularioEncaminhamentoComponent,
    BeneficioSocialPessoaFisicaComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MaterialCommonModule,
    NgxCurrencyModule,
    SharedDirectivesModule,
    CadastroEnderecoModule,
    ComboPesquisavelModule,
    ComboProgramaModule,
    ComboProjetoModule,
  ],
  exports:[
    DadosPessoaisComponent,
    EscolaridadeComponent,
    DocumentosComponent,
    DadosProfissionaisComponent,
    OutrasInformacoesComponent,
    FuncionalComponent,
    AcademicoComponent,
    EscolarComponent,
    AtendimentoApoioComponent,
    BeneficioSocialPessoaFisicaComponent
  ]
})
export class PessoaFisicaModule { }
