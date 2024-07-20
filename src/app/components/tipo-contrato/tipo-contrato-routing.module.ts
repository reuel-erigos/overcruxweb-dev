import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Modulos } from "src/app/core/modulos";
import { AcessoModuloResolver } from "src/app/guards/acesso-modulo.resolve";
import { AuthGuard } from "src/app/guards/auth.guard";
import { CadastrarTipoContratoComponent } from "./cadastrar-tipo-contrato/cadastrar-tipo-contrato.component";
import { TipoContratoComponent } from "./tipo-contrato.component";

const routes: Routes = [
  {
    path: "tipocontrato/cadastrar",
    component: CadastrarTipoContratoComponent,
    canActivate: [AuthGuard],
    resolve: { perfilAcesso: AcessoModuloResolver },
    data: { modulo: Modulos.TIPO_CONTRATO },
  },
  {
    path: "tipocontrato",
    component: TipoContratoComponent,
    canActivate: [AuthGuard],
    resolve: { perfilAcesso: AcessoModuloResolver },
    data: { modulo: Modulos.TIPO_CONTRATO },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TipoContratoRoutingModule {}
