import { DadosAtividadeModule } from './../common/dados-atividade/dados-atividade.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialCommonModule } from 'src/app/material-modules/material-common.module';
import { AcoesAtividadeRoutingModule } from './acoes-atividade-routing.module';
import { AcoesAtividadeComponent } from './acoes-atividade.component';
import { CadastrarAcoesAtividadeComponent } from './cadastrar-acoes-atividade/cadastrar-acoes-atividade.component';
import { FormularioGrupoAcaoOficinaComponent } from './formulario-grupo-acao-oficina/formulario-grupo-acao-oficina.component';
import { MateriaisAcoesComponent } from './materiais-acoes/materiais-acoes.component';
import { CadastrarMateriaisAcaoComponent } from './cadastrar-materiais-acao/cadastrar-materiais-acao.component';
import { ListarMateriaisAcaoComponent } from './listar-materiais-acao/listar-materiais-acao.component';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';

import { NgxCurrencyModule } from 'ngx-currency';
import { ComboFuncionarioModule } from '../common/combo-funcionario/combo-funcionario.module';
import { AnexosComponent, AnexosTamanhosPermitidosComponent } from '../common/anexos/anexos.component';
import { InputFileComponent } from '../common/input-file/input-file.component';
import { BarraPorcentagemComponent } from '../common/anexos/barra-porcentagem/barra-porcentagem.component';
import { VisualizarArquivoComponent } from '../common/visualizar-arquivo/visualizar-arquivo.component';
import { FormularioAcaoComponent } from './formulario-acao/formulario-acao.component';
import { FormularioAnaliseComponent } from './formulario-analise/formulario-analise.component';



@NgModule({
  declarations: [
                 CadastrarAcoesAtividadeComponent,
                 AcoesAtividadeComponent,
                 FormularioGrupoAcaoOficinaComponent,
                 MateriaisAcoesComponent,
                 CadastrarMateriaisAcaoComponent,
                 ListarMateriaisAcaoComponent,
                 AnexosComponent,
                 AnexosTamanhosPermitidosComponent,
                 InputFileComponent,
                 BarraPorcentagemComponent,
                 VisualizarArquivoComponent,
                 FormularioAcaoComponent,
                 FormularioAnaliseComponent
                ],
  imports: [
    CommonModule,
    AcoesAtividadeRoutingModule,
    MaterialCommonModule,
    DadosAtividadeModule,
    MatExpansionModule,
    MatTabsModule,
    NgxCurrencyModule,
    ComboFuncionarioModule,
    DadosAtividadeModule
  ],
  entryComponents: [
    AnexosTamanhosPermitidosComponent,
  ],
})
export class AcoesAtividadeModule { }
