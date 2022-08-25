import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Acesso } from 'src/app/core/acesso';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { Escola } from '../../../core/escola';
import { EscolaService } from '../../../services/escola/escola.service';
import { BaseComponent } from '../../../architeture/base/base.component';
import { FormBuilder, Validators } from '@angular/forms';
import { EnderecoService } from '../../../services/endereco/endereco.service';

@Component({
  selector: 'app-cadastrar-escola',
  templateUrl: './cadastrar-escola.component.html',
  styleUrls: ['./cadastrar-escola.component.css']
})
export class CadastrarEscolaComponent extends BaseComponent implements OnInit {

  escola: Escola;
  ufs: any[];
  isAtualizar: boolean = false;

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil  = new CarregarPerfil();

  mostrarBotaoCadastrar = true
  mostrarBotaoAtualizar = true;

  public maskCep     = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  public maskPhone   = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public maskCelular = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  tipoEscolaList: any[] = [
    { tipo: 'Pública', flag: 'P' },
    { tipo: 'Privada', flag: 'R' }
  ];

  constructor(
    protected formBuilder: FormBuilder,
    private escolaService: EscolaService,
    private enderecoService: EnderecoService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private toastService:ToastService
  ) {
    super();
  }


  ngOnInit() {
    this.createForm();
    this.carregaUf();

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

  carregaUf() {
    this.enderecoService.getAllEstados().subscribe((ufs: any) => {
      this.ufs = ufs;
    });
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      codigo: [null, Validators.required],
      nome: [null, Validators.required],
      tipo: [null, Validators.required],
      etapaEnsino: [null],
      telefone: [null],
      celular: [null],
      email: [null, Validators.email],
      homePage: [null],
      cep: [null],
      endereco: [null],
      complementoEndereco: [null],
      cidade: [null],
      bairro: [null],
      uf: [null],
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

  onChangeCep() {
    const cep = this.getValueForm(this.form, 'cep');
    if (cep && this.validaCep(cep)) {
      this.enderecoService.getEnderecoPorCep(cep).subscribe(
          (dados) => {
            this.enderecoBuilder(dados);
          },
          (err) => {
            this.enderecoBuilder(null);
            this.toastService.showAlerta('Ocorreu um erro ao buscar o endereço.');
          }
        );
    }
  }

  validaCep(cep) {
    const regex = /^\d{2}((?!000000).)*$/;
    return regex.test(cep);
  }

  enderecoBuilder(endereco) {
    if (endereco && endereco.sucesso) {
      this.setValue(this.form, 'uf', endereco.uf);
      this.setValue(this.form, 'cidade', endereco.localidade + ' ' + endereco.complemento);
      this.setValue(this.form, 'bairro', endereco.bairro);
      this.setValue(this.form, 'endereco', endereco.logradouro);
    } else {
      this.setValue(this.form, 'uf', null);
      this.setValue(this.form, 'cidade', null);
      this.setValue(this.form, 'bairro', null);
      this.setValue(this.form, 'endereco', null);
      this.toastService.showAlerta('Cep inexistente ou endereço não encontrado.');
    }
  }
}
