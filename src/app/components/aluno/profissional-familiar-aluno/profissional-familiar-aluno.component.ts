import { Familiares } from 'src/app/core/familiares';
import { Component, OnInit, Input } from '@angular/core';
import { Aluno } from 'src/app/core/aluno';

@Component({
  selector: 'profissional-familiar-aluno',
  templateUrl: './profissional-familiar-aluno.component.html',
  styleUrls: ['./profissional-familiar-aluno.component.css']
})
export class ProfissionalFamiliarAlunoComponent implements OnInit {

  @Input() familiar: Familiares;

  public maskPhone   = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public maskCelular = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  SIM_NAO: any[] = [
    {tipo: 'Sim', flag: 'S'},
    {tipo: 'Não', flag: 'N'}
  ];

  SITUACAO_TRABALHO: string[] = [
    'CARTEIRA ASSINADA',
    'SEM CARTEIRA ASSINADA',
    'AUTÔNOMO',
    'TRABALHO INFORMAL',
    'APOSENTADO',
    'PENSIONISTA',
    'DESEMPREGRADO',
    'FUNCIONÁRIO PÚBLICO/ PROFISSIONAL LIBERAL',
    'OUTROS'
  ];

  MOTIVO_NAO_TRABALHA: any[] = [
    {tipo: 'Não tem interesse em trabalhar', flag: 'SI'},
    {tipo: 'Procurou, mas não encontrou emprego', flag: 'NE'},
    {tipo: 'Somente estuda', flag: 'ES'},
    {tipo: 'Presta serviço militar', flag: 'SM'},
    {tipo: 'Por problemas de saúde', flag: 'PS'},
    {tipo: 'Do lar', flag: 'LA'},
    {tipo: 'Outros', flag: 'OU'}
  ];

  constructor() { }

  ngOnInit() {
  }

}
