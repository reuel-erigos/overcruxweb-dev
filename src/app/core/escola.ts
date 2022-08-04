import { Instituicao } from "./instituicao";
import { RegiaoAdministrativa } from "./regiao-administrativa";
import { UsuarioSistema } from "./usuario-sistema";

export class Escola {

    id: number;
    codigo: string;
    nome: string;
    tipo: string;
    etapaEnsino: string;
    telefone: string;
    celular: string;
    email: string;
    homePage: string;
    tipoLocalidade: string;
    cep: number;
    endereco: string;
    complemento: string;
    bairro: string;
    uf: string;
    cidade: string;
    regiaoAdministrativa: RegiaoAdministrativa;
    instituicao: Instituicao;
    usuarioSistema: UsuarioSistema;
}