import { trpc } from "@cezeri/trpc";

export function useNotifications() {
  return trpc.notifications.list.useQuery();
}
export function useUnreadCount() {
  return trpc.notifications.unreadCount.useQuery();
}
export function useMarkRead() {
  const u = trpc.useUtils();
  return trpc.notifications.markRead.useMutation({
    onSuccess: () => { u.notifications.list.invalidate(); u.notifications.unreadCount.invalidate(); },
  });
}
export function useMarkAllRead() {
  const u = trpc.useUtils();
  return trpc.notifications.markAllRead.useMutation({
    onSuccess: () => { u.notifications.list.invalidate(); u.notifications.unreadCount.invalidate(); },
  });
}
