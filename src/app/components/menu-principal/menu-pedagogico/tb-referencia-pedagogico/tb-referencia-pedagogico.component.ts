import { Component, OnInit } from '@angular/core';
import { MenuPrincipalService } from 'src/app/services/menuPrincipal/menu-principal.service';
import { ControleMenuService } from 'src/app/services/controle-menu/controle-menu.service';
import { Modulos } from 'src/app/core/modulos';
import { animacaoMenu } from 'src/app/animations';


@Component({
  selector: 'tb-referencia-pedagogico',
  templateUrl: './tb-referencia-pedagogico.component.html',
  styleUrls: ['./tb-referencia-pedagogico.component.css'],
  animations: [
    animacaoMenu
  ]
})


export class TbReferenciaPedagogicoComponent implements OnInit {

  currentState = "hidden"
  isMostrarSubMenu: boolean = false;

  constructor(
    public menuPrincipalService: MenuPrincipalService,
    private controleMenuService: ControleMenuService,
  ) { }


  ngOnInit(): void {
  }

  toggle() {
    this.isMostrarSubMenu = !this.isMostrarSubMenu;
    if (this.isMostrarSubMenu) {
      this.currentState = 'show';
    } else
      this.currentState = 'hidden';
  }
  getIcone() {
    return this.isMostrarSubMenu ? "expand_more" : "chevron_right";
  }

  getModulos() {
    return Modulos;
  }

  verificaAcesso(modulo: Modulos) {
    return this.controleMenuService.verificaAcessoModulo(modulo);
  }
    
}
