import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AcessoModuloResolver } from 'src/app/guards/acesso-modulo.resolve';
import { Modulos } from 'src/app/core/modulos';
import { ImagemComponent } from './imagem.component';
import { CadastrarImagemComponent } from './cadastrar-imagem/cadastrar-imagem.component';



const routes: Routes = [
  {path: 'imagem/cadastrar', component: CadastrarImagemComponent,canActivate: [AuthGuard],resolve: {perfilAcesso:AcessoModuloResolver}, data:{modulo:Modulos.IMAGEM} },
  {path: 'imagem', component:ImagemComponent, canActivate: [AuthGuard], resolve: {perfilAcesso:AcessoModuloResolver}, data:{modulo:Modulos.IMAGEM} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImagemRoutingModule { }
