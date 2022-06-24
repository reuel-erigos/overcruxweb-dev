import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { CondicoesMoradia } from 'src/app/core/condicoes-moradia';
import { EnderecoService } from 'src/app/services/endereco/endereco.service';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { PessoaFisica } from '../../../core/pessoa-fisica';
import { CondicoesMoradiaService } from '../../../services/condicoes-moradia/condicoes-moradia.service';
import { GrausInstrucaoService } from '../../../services/graus-instrucao/graus-instrucao.service';
import { GrausInstrucao } from '../../../core/graus-instrucao';
import { Familiares } from '../../../core/familiares';

@Component({
  selector:  'dados-pessoais-familiar-aluno',
  templateUrl:  './dados-pessoais-familiar-aluno.component.html',
  styleUrls:  ['./dados-pessoais-familiar-aluno.component.css'],
  viewProviders:  [{ provide:  ControlContainer, useExisting:  NgForm }]
})
export class DadosPessoaisFamiliarAlunoComponent implements OnInit {

  @Input() familiar: Familiares;
  @Input() pessoaFisica: PessoaFisica;
  grausInstrucao: GrausInstrucao[];

  public maskCep     = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  public maskPhone   = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public maskCelular = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  ufs: any[] =[
    {nome:  'DF'}
  ]

  estadoCivil: any[] =[
    {tipo:  'Solteiro'},
    {tipo:  'Casado'},
    {tipo:  'União Estável'},
    {tipo:  'Divorciado'},
    {tipo:  'Viúvo'}
  ]
  
  racas: String[] =['Amarelo', 'Branco','Indígena','Negro','Pardo']
  
  tipoSanguineo: String[] =['A+', 'A-','B+', 'B-', 'AB+','AB-', 'O+', 'O-'];

  sexo: any[] =[
    {sigla:  'M', descricao:  'Masculino'},
    {sigla:  'F', descricao:  'Feminino'}
  ]

  sim_nao: any[] = [
    {tipo: 'Sim', flag: 'S'},
    {tipo: 'Não', flag: 'N'}
  ];  

  condicoesMoradia: CondicoesMoradia[];

  tipoEscola: any[] = [
    {id:  'P', tipo:  'PÚBLICO'},
    {id:  'R', tipo:  'PRIVADO'},
  ];

  nivelEscolaridade: any[] =[
    { id: 'C' , tipo: 'COMPLETO'},
    { id: 'I' , tipo: 'CURSANDO'},
  ]


  constructor(
    private condicoesMoradiaService: CondicoesMoradiaService,
    private enderecoService: EnderecoService,
    private dataUtilService: DataUtilService,
    private grausInstrucaoService: GrausInstrucaoService
  ) { }

  ngOnInit() {
    this.condicoesMoradiaService.getAll().subscribe((condicoesMoradia: CondicoesMoradia[])=> {
      this.condicoesMoradia = condicoesMoradia;
    });

    this.enderecoService.getAllEstados().subscribe((ufs: any)=> {
      this.ufs = ufs;
    });

    this.grausInstrucaoService.getAll()
    .subscribe((graus: GrausInstrucao[]) => this.grausInstrucao = graus);
  }

  fileChangeEvent(event:  any):  void {
    this.pessoaFisica.foto = event.target.files[0];
    this.pessoaFisica.isFotoChanged = true;
    this.readThis(event.target);
  }

  getBackground(){
    if(this.pessoaFisica && this.pessoaFisica.urlFoto){
      return `url(${this.pessoaFisica.urlFoto})`
    }
  }

  readThis(inputValue:  any):  void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.pessoaFisica.urlFoto = myReader.result;
    }
    myReader.readAsDataURL(file);
  }

  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }
}
