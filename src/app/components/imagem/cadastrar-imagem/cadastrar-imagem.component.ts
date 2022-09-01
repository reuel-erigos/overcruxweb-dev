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
import { TipoAquivoMetadado } from '../../../core/enum/tipo-arquvio-metadado.enum';
import { ArquivoMetadados } from '../../../core/arquivo-metadado';
import { DisplayConfig, ImageData } from '@creativeacer/ngx-image-display';

@Component({
  selector: 'app-cadastrar-imagem',
  templateUrl: './cadastrar-imagem.component.html',
  styleUrls: ['./cadastrar-imagem.component.css']
})
export class CadastrarImagemComponent extends BaseComponent implements OnInit {

  arquivo: ArquivoMetadados = new ArquivoMetadados();
  isFotoChanged = false;
  urlFoto: any;
  isAtualizar: boolean = false;

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil  = new CarregarPerfil();

  mostrarBotaoCadastrar = true
  mostrarBotaoAtualizar = true;

  tipoImagemList: any[] = [
    { tipo: 'Cabeçalho', flag: TipoAquivoMetadado.CABECALHO_RELATORIO },
    { tipo: 'Rodapé', flag: TipoAquivoMetadado.RODAPE_RELATORIO }
  ];

  images: Array<ImageData> = [];
  displayconfig: DisplayConfig;
  

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
    this.displayconfig = {
      imageminwidth: '250px',
      containerwidth: '80%',
      containerheight: '500px',
      fullScreenView: false
    };
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

    let idImagem: number;
    idImagem = this.activatedRoute.snapshot.queryParams.id ? this.activatedRoute.snapshot.queryParams.id : null;
    // if (idImagem) {
    //   this.isAtualizar = true;
    //   this.escolaService.getById(idImagem).subscribe((escola: Escola) => {
    //     this.escola = escola
    //     this.pupularForm();
    //   });
    // }
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      tipo: [null, Validators.required],
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
    // this.escolaService.cadastrar(this.escola).subscribe(() => {
    //   this.router.navigate(['escola']);
    //   this.toastService.showSucesso("Escola cadastrada com sucesso");
    // });
  }

  limpar() {
    this.form.reset();
  }

  cancelar() {
    this.router.navigate(['imagem']);
  }

  atualizar() {
    this.criarObjeto();
    // this.escolaService.alterar(this.escola).subscribe(() => {
    //   this.router.navigate(['escola']);
    //   this.toastService.showSucesso("Escola atualizada com sucesso");
    // });
  }


  criarObjeto() {
    // if(!this.escola) {
    //   this.escola = new Escola();
    // }
    // this.escola.codigo = this.getValueForm(this.form, 'codigo');
    // this.escola.nome = this.getValueForm(this.form, 'nome');
    // this.escola.tipo = this.getValueForm(this.form, 'tipo');
    // this.escola.etapaEnsino = this.getValueForm(this.form, 'etapaEnsino');
    // const telefone = this.getValueForm(this.form, 'telefone');
    // const celular = this.getValueForm(this.form, 'celular');
    // if(telefone) {
    //   this.escola.telefone = this.retiraMascara(telefone.toString());
    // }
    // if(celular) {
    //   this.escola.celular = this.retiraMascara(celular.toString());
    // }
    // this.escola.email = this.getValueForm(this.form, 'email');
    // this.escola.homePage = this.getValueForm(this.form, 'homePage');
    // const cep = this.getValueForm(this.form, 'cep');
    // if(cep) {
    //   this.escola.cep = this.retiraMascara(cep.toString());
    // }
    // this.escola.endereco = this.getValueForm(this.form, 'endereco');
    // this.escola.complemento = this.getValueForm(this.form, 'complementoEndereco');
    // this.escola.cidade = this.getValueForm(this.form, 'cidade');
    // this.escola.bairro = this.getValueForm(this.form, 'bairro');
    // this.escola.uf = this.getValueForm(this.form, 'uf');
    // this.escola.tipoLocalidade = this.getValueForm(this.form, 'tipoLocalidade');
    // const regiaoAdministrativa = this.getValueForm(this.form, 'regiaoAdministrativa');
    // if(regiaoAdministrativa) {
    //   this.escola.regiaoAdministrativa = new RegiaoAdministrativa();
    //   this.escola.regiaoAdministrativa.id = regiaoAdministrativa;
    // }
  }

  getBackground() {
    if (this.urlFoto) {
      return `url(${this.urlFoto})`
    }
  }

  fileChangeEvent(event: any): void {
    this.urlFoto = event.target.files[0];
    this.isFotoChanged = true;
    this.readThis(event.target);
  }

  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.urlFoto = myReader.result;
      this.images = [];
      this.images.push({
        type: 'base64',
        imageData: {
          value: this.urlFoto,
        }
      })
    }
    myReader.readAsDataURL(file);
  }

}
