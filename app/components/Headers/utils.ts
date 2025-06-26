import { Notification } from '@/app/types/notification';

type GroupedNotifications = {
  [key: string]: NotificationResponse[];
};

export type NotificationResponse = Notification & {
  boardId: number;
  boardTitle: string;
  type: string;
  fromUser: {
    email: string;
    name: string;
    image: string;
  };
};

export const groupNotificationsByDate = (notifications: NotificationResponse[] = []): GroupedNotifications => {
  return notifications.reduce((groups: Record<string, NotificationResponse[]>, notification) => {
    const notifDate = new Date(notification.createdAt);
    const now = new Date();

    const notifDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    let key = 'Starsze';

    if (notifDay.getTime() === today.getTime()) {
      key = 'Dzisiaj';
    } else if (notifDay.getTime() === yesterday.getTime()) {
      key = 'Wczoraj';
    }

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(notification);

    return groups;
  }, {});
};
