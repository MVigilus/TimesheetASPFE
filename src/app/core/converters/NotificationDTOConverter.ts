import {NotificationPlaceHolder, Notifications} from "@core/models/Notifications";
import {
  colorForNotificationConverte,
  iconForNotificationConverte,
  timeDifferenceInMinutes
} from "@core/utils/functions";

export function convertNotificationFromDto(notifica1:any):NotificationPlaceHolder[]{
  let notificationsedited: NotificationPlaceHolder[] = [];
  if(notifica1.length > 1){
    notifica1.forEach((notifica:Notifications,index=0) => {
      notificationsedited.push(
        {
          message: notifica.message,
          time: timeDifferenceInMinutes(new Date(notifica.dataInserimento)),
          icon: iconForNotificationConverte(notifica.tipo),
          color: 'nfc-'+colorForNotificationConverte(notifica.tipo),
          status: (notifica.readed)?'msg-read':'msg-unread',
        }
      )
    })
  }else{
    notificationsedited.push(
      {
        message: notifica1.message,
        time: timeDifferenceInMinutes(new Date(notifica1.dataInserimento)),
        icon: iconForNotificationConverte(notifica1.tipo),
        color: 'nfc-'+colorForNotificationConverte(notifica1.tipo),
        status: (notifica1.readed)?'msg-read':'msg-unread',
      }
    )
  }

  return notificationsedited
}




