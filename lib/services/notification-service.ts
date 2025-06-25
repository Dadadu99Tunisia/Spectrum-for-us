import { prisma } from "@/lib/db"

export interface NotificationData {
  userId: string
  orderId?: string
  type:
    | "ORDER_CONFIRMED"
    | "ORDER_SHIPPED"
    | "ORDER_DELIVERED"
    | "PAYMENT_RECEIVED"
    | "PRODUCT_REVIEW"
    | "SYSTEM_UPDATE"
  title: string
  message: string
}

export class NotificationService {
  static async create(data: NotificationData) {
    try {
      const notification = await prisma.notification.create({
        data,
      })

      // Ici, vous pourriez ajouter l'envoi d'emails, push notifications, etc.
      await this.sendEmail(data)

      return notification
    } catch (error) {
      console.error("Error creating notification:", error)
      throw error
    }
  }

  static async markAsRead(notificationId: string, userId: string) {
    try {
      return await prisma.notification.update({
        where: {
          id: notificationId,
          userId, // S'assurer que l'utilisateur peut seulement marquer ses propres notifications
        },
        data: {
          read: true,
        },
      })
    } catch (error) {
      console.error("Error marking notification as read:", error)
      throw error
    }
  }

  static async getUserNotifications(userId: string, limit = 10) {
    try {
      return await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
          order: {
            select: {
              orderNumber: true,
            },
          },
        },
      })
    } catch (error) {
      console.error("Error fetching notifications:", error)
      throw error
    }
  }

  private static async sendEmail(data: NotificationData) {
    // Implémentation de l'envoi d'email
    // Vous pouvez utiliser des services comme SendGrid, Mailgun, etc.
    console.log("Sending email notification:", data)
  }
}
