import { TiposDoadoresModule } from './components/tipos-doadores/tipos-doadores.module';
import { MotivoDesligamentoModule } from './components/motivo-desligamento/motivo-desligamento.module';
import { SituacaoExAlunoModule } from './components/situacao-ex-aluno/situacao-ex-aluno.module';
import { TiposAtividadesModule } from './components/tipos-atividades/tipos-atividades.module';
import { AuthGuard } from './guards/auth.guard';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';


import { DateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';


import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TextMaskModule } from 'angular2-text-mask';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AcaoCompetenciaModule } from './components/acao-competencia/acao-competencia.module';
import { AcessoRestritoComponent } from './components/acesso-restrito/acesso-restrito.component';
import { AcessoModule } from './components/acesso/acesso.module';
import { AcoesAtividadeModule } from './components/acoes-atividade/acoes-atividade.module';
import { AlunoTrabalhandoModule } from './components/aluno-trabalhando/aluno-trabalhando.module';
import { AlunoModule } from './components/aluno/aluno.module';
import { AtendimentoModule } from './components/atendimento/atendimento.module';
import { AtividadeAlunoModule } from './components/atividade-aluno/atividade-aluno.module';
import { AvaliacaoAlunoModule } from './components/avaliacao-aluno/avaliacao-aluno.module';
import { AvaliacaoAtividadeModule } from './components/avaliacao-atividade/avaliacao-atividade.module';
import { CadastroReservaAtividadeModule } from './components/cadastro-reserva-atividade/cadastro-reserva-atividade.module';
import { CargoModule } from './components/cargo/cargo.module';
import { CategoriasContabeisModule } from './components/categorias-contabeis/categorias-contabeis.module';
import { CboModule } from './components/cbo/cbo.module';
import { AuthInterceptor } from './components/common/auth-interceptor/auth-interceptor';
import { ConfirmDialogComponent } from './components/common/confirm-dialog/confirm-dialog.component';
import { ExceptionHandlerModule } from './components/common/exception-handler/exception-handler.module';
import { HttpErrorToastComponent } from './components/common/http-error-toast/http-error-toast.component';
import { HttpMgmtModule } from './components/common/http-mgmt/http-mgmt.module';
import { LoadingPopupModule } from './components/common/loading-popup/loading-popup.module';
import { PaginaNaoEncontradaComponent } from './components/common/pagina-nao-encontrada/pagina-nao-encontrada.component';
import { TempoSessaoDialogComponent } from './components/common/tempo-sessao-dialog/tempo-sessao-dialog.component';
import { CondicaoMoradiaModule } from './components/condicao-moradia/condicao-moradia.module';
import { ContasBancariasModule } from './components/contas-bancarias/contas-bancarias.module';
import { CotacoesMateriaisModule } from './components/cotacoes-materiais/cotacoes-materiais.module';
import { CursoFormacaoModule } from './components/curso-formacao/curso-formacao.module';
import { DepartamentoModule } from './components/departamento/departamento.module';
import { DiagnosticoAtendimentoModule } from './components/diagnostico-atendimento/diagnostico-atendimento.module';
import { DocumentoAtividadeModule } from './components/documento-atividade/documento-atividade.module';
import { EmpresaModule } from './components/empresa/empresa.module';
import { EntidadeSocialModule } from './components/entidade-social/entidade-social.module';
import { FaltasFuncionarioModule } from './components/faltas-funcionario/faltas-funcionario.module';
import { FamiliarAlunoModule } from './components/familiar-aluno/familiar-aluno.module';
import { FrequenciaAlunoModule } from './components/frequencia-aluno/frequencia-aluno.module';
import { FuncionarioModule } from './components/funcionario/funcionario.module';
import { FuncoesModule } from './components/funcoes/funcoes.module';
import { GrausInstrucaoModule } from './components/graus-instrucao/graus-instrucao.module';
import { GrupoModuloModule } from './components/grupo-modulo/grupo-modulo.module';
import { HomeModule } from './components/home/home.module';
import { IndicadoresModule } from './components/indicadores/indicadores.module';
import { IniciativasModule } from './components/iniciativas/iniciativas.module';
import { InstituicaoModule } from './components/instituicao/instituicao.module';
import { LoginModule } from './components/login/login.module';
import { MaterialModule } from './components/material/material.module';
import { MatriculaModule } from './components/matricula/matricula.module';
import { MenuPrincipalModule } from './components/menu-principal/menu-principal.module';
import { MetasModule } from './components/metas/metas.module';
import { MovimentacoesMateriaisModule } from './components/movimentacoes-materiais/movimentacoes-materiais.module';
import { MovimentacoesModule } from './components/movimentacoes/movimentacoes.module';
import { NiveisTurmasModule } from './components/niveis-turmas/niveis-turmas.module';
import { NovaSenhaModule } from './components/nova-senha/nova-senha.module';
import { ObjetivoModule } from './components/objetivo/objetivo.module';
import { OcorrenciaAlunoModule } from './components/ocorrencia-aluno/ocorrencia-aluno.module';
import { OficinaModule } from './components/oficina/oficina.module';
import { ParticipanteAtendimentoModule } from './components/participante-atendimento/participante-atendimento.module';
import { PerspectivaModule } from './components/perspectiva/perspectiva.module';
import { PlanoCargoSalarioModule } from './components/plano-cargo-salario/plano-cargo-salario.module';
import { PlanosAcaoModule } from './components/planos-acao/planos-acao.module';
import { PrestacaoContasModule } from './components/prestacao-contas/prestacao-contas.module';
import { ProgramasModule } from './components/programas/programas.module';
import { ProjetoModule } from './components/projeto/projeto.module';
import { QuestionarioModule } from './components/questionario/questionario.module';
import { ReprovacaoAlunoModule } from './components/reprovacao-aluno/reprovacao-aluno.module';
import { SituacaoVulnerabilidadeModule } from './components/situacao-vulnerabilidade/situacao-vulnerabilidade.module';
import { SolucaoAtendimentoModule } from './components/solucao-atendimento/solucao-atendimento.module';
import { TalentoModule } from './components/talento/talento.module';
import { TempoSessaoModule } from './components/tempo-sessao/tempo-sessao.module';
import { TipoOcorrenciaAlunoModule } from './components/tipo-ocorrencia-aluno/tipo-ocorrencia-aluno.module';
import { TiposContratacoesModule } from './components/tipos-contratacoes/tipos-contratacoes.module';
import { ToolBarPrincipalModule } from './components/tool-bar-principal/tool-bar-principal.module';
import { TurmasModule } from './components/turmas/turmas.module';
import { UnidadeModule } from './components/unidade/unidade.module';
import { UniformeEntregueAlunoModule } from './components/uniforme-entregue-aluno/uniforme-entregue-aluno.module';
import { UploadFotoModule } from './components/upload-foto/upload-foto.module';
import { UsuarioModule } from './components/usuario/usuario.module';
import { SharedPipesModule } from './pipes/shared-pipes.module';
import { getPortuguesePaginatorIntl } from './portuguese-paginator-intl/portuguese-paginator-intl.component';
import { EstoquesModule } from './components/estoques/estoques.module';
import { SaldosContasBancariaModule } from './components/saldos-contas-bancaria/saldos-contas-bancaria.module';
import { PedidosMateriaisModule } from './components/pedidos-materiais/pedidos-materiais.module';
import { UnidadeResolver } from './guards/unidades.resolve';
import { AcessoModuloResolver } from './guards/acesso-modulo.resolve';
import { DATE_FORMAT_PT_BR, ComonsDateAdapter } from './date-config/comons-date-adapter';
import { TransferenciaValoresModule } from './components/transferencia-valores/transferencia-valores.module';
import { TableCellModule } from './components/common/table-cell/table-cell.module';
import { ComboPesquisavelModule } from './components/common/combo-pesquisavel/combo-pesquisavel.module';
import { ConciliacaoModule } from './components/conciliacao/conciliacao.module';
import { ProvisionamentoModule } from './components/provisionamento/provisionamento.module';
import { ExportarDadosAlunoModule } from './components/relatorios/exportar-dados-aluno/exportar-dados-aluno.module';
import { TiposPublicoPrioritarioModule } from './components/tipos-publico-prioritario/tipos-publico-prioritario.module';
import { DoadoresModule } from './components/doadores/doadores.module';
import { RelatoriosBeneficiariosModule } from './components/relatorios/relatorios-beneficiarios/relatorios-beneficiarios.module';
import { CKEditorModule } from 'ng2-ckeditor';
import { RelatoriosDpModule } from './components/relatorios/relatorios-dp/relatorios-dp.module';
import { FornecedoresModule } from './components/fornecedores/fornecedores.module';
import { RelatoriosFinanceiroModule } from './components/relatorios/relatorios-financeiro/relatorios-financeiro.module';
import { MovimentacoesContabeisModule } from './components/movimentacoes-contabeis/movimentacoes-contabeis.module';
import {BeneficilSocialModule} from './components/beneficio-social/beneficil-social.module';
import { RegiaoAdministrativaModule } from './components/regiao-administrativa/regiao-administrativa.module';
import { EscolaModule } from './components/escola/escola.module';
import { ImagemModule } from './components/imagem/imagem.module';
import { NgxImageDisplayModule } from '@creativeacer/ngx-image-display';
import { EixoAtividadeModule } from './components/eixo-atividade/eixo-atividade.module';
import { PeriodoAtividadeModule } from './components/periodo-atividade/periodo-atividade.module';
import { TipoContratoModule } from './components/tipo-contrato/tipo-contrato.module';
import { ContratoModule } from './components/contrato/contrato.module';

registerLocaleData(localePt, 'pt-BR');
@NgModule({
  declarations: [
    AppComponent,
    HttpErrorToastComponent,
    PaginaNaoEncontradaComponent,
    ConfirmDialogComponent,
    AcessoRestritoComponent,
    TempoSessaoDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    LoginModule,
    HomeModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    FlexLayoutModule,
    MatButtonModule,
    RouterModule,
    HttpClientModule,
    ExceptionHandlerModule,
    MatSnackBarModule,
    HttpMgmtModule,
    MatDialogModule,
    LoadingPopupModule,
    NovaSenhaModule,
    ToolBarPrincipalModule,
    MatSidenavModule,
    MatMenuModule,
    MatExpansionModule,
    MatDividerModule,
    MenuPrincipalModule,
    MatDialogModule,
    MatToolbarModule,
    AcessoModule,
    ImageCropperModule,
    MatCardModule,
    DepartamentoModule,
    PerspectivaModule,
    ObjetivoModule,
    IndicadoresModule,
    IniciativasModule,
    MetasModule,
    SharedPipesModule,
    UnidadeModule,
    PlanosAcaoModule,
    ProgramasModule,
    ProjetoModule,
    MaterialModule,
    UploadFotoModule,
    FuncionarioModule,
    EmpresaModule,
    CargoModule,
    CursoFormacaoModule,
    AlunoModule,
    GrausInstrucaoModule,
    QuestionarioModule,
    FaltasFuncionarioModule,
    TalentoModule,
    AcaoCompetenciaModule,
    FamiliarAlunoModule,
    SituacaoVulnerabilidadeModule,
    DiagnosticoAtendimentoModule,
    SolucaoAtendimentoModule,
    EntidadeSocialModule,
    ReprovacaoAlunoModule,
    AtividadeAlunoModule,
    FrequenciaAlunoModule,
    UniformeEntregueAlunoModule,
    AvaliacaoAtividadeModule,
    AvaliacaoAlunoModule,
    AlunoTrabalhandoModule,
    AtendimentoModule,
    ParticipanteAtendimentoModule,
    CondicaoMoradiaModule,
    UsuarioModule,
    DocumentoAtividadeModule,
    CadastroReservaAtividadeModule,
    TempoSessaoModule,
    AcoesAtividadeModule,
    InstituicaoModule,
    GrupoModuloModule,
    TextMaskModule,
    CboModule,
    TipoOcorrenciaAlunoModule,
    OcorrenciaAlunoModule,
    TiposContratacoesModule,
    NiveisTurmasModule,
    TurmasModule,
    OficinaModule,
    MatriculaModule,
    PrestacaoContasModule,
    PlanoCargoSalarioModule,
    MovimentacoesModule,
    CategoriasContabeisModule,
    CotacoesMateriaisModule,
    MovimentacoesMateriaisModule,
    FuncoesModule,
    ContasBancariasModule,
    EstoquesModule,
    SaldosContasBancariaModule,
    PedidosMateriaisModule,
    TransferenciaValoresModule,
    TableCellModule,
    ComboPesquisavelModule,
    ConciliacaoModule,
    ProvisionamentoModule,
    ExportarDadosAlunoModule,
    TiposAtividadesModule,
    SituacaoExAlunoModule,
    MotivoDesligamentoModule,
    TiposPublicoPrioritarioModule,
    TiposDoadoresModule,
    DoadoresModule,
    RelatoriosBeneficiariosModule,
    TiposAtividadesModule,
    CKEditorModule,
    RelatoriosDpModule,
    FornecedoresModule,
    RelatoriosFinanceiroModule,
    MovimentacoesContabeisModule,
    BeneficilSocialModule,
    RegiaoAdministrativaModule,
    TipoContratoModule,
    EscolaModule,
    ImagemModule,
    EixoAtividadeModule,
    PeriodoAtividadeModule,
    ContratoModule,
    NgxImageDisplayModule.forRoot()
  ],
  providers: [
    AuthGuard, UnidadeResolver, AcessoModuloResolver,
    { provide: MatPaginatorIntl, useValue: getPortuguesePaginatorIntl() },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: ComonsDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT_PT_BR },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
