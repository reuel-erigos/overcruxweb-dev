import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AcessoModuloResolver } from 'src/app/guards/acesso-modulo.resolve';
import { Modulos } from 'src/app/core/modulos';
import { EscolaComponent } from './escola.component';
import { CadastrarEscolaComponent } from './cadastrar-escola/cadastrar-escola.component';



const routes: Routes = [
  {path: 'escola/cadastrar', component: CadastrarEscolaComponent,canActivate: [AuthGuard],resolve: {perfilAcesso:AcessoModuloResolver}, data:{modulo:Modulos.REGIAO_ADMINISTRATIVA} },
  {path: 'escola', component:EscolaComponent, canActivate: [AuthGuard], resolve: {perfilAcesso:AcessoModuloResolver}, data:{modulo:Modulos.REGIAO_ADMINISTRATIVA} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EscolaRoutingModule { }
