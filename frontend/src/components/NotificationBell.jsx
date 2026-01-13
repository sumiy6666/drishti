import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const apiUrl = process.env.REACT_APP_API || 'http://localhost:5000';

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await fetch(`${apiUrl}/api/notifications`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
            }
        } catch (err) {
            console.error("Error fetching notifications:", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${apiUrl}/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Update local state
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error(err);
        }
    };

    const markAllRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${apiUrl}/api/notifications/read-all`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-secondary hover:text-primary transition-colors"
            >
                <i className="fas fa-bell text-xl"></i>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-scale-in origin-top-right">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-dark">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-xs text-primary font-bold hover:underline">
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-secondary">
                                <i className="far fa-bell-slash text-2xl mb-2 opacity-50"></i>
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification._id}
                                    className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}
                                    onClick={() => !notification.read && markAsRead(notification._id)}
                                >
                                    <div className="flex gap-3">
                                        <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!notification.read ? 'bg-primary' : 'bg-transparent'}`}></div>
                                        <div>
                                            <h4 className={`text-sm ${!notification.read ? 'font-bold text-dark' : 'font-medium text-secondary'}`}>
                                                {notification.title}
                                            </h4>
                                            <p className="text-xs text-body mt-1">{notification.message}</p>
                                            <p className="text-[10px] text-gray-400 mt-2">
                                                {new Date(notification.createdAt).toLocaleDateString()} • {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
