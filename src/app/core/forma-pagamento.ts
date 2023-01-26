export class FormaPagamento {
    tipos = [
        {id: 'B', descricao: 'DÉBITO EM CONTA CORRENTE' },
        {id: 'A', descricao: 'CARTÃO DE CRÉDITO' },
        {id: 'C', descricao: 'CHEQUE' },
        {id: 'D', descricao: 'EM DINHEIRO' }, 
        {id: 'E', descricao: 'CRÉDITO EM CONTA CORRENTE' } 
        
     ];


    getTipo(tipo: string) {
       const tipoCargo = this.tipos.find( d => d.id.includes(tipo));
       return tipoCargo ? tipoCargo : null;
     }

    getDescricao(tipo: string) {
      const tipoCargo = this.getTipo(tipo);
      return tipoCargo ? tipoCargo.descricao : '';
    }
    
}
