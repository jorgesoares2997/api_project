"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  QuestionMarkCircleIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "Como criar uma nova equipe?",
    answer:
      "Para criar uma nova equipe, vá para a página 'Equipes' e clique no botão 'Nova Equipe'. Preencha o nome da equipe e selecione os membros iniciais. Você também pode definir as permissões padrão para os membros da equipe.",
  },
  {
    question: "Como gerenciar permissões de repositório?",
    answer:
      "Na página de detalhes da equipe, você encontrará uma seção 'Repositórios'. Clique em 'Gerenciar Repositórios' para adicionar ou remover repositórios e configurar as permissões específicas para cada um.",
  },
  {
    question: "Como adicionar novos membros à equipe?",
    answer:
      "Na página de detalhes da equipe, clique em 'Gerenciar Membros'. Você pode adicionar novos membros usando seus nomes de usuário do GitHub. Você também pode definir suas funções e permissões específicas.",
  },
  {
    question: "Como usar templates de permissão?",
    answer:
      "Os templates de permissão permitem criar conjuntos predefinidos de permissões. Vá para a página 'Templates' para criar, editar ou usar templates existentes ao configurar permissões para membros da equipe.",
  },
  {
    question: "Como configurar notificações?",
    answer:
      "Na página 'Configurações', você encontrará uma seção 'Notificações' onde pode configurar suas preferências de notificação, incluindo e-mail, notificações push e tipos específicos de atualizações.",
  },
];

export default function HelpPage() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Ajuda e Suporte</h1>
          <p className="text-gray-600">Por favor, faça login para acessar a ajuda e suporte.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ajuda e Suporte</h1>
        <p className="mt-1 text-sm text-gray-500">
          Encontre respostas para suas perguntas e obtenha suporte quando necessário.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <QuestionMarkCircleIcon className="h-8 w-8 text-indigo-600" />
            <h3 className="ml-3 text-lg font-medium text-gray-900">FAQ</h3>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Respostas para as perguntas mais frequentes sobre o uso da plataforma.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <BookOpenIcon className="h-8 w-8 text-indigo-600" />
            <h3 className="ml-3 text-lg font-medium text-gray-900">Documentação</h3>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Guias detalhados e documentação técnica para usuários avançados.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-indigo-600" />
            <h3 className="ml-3 text-lg font-medium text-gray-900">Chat ao Vivo</h3>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Suporte em tempo real com nossa equipe de atendimento.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <EnvelopeIcon className="h-8 w-8 text-indigo-600" />
            <h3 className="ml-3 text-lg font-medium text-gray-900">E-mail</h3>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Entre em contato conosco por e-mail para suporte personalizado.
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Perguntas Frequentes</h2>
          <div className="flex-1 max-w-lg ml-4">
            <input
              type="text"
              placeholder="Pesquisar perguntas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {filteredFaqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-6">
              <h3 className="text-base font-medium text-gray-900">{faq.question}</h3>
              <p className="mt-2 text-sm text-gray-500">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900">Precisa de mais ajuda?</h2>
        <p className="mt-1 text-sm text-gray-500">
          Nossa equipe de suporte está pronta para ajudar. Entre em contato conosco através de um dos
          canais abaixo:
        </p>
        <div className="mt-4 space-y-4">
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-indigo-600" />
            <span className="ml-2 text-sm text-gray-700">Chat ao vivo: Disponível 24/7</span>
          </div>
          <div className="flex items-center">
            <EnvelopeIcon className="h-5 w-5 text-indigo-600" />
            <span className="ml-2 text-sm text-gray-700">
              E-mail: suporte@exemplo.com
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 