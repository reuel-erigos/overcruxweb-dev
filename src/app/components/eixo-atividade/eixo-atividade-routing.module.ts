import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "src/app/guards/auth.guard";
import { AcessoModuloResolver } from "src/app/guards/acesso-modulo.resolve";
import { Modulos } from "src/app/core/modulos";
import { CadastrarEixoAtividadeComponent } from "./eixo-atividade-doadores/cadastrar-eixo-atividade.component";
import { EixoAtividadeComponent } from "./eixo-atividade.component";

const routes: Routes = [
  {
    path: "eixoatividade/cadastrar",
    component: CadastrarEixoAtividadeComponent,
    canActivate: [AuthGuard],
    resolve: { perfilAcesso: AcessoModuloResolver },
    data: { modulo: Modulos.EIXO_ATIVIDADE },
  },
  {
    path: "eixoatividade",
    component: EixoAtividadeComponent,
    canActivate: [AuthGuard],
    resolve: { perfilAcesso: AcessoModuloResolver },
    data: { modulo: Modulos.EIXO_ATIVIDADE },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EixoAtividadeRoutingModule {}
