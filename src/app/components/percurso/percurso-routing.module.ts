import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {Modulos} from "src/app/core/modulos";
import {AcessoModuloResolver} from "src/app/guards/acesso-modulo.resolve";
import {AuthGuard} from "src/app/guards/auth.guard";
import {CadastrarPercursoComponent} from "./cadastrar-percurso/cadastrar-percurso.component";
import {PercursoComponent} from "./percurso.component";

const routes: Routes = [
    {
        path: "percurso/cadastrar",
        component: CadastrarPercursoComponent,
        canActivate: [AuthGuard],
        resolve: {perfilAcesso: AcessoModuloResolver},
        data: {modulo: Modulos.PERCURSO},
    },
    {
        path: "percurso",
        component: PercursoComponent,
        canActivate: [AuthGuard],
        resolve: {perfilAcesso: AcessoModuloResolver},
        data: {modulo: Modulos.PERCURSO},
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PercursoRoutingModule {
}
