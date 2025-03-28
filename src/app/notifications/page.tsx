"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useNotifications } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BellIcon, CheckIcon, TrashIcon } from "@heroicons/react/24/outline";

type NotificationType = "all" | "info" | "success" | "warning" | "error";

export default function NotificationsPage() {
  const { data: session } = useSession();
  const { notifications, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications();
  const [filter, setFilter] = useState<NotificationType>("all");
  const [showRead, setShowRead] = useState(true);

  const filteredNotifications = notifications.filter((notification) => {
    if (!showRead && notification.read) return false;
    if (filter === "all") return true;
    return notification.type === filter;
  });

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Notificações</h1>
          <p className="text-gray-600">Por favor, faça login para ver suas notificações.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Notificações</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <CheckIcon className="h-5 w-5 mr-2" />
            Marcar todas como lidas
          </button>
          <button
            onClick={clearAll}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Limpar todas
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as NotificationType)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                aria-label="Filtrar por tipo de notificação"
              >
                <option value="all">Todos os tipos</option>
                <option value="info">Informação</option>
                <option value="success">Sucesso</option>
                <option value="warning">Aviso</option>
                <option value="error">Erro</option>
              </select>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showRead}
                  onChange={(e) => setShowRead(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Mostrar lidas</span>
              </label>
            </div>
            <div className="text-sm text-gray-500">
              {filteredNotifications.length} notificação{filteredNotifications.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="mt-6 flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {filteredNotifications.length === 0 ? (
                <li className="py-5">
                  <div className="flex items-center justify-center text-gray-500">
                    <BellIcon className="h-8 w-8 text-gray-400" />
                    <span className="ml-2">Nenhuma notificação encontrada</span>
                  </div>
                </li>
              ) : (
                filteredNotifications.map((notification) => (
                  <li key={notification.id} className="py-5">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            notification.read ? "bg-gray-100" : "bg-indigo-100"
                          }`}
                        >
                          <BellIcon
                            className={`h-5 w-5 ${
                              notification.read ? "text-gray-400" : "text-indigo-600"
                            }`}
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500">{notification.message}</p>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <span>
                            {formatDistanceToNow(notification.createdAt, {
                              addSuffix: true,
                              locale: ptBR,
                            })}
                          </span>
                          {!notification.read && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              Não lida
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-gray-400 hover:text-gray-500"
                            aria-label="Marcar como lida"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="text-gray-400 hover:text-red-500"
                          aria-label="Remover notificação"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 