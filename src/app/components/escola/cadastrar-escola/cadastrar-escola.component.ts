import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Acesso } from 'src/app/core/acesso';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { Escola } from '../../../core/escola';
import { EscolaService } from '../../../services/escola/escola.service';
import { BaseComponent } from '../../../architeture/base/base.component';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastrar-escola',
  templateUrl: './cadastrar-escola.component.html',
  styleUrls: ['./cadastrar-escola.component.css']
})
export class CadastrarEscolaComponent extends BaseComponent implements OnInit {

  escola: Escola;

  isAtualizar: boolean = false;

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil  = new CarregarPerfil();

  mostrarBotaoCadastrar = true
  mostrarBotaoAtualizar = true;

  constructor(
    protected formBuilder: FormBuilder,
    private escolaService: EscolaService,
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

    let idEscola: number;
    idEscola = this.activatedRoute.snapshot.queryParams.id ? this.activatedRoute.snapshot.queryParams.id : null;
    if (idEscola) {
      this.isAtualizar = true;
      this.escolaService.getById(idEscola).subscribe((escola: Escola) => {
        this.escola = escola
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
    this.escolaService.cadastrar(this.escola).subscribe(() => {
      this.router.navigate(['escola']);
      this.toastService.showSucesso("Região Administrativa cadastrada com sucesso");
    });
  }

  limpar() {
    this.form.reset();
  }

  cancelar() {
    this.router.navigate(['escola']);
  }

  atualizar() {
    this.criarObjeto();
    this.escolaService.alterar(this.escola).subscribe(() => {
      this.router.navigate(['escola']);
      this.toastService.showSucesso("Região Administrativa atualizada com sucesso");
    });
  }

  pupularForm() {
    this.setValue(this.form, 'nome', this.escola.nome);
  }

  criarObjeto() {
    if(!this.escola) {
      this.escola = new Escola();
    }
    this.escola.nome = this.getValueForm(this.form, 'nome');
  }
}
