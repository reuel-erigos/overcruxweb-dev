import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Acesso } from 'src/app/core/acesso';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { BaseComponent } from '../../../architeture/base/base.component';
import { FormBuilder, Validators } from '@angular/forms';
import { ArquivoMetadados } from '../../../core/arquivo-metadado';
import { DisplayConfig, ImageData } from '@creativeacer/ngx-image-display';
import { ArquivoInstituicaoService } from '../../../services/arquivo/arquivo-instituicao.service';
import { TipoAquivoMetadado } from '../../../core/enum/tipo-arquivo-metadado.enum';
import { FileUtils } from '../../../utils/file-utils';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-cadastrar-imagem',
  templateUrl: './cadastrar-imagem.component.html',
  styleUrls: ['./cadastrar-imagem.component.css']
})
export class CadastrarImagemComponent extends BaseComponent implements OnInit {

  arquivo: ArquivoMetadados = new ArquivoMetadados();
  isFotoChanged = false;
  urlFoto: any;
  foto: any;
  isAtualizar: boolean = false;

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil = new CarregarPerfil();

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
    private arquivoInstituicaoService: ArquivoInstituicaoService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private fileUtils: FileUtils
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

    if (!this.perfilAcesso.insere) {
      this.mostrarBotaoCadastrar = false;
    }

    if (!this.perfilAcesso.altera) {
      this.mostrarBotaoAtualizar = false;
    }

    let idImagem: number;
    idImagem = this.activatedRoute.snapshot.queryParams.id ? this.activatedRoute.snapshot.queryParams.id : null;
    if (idImagem) {
      this.isAtualizar = true;
      this.arquivoInstituicaoService.getById(idImagem).subscribe((arquivo: any) => {
        this.setValue(this.form, 'tipo', arquivo.metadados.tipo);
        this.getControl(this.form, 'tipo').disable();
      });
      this.arquivoInstituicaoService.getBytePorIdArquivo(idImagem).subscribe((foto: any) => {
        foto = this.fileUtils.convertBufferArrayToBase64(foto);
        this.urlFoto = foto ? foto.changingThisBreaksApplicationSecurity : '';
        this.images = [];
        this.images.push({
          type: 'base64',
          imageData: {
            value: this.urlFoto
          }
        })
      });
    }
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      tipo: [null, Validators.required],
    });
  }


  mostrarBotaoLimpar() {
    if (this.isAtualizar) return false;
    if (!this.mostrarBotaoAtualizar) return false;
    if (!this.mostrarBotaoCadastrar) return false;

    return true;
  }

  cadastrar() {
    const tipo = this.getValueForm(this.form, 'tipo');
    if (!this.foto) {
      this.toastService.showAlerta("Necessário realizar o upload de uma imagem.")
      return;
    }
    this.arquivoInstituicaoService.gravarComIdInstituicaoTipo(this.foto, tipo).subscribe(() => {
      this.router.navigate(['imagem']);
      this.toastService.showSucesso("Imagem cadastrada com sucesso");
    });
  }

  limpar() {
    this.form.reset();
    this.foto = null;
    this.images = [];
  }

  cancelar() {
    this.router.navigate(['imagem']);
  }

  getBackground() {
    if (this.urlFoto) {
      return `url(${this.urlFoto})`
    }
  }

  fileChangeEvent(event: any): void {
    this.foto = event.target.files[0];
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
