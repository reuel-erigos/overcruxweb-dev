import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Modulos } from 'src/app/core/modulos';
import { AcessoModuloResolver } from 'src/app/guards/acesso-modulo.resolve';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { CadastrarContratoComponent } from './cadastrar-contrato/cadastrar-contrato.component';
import { ContratoComponent } from './contrato.component';


const routes: Routes = [
  {
    path: "contrato/cadastrar",
    component: CadastrarContratoComponent,
    canActivate: [AuthGuard],
    resolve: { perfilAcesso: AcessoModuloResolver },
    data: { modulo: Modulos.CONTRATO },
  },
  {
    path: "contrato",
    component: ContratoComponent,
    canActivate: [AuthGuard],
    resolve: { perfilAcesso: AcessoModuloResolver },
    data: { modulo: Modulos.CONTRATO },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContratoRoutingModule {}
