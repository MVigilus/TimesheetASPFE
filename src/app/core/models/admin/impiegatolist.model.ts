import {AnagraficaLavorativa} from "@core/models/impiegato/AnagraficaLavorativa.model";
import {RimborsoDetailDto} from "@core/models/impiegato/RimborsoDetailDto.model";
import {Ruolo} from "@core/models/admin/ImpiegatoDto.model";

export interface Impiegatolist {
  id: number;
  nominativo: string;
  username:string;
  codice_fiscale: string;
  data_assunzione: Date;
  rimborso: boolean;
  ore_permesso: number;
  ore_ferie: number;
  ore_anno_precedente: AnagraficaLavorativa;
  ore_lavorative: number;
  rimborsoDetailDto: RimborsoDetailDto;
  role:Ruolo;
  telefono:string;
  email:string;
}
