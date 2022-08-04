import { ArquivoMetadados } from './arquivo-metadado';
import { BeneficioSocialPessoaFisica } from './beneficio-social-pessoa-fisica';
import { CondicoesMoradia } from './condicoes-moradia';
import { Escola } from './escola';
import { GrausInstrucao } from './graus-instrucao';

export class PessoaFisica {

    id: number;
    nome: string;
    nomeSocial: string;
    orgaoCi: string;
    classificadorMotivoNaoTrab: string;
    descricaoPessoaFisicaAtendidoOrgaoRede: string;
    bairro: string;
    cidade: string;
    cidadeNaturalidade: string;
    condicaoMoradia: string;
    cor: string;
    cursoEscola: string;
    email: string;
    endereco: string;
    escola: Escola;
    escolaridade: string;
    estadoCivil: string;
    formaIngressoEntidade: string;
    medicamentosControlados: string;
    motivoNaoTrab: string;
    nivelEscolaridade: string;
    outrosBenSoc: string;
    periodoEscola: string;
    pontoReferencia: string;
    problemaSaude: string;
    profissao: string;
    redeApSocRelev: string;
    redeApoioSocial: string;
    sexo: string;
    situacaoTrabalho: string;
    turno: string;
    dataNascimento: Date;
    nomeEmpresaTrabalho: string;
    nomeMae: string;
    nomePai: string;
    cep: number;
    identidade: string;
    cpf: string;
    cts: string;
    celular: string;
    nis: string;
    serieCtps: string;
    sessaoTitulo: string;
    telefoneComercial: string;
    telefoneResidencial: string;
    tituloEleitor: string;
    zonaTitulo: string;
    ufCi: string;
    uf: string;
    ufNascimento: string;
    // Classificador indicativo se a pessoa física é atendida por outro órgão da
    // rede de apoio social / pessoal
    statusAtendidoOrgaoRede: string;
    autorizaEmail: string;
    beneficiarioBolsaFamilia: string;
    observacoes: string;
    valorAluguel: number;
    valorBolsaFamilia: number;
    valorOutrosBenerficiosSoc: number;
    valorRenda: number;
    valorRendaCtps: number;
    valorRendaAutonomo: number;
    valorRendaPensaoAlimenticia: number;
    valorRendaAposentadoria: number;

    metadados: ArquivoMetadados;

    condicoesMoradia: CondicoesMoradia;
    grausInstrucao: GrausInstrucao;
    usuarioAlteracao: number;
    foto?: any;
    urlFoto?: any;
    isFotoChanged?: boolean;

    ehDeficiente: string;
    cursandoNivelSuperior: string;
    descricaoDeficiencia: string;
    tipoSangue: string;
    raca: string;

    numeroReservista: string;
    regiaoMilitarReservista: string;
    ufRegiaoMilitar: string;
    numeroCNH: string;
    categoriaCNH: string;
    numeroPisPasep: string;
    ufCTS: string;
    dataEmissaoCI: Date;
    vencimentoCNH: Date;
    origemRendaFamiliar: string;

    emailProfissional: string;

    foneRecado: string;
    celular2: string;
    celular3: string;
    complementoEndereco: string;

    qtPessoasResidemFamilia: number;

    beneficiosSociaisPessoaFisica: BeneficioSocialPessoaFisica[];

}