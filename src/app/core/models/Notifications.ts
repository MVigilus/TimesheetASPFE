export interface NotificationPlaceHolder {
  message: string;
  time: string;
  icon: string;
  color: string;
  status: string;
}

/*{
  message: 'Please check your mail',
    time: '14 mins ago',
  icon: 'mail',
  color: 'nfc-green',
  status: 'msg-unread',
}*/

export interface Notifications {
  id: number;
  tipo: TipoNotifica;
  message: string;
  readed: boolean;
  dataInserimento: Date;
}

export enum TipoNotifica {
  INSERT_TIMESHEET = "INSERT_TIMESHEET",
  SEND_TIMESHEET = "SEND_TIMESHEET",
  INSERT_GIUSTIFICATIVO = "INSERT_GIUSTIFICATIVO",
  INSERT_BUSTA_PAGA = "INSERT_BUSTA_PAGA",
  TIMESHEET_APPROVED = "TIMESHEET_APPROVED",
  TIMESHEET_REJECTED = "TIMESHEET_REJECTED",
  RESETTED_PASSWORD = "RESETTED_PASSWORD"
}
