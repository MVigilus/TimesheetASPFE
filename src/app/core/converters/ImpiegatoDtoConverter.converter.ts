import {Impiegatolist} from "@core/models/admin/impiegatolist.model";
import {ImpiegatoDto} from "@core/models/admin/ImpiegatoDto.model";

export function convertImpiegatolistToImpiegatoDto(impiegato: any): ImpiegatoDto {
  return {
    id:impiegato.id,
    username: impiegato.username, // or some other field
    email: impiegato.email,
    role: impiegato.role,
    codiceFisc: (impiegato.codice_fiscale)?impiegato.codice_fiscale:impiegato.codiceFisc,
    nominativo: impiegato.nominativo,
    telefono: impiegato.telefono ,
    dataAss: (impiegato.dataAss)?impiegato.dataAss.toString():impiegato.data_assunzione.toString(),
    rimborso: impiegato.rimborso,
    giorni_permesso: (impiegato.ore_permesso)?impiegato.ore_permesso:impiegato.giorni_permesso,
    giorni_ferie: (impiegato.ore_ferie)?impiegato.ore_ferie:impiegato.giorni_ferie,
    giorni_ferie_pr: (impiegato.ore_anno_precedente)?impiegato.ore_anno_precedente.giorniFerie:impiegato.giorni_ferie_pr,
    giorni_permesso_pr: (impiegato.ore_anno_precedente)?impiegato.ore_anno_precedente.giorniPermesso:impiegato.giorni_permesso_pr,
    modello_auto: (impiegato.rimborsoDetailDto)?impiegato.rimborsoDetailDto.modelloAuto:(impiegato.rimborso)?impiegato.modello_auto:0,
    rimborsoKm: (impiegato.rimborsoDetailDto)?impiegato.rimborsoDetailDto.rimborsoKm:(impiegato.rimborso)?impiegato.rimborsoKm:0,
    oreLavorative: (impiegato.ore_lavorative)?impiegato.ore_lavorative:impiegato.oreLavorative
  };
}

export function convertImpiegatoDtoToImpiegatolist(impiegatoDto: ImpiegatoDto): Impiegatolist {
  return {
    id: (impiegatoDto.id)?impiegatoDto.id:0, // Set this from the relevant source, as it's not in ImpiegatoDto
    nominativo: impiegatoDto.nominativo,
    username:impiegatoDto.username,
    codice_fiscale: impiegatoDto.codiceFisc,
    data_assunzione: new Date(impiegatoDto.dataAss),
    rimborso: impiegatoDto.rimborso,
    ore_permesso: impiegatoDto.giorni_permesso,
    ore_ferie: impiegatoDto.giorni_ferie,
    ore_anno_precedente: {
      id: 0, // Set this from the relevant source, as it's not in ImpiegatoDto
      inserimento: new Date(), // Set this from the relevant source, as it's not in ImpiegatoDto
      giorniFerie: impiegatoDto.giorni_ferie_pr,
      giorniPermesso: impiegatoDto.giorni_permesso_pr
    },
    ore_lavorative: impiegatoDto.oreLavorative,
    rimborsoDetailDto: {
      modelloAuto: impiegatoDto.modello_auto,
      rimborsoKm: impiegatoDto.rimborsoKm
    },
    telefono:impiegatoDto.telefono,
    role: impiegatoDto.role,
    email: impiegatoDto.email
  };
}
