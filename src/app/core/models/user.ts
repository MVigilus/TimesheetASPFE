export class User {
  id!: number;
  username!: string;
  nominativo!:string;
  email!: string;
  token!: string;
  role!:string;
  rimborso!:boolean;
  telefono!:string;
  oreLavorative!:number;
  anagraficaLavorativa!:AnagraficaLavorativa[];
  modello_auto!:string;
  rimborsoKm!:number;

  get anagraficaCurrent(){
    return this.anagraficaLavorativa[0]
  }

  get anagraficaPrevious(){
    return this.anagraficaLavorativa[1]
  }
}

export class AnagraficaLavorativa{
  id!:number;
  inserimento!:Date;
  giorniFerie!:number;
  giorniPermesso!:number;
}
