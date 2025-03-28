"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  UserGroupIcon,
  FolderIcon,
  KeyIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

interface Stat {
  name: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: typeof UserGroupIcon;
}

const mockStats: Stat[] = [
  {
    name: "Total de Equipes",
    value: "12",
    change: "+2",
    changeType: "increase",
    icon: UserGroupIcon,
  },
  {
    name: "Repositórios Ativos",
    value: "48",
    change: "+5",
    changeType: "increase",
    icon: FolderIcon,
  },
  {
    name: "Permissões Gerenciadas",
    value: "156",
    change: "+12",
    changeType: "increase",
    icon: KeyIcon,
  },
  {
    name: "Atividades Recentes",
    value: "89",
    change: "+8",
    changeType: "increase",
    icon: ChartBarIcon,
  },
];

interface Activity {
  id: string;
  type: "team" | "repository" | "permission";
  action: string;
  timestamp: string;
  details: string;
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "team",
    action: "Criou uma nova equipe",
    timestamp: "2024-03-20T10:00:00Z",
    details: "Equipe: Frontend Developers",
  },
  {
    id: "2",
    type: "repository",
    action: "Adicionou um repositório",
    timestamp: "2024-03-19T15:30:00Z",
    details: "Repositório: projeto-web",
  },
  {
    id: "3",
    type: "permission",
    action: "Atualizou permissões",
    timestamp: "2024-03-18T09:15:00Z",
    details: "Membro: João Silva - Permissões: push, pull",
  },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [timeRange, setTimeRange] = useState("week");

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <p className="text-gray-600">Por favor, faça login para acessar o dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Visão geral das suas equipes e atividades
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            aria-label="Selecionar período de tempo"
          >
            <option value="day">Hoje</option>
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
            <option value="year">Este Ano</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {mockStats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div
                        className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === "increase"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Atividade Recente</h2>
          <div className="space-y-4">
            {mockActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-shrink-0">
                  {activity.type === "team" && (
                    <UserGroupIcon className="h-5 w-5 text-indigo-600" />
                  )}
                  {activity.type === "repository" && (
                    <FolderIcon className="h-5 w-5 text-indigo-600" />
                  )}
                  {activity.type === "permission" && (
                    <KeyIcon className="h-5 w-5 text-indigo-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.details}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(activity.timestamp).toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Distribuição de Permissões</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Admin</span>
              <span className="text-sm font-medium text-gray-900">25%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{ width: "25%" }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Push</span>
              <span className="text-sm font-medium text-gray-900">45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{ width: "45%" }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Pull</span>
              <span className="text-sm font-medium text-gray-900">30%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{ width: "30%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 