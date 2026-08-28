"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ShortLink {
  shortCode: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
  expiresAt: string | null;
}

export default function ShortLinksPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    try {
      const res = await fetch("/api/shortlinks/list");
      if (!res.ok) throw new Error("Error al cargar los links");
      const data = await res.json();
      setLinks(data.shortLinks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  }

  async function handleCreateLink(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/shortlinks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          expiresAt: expiresAt || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear el link");
      }

      const data = await res.json();
      setSuccess(`Link creado: ${window.location.origin}/s/${data.shortCode}`);
      setUrl("");
      setExpiresAt("");
      fetchLinks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(shortCode: string) {
    const fullUrl = `${window.location.origin}/s/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    setSuccess("¡Copiado al portapapeles!");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Acortador de Links</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleCreateLink} className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">URL a acortar</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://ejemplo.com/pagina/muy/larga"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">Fecha de expiración (opcional)</label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            {loading ? "Creando..." : "Crear Link Acortado"}
          </button>
        </form>

        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white">Mis Links ({links.length})</h2>
          </div>

          {links.length === 0 ? (
            <div className="px-6 py-8 text-center text-slate-400">
              Aún no tienes links acortados. ¡Crea uno arriba!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Código</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">URL Original</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Clicks</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Creado</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {links.map((link) => (
                    <tr key={link.shortCode} className="hover:bg-slate-700/50">
                      <td className="px-6 py-3 text-sm font-mono text-blue-400">{link.shortCode}</td>
                      <td className="px-6 py-3 text-sm text-slate-300 truncate">
                        <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {link.originalUrl}
                        </a>
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-300">{link.clicks}</td>
                      <td className="px-6 py-3 text-sm text-slate-400">
                        {new Date(link.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <button
                          onClick={() => copyToClipboard(link.shortCode)}
                          className="text-blue-400 hover:text-blue-300 transition"
                        >
                          Copiar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
