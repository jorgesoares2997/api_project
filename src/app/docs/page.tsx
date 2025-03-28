"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  UserGroupIcon,
  FolderIcon,
  BellIcon,
  CommandLineIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

interface DocSection {
  id: string;
  title: string;
  description: string;
  icon: typeof CommandLineIcon;
  content: {
    title: string;
    description: string;
    code: string;
  }[];
}

const docSections: DocSection[] = [
  {
    id: "getting-started",
    title: "Começando",
    description: "Aprenda como começar a usar a API do GitHub Manager",
    icon: CommandLineIcon,
    content: [
      {
        title: "Autenticação",
        description:
          "Para usar a API, você precisa fornecer um token de acesso pessoal do GitHub. Você pode gerar um token em suas configurações do GitHub.",
        code: `curl -H "Authorization: token seu_token_aqui" \\
  https://api.githubmanager.com/v1/user`,
      },
      {
        title: "Rate Limiting",
        description:
          "A API tem um limite de requisições por hora. Você pode verificar seu limite atual na resposta das requisições.",
        code: `{
  "rate_limit": 5000,
  "rate_limit_remaining": 4999,
  "rate_limit_reset": 1616239022
}`,
      },
    ],
  },
  {
    id: "teams",
    title: "Equipes",
    description: "Gerencie equipes e membros",
    icon: UserGroupIcon,
    content: [
      {
        title: "Listar Equipes",
        description: "Retorna uma lista de todas as equipes da organização.",
        code: `GET /v1/teams

Response:
{
  "teams": [
    {
      "id": "1",
      "name": "Desenvolvimento",
      "description": "Equipe de desenvolvimento",
      "members_count": 5,
      "repos_count": 10
    }
  ]
}`,
      },
      {
        title: "Adicionar Membro",
        description: "Adiciona um novo membro à equipe.",
        code: `POST /v1/teams/{team_id}/members

Request:
{
  "username": "usuario",
  "role": "member"
}

Response:
{
  "id": "1",
  "username": "usuario",
  "role": "member",
  "added_at": "2024-03-20T10:00:00Z"
}`,
      },
    ],
  },
  {
    id: "repositories",
    title: "Repositórios",
    description: "Gerencie repositórios e colaboradores",
    icon: FolderIcon,
    content: [
      {
        title: "Listar Repositórios",
        description: "Retorna uma lista de todos os repositórios da organização.",
        code: `GET /v1/repositories

Response:
{
  "repositories": [
    {
      "id": "1",
      "name": "projeto-web",
      "description": "Projeto web principal",
      "visibility": "private",
      "collaborators_count": 3
    }
  ]
}`,
      },
      {
        title: "Adicionar Colaborador",
        description: "Adiciona um novo colaborador ao repositório.",
        code: `POST /v1/repositories/{repo_id}/collaborators

Request:
{
  "username": "usuario",
  "permission": "push"
}

Response:
{
  "id": "1",
  "username": "usuario",
  "permission": "push",
  "added_at": "2024-03-20T10:00:00Z"
}`,
      },
    ],
  },
  {
    id: "webhooks",
    title: "Webhooks",
    description: "Configure webhooks para receber notificações",
    icon: BellIcon,
    content: [
      {
        title: "Listar Webhooks",
        description: "Retorna uma lista de todos os webhooks configurados.",
        code: `GET /v1/webhooks

Response:
{
  "webhooks": [
    {
      "id": "1",
      "url": "https://seu-servidor.com/webhook",
      "events": ["push", "pull_request"],
      "active": true
    }
  ]
}`,
      },
      {
        title: "Criar Webhook",
        description: "Cria um novo webhook para receber notificações.",
        code: `POST /v1/webhooks

Request:
{
  "url": "https://seu-servidor.com/webhook",
  "events": ["push", "pull_request"],
  "secret": "seu_segredo_aqui"
}

Response:
{
  "id": "1",
  "url": "https://seu-servidor.com/webhook",
  "events": ["push", "pull_request"],
  "active": true,
  "created_at": "2024-03-20T10:00:00Z"
}`,
      },
    ],
  },
  {
    id: "error-handling",
    title: "Tratamento de Erros",
    description: "Aprenda como lidar com erros da API",
    icon: DocumentTextIcon,
    content: [
      {
        title: "Códigos de Erro",
        description: "A API usa códigos de status HTTP padrão para indicar erros.",
        code: `{
  "error": {
    "code": 404,
    "message": "Recurso não encontrado",
    "details": "O repositório solicitado não existe"
  }
}`,
      },
      {
        title: "Validação",
        description: "A API valida todos os dados de entrada e retorna erros apropriados.",
        code: `{
  "error": {
    "code": 400,
    "message": "Dados inválidos",
    "details": {
      "username": ["O nome de usuário é obrigatório"],
      "role": ["O papel deve ser 'member' ou 'admin'"]
    }
  }
}`,
      },
    ],
  },
];

export default function DocsPage() {
  const { data: session } = useSession();
  const [activeSection, setActiveSection] = useState("getting-started");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setIsLoading(true);
        // Aqui você pode adicionar uma chamada real à API para buscar a documentação
        // Por enquanto, estamos usando os dados estáticos
        setIsLoading(false);
      } catch (err) {
        setError("Erro ao carregar a documentação. Por favor, tente novamente.");
        console.error("Error fetching docs:", err);
        setIsLoading(false);
      }
    };

    if (session) {
      fetchDocs();
    }
  }, [session]);

  const filteredSections = docSections.filter((section) =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Documentação</h1>
          <p className="text-gray-600">Por favor, faça login para acessar a documentação.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-red-800">Erro</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Documentação da API</h1>
        <p className="mt-1 text-sm text-gray-500">
          Aprenda como usar a API do GitHub Manager
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 flex-shrink-0">
          <div className="sticky top-6">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar na documentação..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <nav className="space-y-1">
              {filteredSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm font-medium rounded-md
                    ${
                      activeSection === section.id
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <section.icon
                    className={`mr-3 h-5 w-5 ${
                      activeSection === section.id ? "text-indigo-700" : "text-gray-400"
                    }`}
                  />
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1">
          {docSections
            .filter((section) => section.id === activeSection)
            .map((section) => (
              <div key={section.id} className="space-y-8">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">{section.title}</h2>
                  <p className="mt-1 text-sm text-gray-500">{section.description}</p>
                </div>

                <div className="space-y-8">
                  {section.content.map((item, index) => (
                    <div key={index} className="space-y-4">
                      <h3 className="text-md font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                      <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                        <code className="text-sm text-gray-800">{item.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
} 