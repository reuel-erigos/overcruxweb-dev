import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "src/app/guards/auth.guard";
import { AcessoModuloResolver } from "src/app/guards/acesso-modulo.resolve";
import { Modulos } from "src/app/core/modulos";
import { CadastrarTiposContratosComponent } from "./cadastrar-tipos-contratos/cadastrar-tipos-contratos.component";
import { TiposContratosComponent } from "./tipos-contratos.component";

const routes: Routes = [
  {
    path: "tiposcontratos/cadastrar",
    component: CadastrarTiposContratosComponent,
    canActivate: [AuthGuard],
    resolve: { perfilAcesso: AcessoModuloResolver },
    data: { modulo: Modulos.TIPOS_CONTRATOS },
  },
  {
    path: "tiposcontratos",
    component: TiposContratosComponent,
    canActivate: [AuthGuard],
    resolve: { perfilAcesso: AcessoModuloResolver },
    data: { modulo: Modulos.TIPOS_CONTRATOS },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TiposContratosRoutingModule {}
