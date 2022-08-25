import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Acesso } from 'src/app/core/acesso';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { RegiaoAdministrativa } from '../../../core/regiao-administrativa';
import { RegiaoAdministrativaService } from '../../../services/regiao-administrativa/regiao-administrativa.service';
import { BaseComponent } from '../../../architeture/base/base.component';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastrar-regiao-administrativa',
  templateUrl: './cadastrar-regiao-administrativa.component.html',
  styleUrls: ['./cadastrar-regiao-administrativa.component.css']
})
export class CadastrarRegiaoAdministrativaComponent extends BaseComponent implements OnInit {

  regiaoAdministrativa: RegiaoAdministrativa;

  isAtualizar: boolean = false;

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil  = new CarregarPerfil();

  mostrarBotaoCadastrar = true
  mostrarBotaoAtualizar = true;

  constructor(
    protected formBuilder: FormBuilder,
    private regiaoAdministrativaService: RegiaoAdministrativaService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private toastService:ToastService
  ) {
    super();
  }


  ngOnInit() {
    this.createForm();

    this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);

    if(!this.perfilAcesso.insere){
      this.mostrarBotaoCadastrar = false;
    }
    
    if(!this.perfilAcesso.altera){
      this.mostrarBotaoAtualizar = false;
    }

    let idRegiaoAdministrativa: number;
    idRegiaoAdministrativa = this.activatedRoute.snapshot.queryParams.id ? this.activatedRoute.snapshot.queryParams.id : null;
    if (idRegiaoAdministrativa) {
      this.isAtualizar = true;
      this.regiaoAdministrativaService.getById(idRegiaoAdministrativa).subscribe((regiaoAdministrativa: RegiaoAdministrativa) => {
        this.regiaoAdministrativa = regiaoAdministrativa
        this.pupularForm();
      });
    }

  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      numero: [null, Validators.required],
      nome: [null, Validators.required],
    });
  }


  mostrarBotaoLimpar(){
    if(this.isAtualizar) return false;
    if(!this.mostrarBotaoAtualizar) return false;
    if(!this.mostrarBotaoCadastrar) return false;

    return true;
  }
  
  cadastrar() {
    this.criarObjeto();
    this.regiaoAdministrativaService.cadastrar(this.regiaoAdministrativa).subscribe(() => {
      this.router.navigate(['regiaoadministrativa']);
      this.toastService.showSucesso("Região Administrativa cadastrada com sucesso");
    });
  }

  limpar() {
    this.form.reset();
  }

  cancelar() {
    this.router.navigate(['regiaoadministrativa']);
  }

  atualizar() {
    this.criarObjeto();
    this.regiaoAdministrativaService.alterar(this.regiaoAdministrativa).subscribe(() => {
      this.router.navigate(['regiaoadministrativa']);
      this.toastService.showSucesso("Região Administrativa atualizada com sucesso");
    });
  }

  pupularForm() {
    this.setValue(this.form, 'nome', this.regiaoAdministrativa.nome);
    this.setValue(this.form, 'numero', this.regiaoAdministrativa.numero);
  }

  criarObjeto() {
    if(!this.regiaoAdministrativa) {
      this.regiaoAdministrativa = new RegiaoAdministrativa();
    }
    this.regiaoAdministrativa.nome = this.getValueForm(this.form, 'nome');
    this.regiaoAdministrativa.numero = this.getValueForm(this.form, 'numero');
  }
}
