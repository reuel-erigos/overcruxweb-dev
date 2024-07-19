import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "src/app/guards/auth.guard";
import { AcessoModuloResolver } from "src/app/guards/acesso-modulo.resolve";
import { Modulos } from "src/app/core/modulos";
import { PeriodoAtividadeComponent } from "./periodo-atividade.component";
import { CadastrarPeriodoAtividadeComponent } from "./cadastrar-periodo-atividade/cadastrar-periodo-atividade.component";

const routes: Routes = [
  {
    path: "periodoatividade/cadastrar",
    component: CadastrarPeriodoAtividadeComponent,
    canActivate: [AuthGuard],
    resolve: { perfilAcesso: AcessoModuloResolver },
    data: { modulo: Modulos.PERIODO_ATIVIDADE },
  },
  {
    path: "periodoatividade",
    component: PeriodoAtividadeComponent,
    canActivate: [AuthGuard],
    resolve: { perfilAcesso: AcessoModuloResolver },
    data: { modulo: Modulos.PERIODO_ATIVIDADE },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeriodoAtividadeRoutingModule {}
