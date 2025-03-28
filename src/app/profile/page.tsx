"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  UserIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

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

export default function ProfilePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("overview");

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Perfil</h1>
          <p className="text-gray-600">Por favor, faça login para acessar seu perfil.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", name: "Visão Geral", icon: UserIcon },
    { id: "security", name: "Segurança", icon: ShieldCheckIcon },
    { id: "notifications", name: "Notificações", icon: BellIcon },
    { id: "api", name: "Chaves API", icon: KeyIcon },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie suas informações pessoais e preferências.
        </p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <tab.icon className="h-5 w-5 inline-block mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <img
                src={session.user?.image || ""}
                alt=""
                className="h-16 w-16 rounded-full"
              />
              <div>
                <h2 className="text-lg font-medium text-gray-900">{session.user?.name}</h2>
                <p className="text-sm text-gray-500">{session.user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  defaultValue={session.user?.name || ""}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  defaultValue={session.user?.email || ""}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Atividade Recente</h3>
              <div className="space-y-4">
                {mockActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      {activity.type === "team" && <UserIcon className="h-5 w-5 text-indigo-600" />}
                      {activity.type === "repository" && (
                        <KeyIcon className="h-5 w-5 text-indigo-600" />
                      )}
                      {activity.type === "permission" && (
                        <ShieldCheckIcon className="h-5 w-5 text-indigo-600" />
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
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Segurança</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                  Senha Atual
                </label>
                <input
                  type="password"
                  id="current-password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                  Nova Senha
                </label>
                <input
                  type="password"
                  id="new-password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Preferências de Notificação</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Notificações por E-mail</label>
                  <p className="text-sm text-gray-500">
                    Receber notificações sobre mudanças nas equipes e repositórios
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Alternar notificações por e-mail"
                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-indigo-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Notificações Push</label>
                  <p className="text-sm text-gray-500">
                    Receber notificações instantâneas no navegador
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Alternar notificações push"
                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-indigo-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "api" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Chaves API</h2>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Nova Chave
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">
                Você ainda não possui nenhuma chave API. Clique em &ldquo;Nova Chave&rdquo; para criar uma.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 