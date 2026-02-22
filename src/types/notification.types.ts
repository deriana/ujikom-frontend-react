export interface NotificationData {
    title: string;
    message: string;
    url?: string;
    action_type?: string; 
    model_type?: string;
    model_id?: number;
}

export interface LaravelNotification {
    id: string; 
    type: string;
    notifiable_type: string;
    notifiable_id: number;
    data: NotificationData; 
    read_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface NotificationResponse {
    message: string;
}