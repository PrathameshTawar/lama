import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  X,
  Trophy,
  MessageSquare,
  Target,
  Star,
  Zap,
  CheckCircle
} from "lucide-react";

interface Notification {
  id: string;
  type: 'achievement' | 'reminder' | 'milestone' | 'tip';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'achievement',
      title: 'Interview Streak!',
      message: 'You\'ve completed 3 interviews in a row! Keep up the great work.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false
    },
    {
      id: '2',
      type: 'milestone',
      title: 'Skill Progress Update',
      message: 'Your JavaScript skills have improved by 15% this week!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false
    },
    {
      id: '3',
      type: 'reminder',
      title: 'Practice Reminder',
      message: 'Don\'t forget your mock interview with TechCorp tomorrow at 2 PM.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      read: true
    },
    {
      id: '4',
      type: 'tip',
      title: 'Career Tip',
      message: 'Pro tip: Always prepare 3-5 specific examples for behavioral questions.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      read: true
    }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 'reminder': return <Bell className="w-4 h-4 text-red-500" />;
      case 'milestone': return <Target className="w-4 h-4 text-green-500" />;
      case 'tip': return <Star className="w-4 h-4 text-blue-500" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'tip',
          title: 'AI Insight',
          message: 'Based on your activity, you might benefit from practicing more leadership scenarios.',
          timestamp: new Date(),
          read: false
        };
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only 10 most recent
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {showNotifications && (
        <Card className="absolute right-0 top-12 w-80 max-h-96 z-50 border shadow-lg">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-card-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
            </div>
          </div>

          <ScrollArea className="max-h-80">
            <div className="p-2">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                      notification.read ? 'bg-muted/50' : 'bg-primary/5 border border-primary/20'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-card-foreground truncate">
                            {notification.title}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};

export default NotificationCenter;
