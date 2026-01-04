import {AtivoInativoEnum} from "../enum/ativo.inativo.enum";
import {TipoPessoaEnum} from "../enum/tipo.pessoa.enum";
import {Endereco} from "./endereco";
import {Telefone} from "./telefone";
import {SexoEnum} from "../enum/sexo.enum";
import {GridColumn} from "../utils/directives/grid.column.decorator";

export class Pessoa{

  id: number;

  @GridColumn({ label: 'Nome', type: 'texto', ordem: 1 })
  nome: string;

  @GridColumn({ label: 'Documento', type: 'documento', ordem: 2 })
  documento: string;

  email: string;

  @GridColumn({ label: 'Nascimento', type: 'date', ordem: 3 })
  nascimento: Date;

  @GridColumn({ label: 'Situação', type: 'enum', ordem: 6 })
  situacao: AtivoInativoEnum;

  @GridColumn({ label: 'Tipo', type: 'texto', ordem: 4 })
  tipoPessoa: TipoPessoaEnum;

  @GridColumn({ label: 'Sexo', type: 'enum', ordem: 5 })
  sexo: SexoEnum

  telefoneList: Telefone[];

  enderecoList: Endereco[];

  versao: number;

}
