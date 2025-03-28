import Link from "next/link";

export default function DocsButton() {
  return (
    <Link
      href="/docs"
      className="fixed bottom-8 right-8 w-16 h-16 flex items-center justify-center bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-200 z-50"
      aria-label="Ver documentação da API"
    >
      <span className="text-sm font-medium">Docs</span>
    </Link>
  );
} 