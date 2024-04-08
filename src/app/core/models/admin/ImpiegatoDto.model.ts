export enum Ruolo {
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_USER = 'ROLE_USER'
}

export interface ImpiegatoDto {
  id:number|null;
  username: string;
  email: string;
  role: Ruolo;
  codiceFisc: string;
  nominativo: string;
  telefono: string;
  dataAss: string;
  rimborso: boolean;
  giorni_permesso: number;
  giorni_ferie: number;
  giorni_ferie_pr: number;
  giorni_permesso_pr: number;
  modello_auto: string;
  rimborsoKm: number;
  oreLavorative: number;
}
