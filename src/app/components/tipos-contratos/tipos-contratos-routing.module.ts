import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Modulos } from "src/app/core/modulos";
import { AcessoModuloResolver } from "src/app/guards/acesso-modulo.resolve";
import { AuthGuard } from "src/app/guards/auth.guard";
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
