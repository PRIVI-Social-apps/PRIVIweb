import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Notification, getNotifications, removeUserNotification } from "shared/services/API/NotificationsAPI";
import { useTypedSelector } from "store/reducers/Reducer";

type NotificationsContextType = {
  unreadNotifications: number;
  notifications: Notification[];
  markAllNotificationsAsRead: () => void;
  dismissNotification: (notificationId: string) => void;
  removeNotification: (notificationId: string) => void;
};

const NotificationsContext = createContext<NotificationsContextType | null>(null);

type NotificationsContextProviderProps = {
  socket: SocketIOClient.Socket | null;
};

export const NotificationsContextProvider: React.FunctionComponent<NotificationsContextProviderProps> = ({
  socket,
  children,
}) => {
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // WARN Deps use `currentUser.id` because there is legacy code that updates user in redux store
  // Checking for user ID is hack to avoid unnecesary updates
  const currentUserId = useTypedSelector(state => state.user)?.id || null;

  useEffect(() => {
    if (currentUserId) {
      getNotifications().then(result => {
        if (result.success) {
          setNotifications(sortNotifications(result.data));
          setUnreadNotifications(result.data.length);
        }
      });
    }
  }, [currentUserId]);

  useEffect(() => {
    if (currentUserId && socket) {
      socket.connect();

      const incomingNotificationHandler = (incomingNotification: Notification) => {
        setNotifications(currentNotifications =>
          sortNotifications([...currentNotifications, incomingNotification])
        );
        setUnreadNotifications(value => value + 1);
      };

      socket.on("sendNotification", incomingNotificationHandler);

      return () => {
        socket.removeListener("sendNotification", incomingNotificationHandler);
      };
    }
  }, [currentUserId, socket]);

  const context = useMemo<NotificationsContextType>(
    () => ({
      unreadNotifications,
      markAllNotificationsAsRead() {
        setUnreadNotifications(0);
      },
      notifications,
      dismissNotification(id) {
        setNotifications(currentNotifications => currentNotifications.filter(n => n.id !== id));
      },
      removeNotification(notificationId) {
        removeUserNotification(notificationId);
        setNotifications(currentNotifications => currentNotifications.filter(n => n.id !== notificationId));
      },
    }),
    [notifications, unreadNotifications]
  );

  return <NotificationsContext.Provider value={context}>{children}</NotificationsContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error("useNotifications hook must be used inside NotificationsContextProvider");
  }

  return context;
};

const sortNotifications = (notifications: Notification[]) => notifications.sort((a, b) => b.date - a.date);
