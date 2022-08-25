import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AcessoModuloResolver } from 'src/app/guards/acesso-modulo.resolve';
import { Modulos } from 'src/app/core/modulos';
import { RegiaoAdministrativaComponent } from './regiao-administrativa.component';
import { CadastrarRegiaoAdministrativaComponent } from './cadastrar-regiao-administrativa/cadastrar-regiao-administrativa.component';



const routes: Routes = [
  {path: 'regiaoadministrativa/cadastrar', component: CadastrarRegiaoAdministrativaComponent,canActivate: [AuthGuard],resolve: {perfilAcesso:AcessoModuloResolver}, data:{modulo:Modulos.REGIAO_ADMINISTRATIVA} },
  {path: 'regiaoadministrativa', component:RegiaoAdministrativaComponent, canActivate: [AuthGuard], resolve: {perfilAcesso:AcessoModuloResolver}, data:{modulo:Modulos.REGIAO_ADMINISTRATIVA} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegiaoAdministrativaRoutingModule { }
