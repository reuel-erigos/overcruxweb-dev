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
import { RegiaoAdministrativa } from '../../../core/regiao-administrativa';
import { RegiaoAdministrativaService } from '../../../services/regiao-administrativa/regiao-administrativa.service';

@Component({
  selector: 'app-cadastrar-escola',
  templateUrl: './cadastrar-escola.component.html',
  styleUrls: ['./cadastrar-escola.component.css']
})
export class CadastrarEscolaComponent extends BaseComponent implements OnInit {

  escola: Escola;
  regioesAdministrativas: RegiaoAdministrativa[];
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

  tipoLocalidadeList: any[] = [
    { tipo: 'Rural', flag: 'R' },
    { tipo: 'Urbana', flag: 'U' }
  ];

  constructor(
    protected formBuilder: FormBuilder,
    private escolaService: EscolaService,
    private enderecoService: EnderecoService,
    private regiaoAdministrativaService: RegiaoAdministrativaService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private toastService:ToastService
  ) {
    super();
  }


  ngOnInit() {
    this.createForm();
    this.carregaUf();
    this.carregaRegiaoAdministrativa();

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

  carregaRegiaoAdministrativa() {
    this.regiaoAdministrativaService.getAllCombo().subscribe((resp: any) => {
      this.regioesAdministrativas = resp;
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
      tipoLocalidade: [null],
      regiaoAdministrativa: [null]
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
      this.toastService.showSucesso("Escola cadastrada com sucesso");
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
      this.toastService.showSucesso("Escola atualizada com sucesso");
    });
  }

  pupularForm() {
    this.setValue(this.form, 'codigo', this.escola.codigo);
    this.setValue(this.form, 'nome', this.escola.nome);
    this.setValue(this.form, 'tipo', this.escola.tipo);
    this.setValue(this.form, 'etapaEnsino', this.escola.etapaEnsino);
    this.setValue(this.form, 'telefone', this.escola.telefone);
    this.setValue(this.form, 'celular', this.escola.celular);
    this.setValue(this.form, 'email', this.escola.email);
    this.setValue(this.form, 'homePage', this.escola.homePage);
    this.setValue(this.form, 'cep', this.escola.cep);
    this.setValue(this.form, 'endereco', this.escola.endereco);
    this.setValue(this.form, 'complementoEndereco', this.escola.complemento);
    this.setValue(this.form, 'cidade', this.escola.cidade);
    this.setValue(this.form, 'bairro', this.escola.bairro);
    this.setValue(this.form, 'uf', this.escola.uf);
    this.setValue(this.form, 'tipoLocalidade', this.escola.tipoLocalidade);
    if(this.escola.regiaoAdministrativa) {
      this.setValue(this.form, 'regiaoAdministrativa', this.escola.regiaoAdministrativa.id);
    }
  }

  criarObjeto() {
    if(!this.escola) {
      this.escola = new Escola();
    }
    this.escola.codigo = this.getValueForm(this.form, 'codigo');
    this.escola.nome = this.getValueForm(this.form, 'nome');
    this.escola.tipo = this.getValueForm(this.form, 'tipo');
    this.escola.etapaEnsino = this.getValueForm(this.form, 'etapaEnsino');
    const telefone = this.getValueForm(this.form, 'telefone');
    const celular = this.getValueForm(this.form, 'celular');
    if(telefone) {
      this.escola.telefone = this.retiraMascara(telefone.toString());
    }
    if(celular) {
      this.escola.celular = this.retiraMascara(celular.toString());
    }
    this.escola.email = this.getValueForm(this.form, 'email');
    this.escola.homePage = this.getValueForm(this.form, 'homePage');
    const cep = this.getValueForm(this.form, 'cep');
    if(cep) {
      this.escola.cep = this.retiraMascara(cep.toString());
    }
    this.escola.endereco = this.getValueForm(this.form, 'endereco');
    this.escola.complemento = this.getValueForm(this.form, 'complementoEndereco');
    this.escola.cidade = this.getValueForm(this.form, 'cidade');
    this.escola.bairro = this.getValueForm(this.form, 'bairro');
    this.escola.uf = this.getValueForm(this.form, 'uf');
    this.escola.tipoLocalidade = this.getValueForm(this.form, 'tipoLocalidade');
    const regiaoAdministrativa = this.getValueForm(this.form, 'regiaoAdministrativa');
    if(regiaoAdministrativa) {
      this.escola.regiaoAdministrativa = new RegiaoAdministrativa();
      this.escola.regiaoAdministrativa.id = regiaoAdministrativa;
    }
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
