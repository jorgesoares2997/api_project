"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  UserGroupIcon,
  FolderIcon,
  KeyIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface HistoryItem {
  id: string;
  type: "create" | "update" | "delete" | "permission";
  action: string;
  timestamp: string;
  details: string;
  user: {
    name: string;
    email: string;
    image?: string;
  };
}

const mockHistory: HistoryItem[] = [
  {
    id: "1",
    type: "create",
    action: "Criou uma nova equipe",
    timestamp: "2024-03-20T10:00:00Z",
    details: "Equipe: Frontend Developers",
    user: {
      name: "João Silva",
      email: "joao@exemplo.com",
      image: "https://avatars.githubusercontent.com/u/1234567",
    },
  },
  {
    id: "2",
    type: "update",
    action: "Atualizou permissões de repositório",
    timestamp: "2024-03-19T15:30:00Z",
    details: "Repositório: projeto-web - Permissões: push, pull",
    user: {
      name: "Maria Santos",
      email: "maria@exemplo.com",
      image: "https://avatars.githubusercontent.com/u/7654321",
    },
  },
  {
    id: "3",
    type: "delete",
    action: "Removeu membro da equipe",
    timestamp: "2024-03-18T09:15:00Z",
    details: "Equipe: Backend Developers - Membro: Pedro Oliveira",
    user: {
      name: "Ana Costa",
      email: "ana@exemplo.com",
      image: "https://avatars.githubusercontent.com/u/9876543",
    },
  },
  {
    id: "4",
    type: "permission",
    action: "Alterou permissões de membro",
    timestamp: "2024-03-17T14:20:00Z",
    details: "Equipe: DevOps - Membro: Carlos Lima - Nova permissão: admin",
    user: {
      name: "Roberto Alves",
      email: "roberto@exemplo.com",
      image: "https://avatars.githubusercontent.com/u/4567890",
    },
  },
];

export default function HistoryPage() {
  const { data: session } = useSession();
  const [filter, setFilter] = useState<HistoryItem["type"] | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Histórico de Ações</h1>
          <p className="text-gray-600">Por favor, faça login para acessar o histórico.</p>
        </div>
      </div>
    );
  }

  const filteredHistory = mockHistory.filter((item) => {
    const matchesFilter = filter === "all" || item.type === filter;
    const matchesSearch = item.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getActionIcon = (type: HistoryItem["type"]) => {
    switch (type) {
      case "create":
        return <UserGroupIcon className="h-5 w-5 text-green-600" />;
      case "update":
        return <FolderIcon className="h-5 w-5 text-blue-600" />;
      case "delete":
        return <TrashIcon className="h-5 w-5 text-red-600" />;
      case "permission":
        return <KeyIcon className="h-5 w-5 text-purple-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Histórico de Ações</h1>
        <p className="mt-1 text-sm text-gray-500">
          Registro de todas as ações realizadas na plataforma
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Pesquisar ações..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as HistoryItem["type"] | "all")}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              aria-label="Filtrar por tipo de ação"
            >
              <option value="all">Todos os Tipos</option>
              <option value="create">Criação</option>
              <option value="update">Atualização</option>
              <option value="delete">Remoção</option>
              <option value="permission">Permissões</option>
            </select>
            <button
              type="button"
              onClick={() => {
                setFilter("all");
                setSearchQuery("");
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-shrink-0">
                {getActionIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{item.action}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(item.timestamp).toLocaleString("pt-BR")}
                  </p>
                </div>
                <p className="text-sm text-gray-500">{item.details}</p>
                <div className="mt-2 flex items-center">
                  <img
                    src={item.user.image}
                    alt=""
                    className="h-6 w-6 rounded-full"
                  />
                  <span className="ml-2 text-sm text-gray-500">
                    {item.user.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">
              Nenhuma ação encontrada com os filtros atuais.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 