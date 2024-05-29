import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as OneSignal from '@onesignal/node-onesignal';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import * as moment from 'moment';
import { MedicationReminder } from 'src/medication-reminder/entities/medication-reminder.entity';
import { In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

export const user_key_provider = {
  getToken() {
    return process.env.ONE_SIGNAL_KEY;
  },
};

export const app_key_provider = {
  getToken() {
    return process.env.ONE_SIGNAL_REST_API_KEY;
  },
};

// configuration object
export let oneSignalConfiguration = OneSignal.createConfiguration({
  authMethods: {
    user_auth_key: {
      tokenProvider: user_key_provider,
    },
    rest_api_key: {
      tokenProvider: app_key_provider,
    },
  },
});

@Injectable()
export class TaskScheduleService {
  oneSignalClient: OneSignal.DefaultApi;
  notifiedDevicesWithMessages: Array<ExpoPushMessage> = [];
  expoClient: Expo;

  constructor(
    @InjectRepository(MedicationReminder)
    private readonly medicationReminderRepository: Repository<MedicationReminder>,
    // private configService: ConfigService,
  ) {
    this.oneSignalClient = new OneSignal.DefaultApi(oneSignalConfiguration);
    this.expoClient = new Expo({ useFcmV1: true, maxConcurrentRequests: 100 });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleSendNotification() {
    let tickets = [];
    let chunks = [];
    let receiptIds = [];
    let receiptIdChunks = [];

    const reminderTime = moment().format('HH:mm');
    const currentDate = moment().format('YYYY-MM-DD');

    const reminders = await this.medicationReminderRepository
      .createQueryBuilder('medication_reminder')
      .leftJoinAndSelect('medication_reminder.user', 'user')
      .where('medication_reminder.start_date <= :currentDate', { currentDate })
      .andWhere('medication_reminder.end_date >= :currentDate', {
        currentDate,
      })
      .andWhere('medication_reminder.specified_alarm_times like :item', {
        item: `%${reminderTime}%`,
      })
      .getMany();

    if (reminders.length > 0) {
      let initialIndex = 0;
      let chunkProcessIndex = 0;

      const checkPushToken = async () => {
        const reminder = reminders[initialIndex];
        const pushToken = reminder.user?.device_id;

        if (pushToken) {
          // Check that all your push tokens appear to be valid Expo push tokens
          if (!Expo.isExpoPushToken(pushToken)) {
            console.error(
              `Push token ${pushToken} is not a valid Expo push token`,
            );
          }

          // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
          this.notifiedDevicesWithMessages.push({
            to: pushToken,
            sound: 'default',
            body: "It's time to take your medication",
            data: { ...reminder },
          });
        }

        initialIndex++;
        if (initialIndex < reminders.length) {
          setImmediate(checkPushToken);
        } else {
          chunks = this.expoClient.chunkPushNotifications(
            this.notifiedDevicesWithMessages,
          );

          setImmediate(checkTicket);
        }
      };

      const checkTicket = async () => {
        // The Expo push notification service accepts batches of notifications so
        const chunk = chunks[chunkProcessIndex];
        let ticketChunk =
          await this.expoClient.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);

        chunkProcessIndex++;
        if (chunkProcessIndex < chunks.length) {
          setImmediate(checkPushToken);
        } else {
          chunks = this.expoClient.chunkPushNotifications(
            this.notifiedDevicesWithMessages,
          );

          setImmediate(checkReceiptDetail);
        }
      };

      const checkReceiptDetail = async () => {
        // Later, after the Expo push notification service has delivered the
        // notifications to Apple or Google (usually quickly, but allow the service
        // up to 30 minutes when under load), a "receipt" for each notification is
        // created. The receipts will be available for at least a day; stale receipts
        // are deleted.
        //
        // The ID of each receipt is sent back in the response "ticket" for each
        // notification. In summary, sending a notification produces a ticket, which
        // contains a receipt ID you later use to get the receipt.
        //
        // The receipts may contain error codes to which you must respond. In
        // particular, Apple or Google may block apps that continue to send
        // notifications to devices that have blocked notifications or have uninstalled
        // your app. Expo does not control this policy and sends back the feedback from
        // Apple and Google so you can handle it appropriately.
        for (let ticket of tickets) {
          // NOTE: Not all tickets have IDs; for example, tickets for notifications
          // that could not be enqueued will have error information and no receipt ID.
          if (ticket.status === 'ok') {
            receiptIds.push(ticket.id);
          }
        }

        receiptIdChunks =
          this.expoClient.chunkPushNotificationReceiptIds(receiptIds);
        setImmediate(sendNotification);
      };

      const sendNotification = async () => {
        for (let chunk of receiptIdChunks) {
          let receipts =
            await this.expoClient.getPushNotificationReceiptsAsync(chunk);
          console.log(receipts);

          // The receipts specify whether Apple or Google successfully received the
          // notification and information about an error, if one occurred.
          for (let receiptId in receipts) {
            let { status, details } = receipts[receiptId];
            if (status === 'ok') {
              continue;
            } else if (status === 'error') {
              console.error(`There was an error sending a notification`);
              // if (details && details.error) {
              //   // The error codes are listed in the Expo documentation:
              //   // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
              //   // You must handle the errors appropriately.
              //   console.error(`The error code is ${details.error}`);
              // }
            }
          }
        }

        initialIndex++;
        if (initialIndex < reminders.length) {
          setImmediate(sendNotification);
        }
      };

      setImmediate(checkPushToken);
    }
  }
}
