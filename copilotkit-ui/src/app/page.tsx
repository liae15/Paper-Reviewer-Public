"use client";

import { useEffect, useRef, useState } from "react";
import { CopilotChat } from "@copilotkit/react-core/v2";
import ReactMarkdown from "react-markdown";

function OutputViewer() {
  const [files, setFiles] = useState<{ key: string; filename: string }[]>([]);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    // this runs once when the component first renders
    fetch("/api/outputs")
      .then((res) => res.json())
      .then((data) => setFiles(data));
  }, []);  // empty array = only run on mount

  const handleClick = (file: { key: string; filename: string }) => {
    fetch(`/api/outputs?key=${encodeURIComponent(file.key)}`)
      .then((res) => res.text())
      .then((text) => {
        setSelectedContent(text);
        setSelectedFile(file.filename);
      });
  };

  return (
    <div>
    { selectedContent ? (
        <div>
          <button onClick={() => setSelectedContent(null)}>Back</button>
            <h3>{selectedFile}</h3>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{selectedContent}</ReactMarkdown>
            </div>
        </div>
      ) : (
        <ul>
          {files.map((file)  => (  <li key={file.key} onClick={() => handleClick(file)}>{file.filename}</li>
      ))}
      </ul>
    )}
    </div>
  );
}

function UploadButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatus(`Uploading ${file.name}...`);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();

      if (!res.ok) {
        setStatus(`Upload failed: ${data.error}`);
        return;
      }

      setStatus(
        `"${data.filename}" uploaded to research folder. Tell the agent to analyze it in the chat.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatus(`Error: ${msg}`);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
          uploading
            ? "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-wait"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
        {uploading ? "Uploading..." : "Upload Paper"}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,.md,.csv"
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>
      {status && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{status}</p>
      )}
    </div>
  );
}

export default function Page() {
  const [view, setView] = useState<"split" | "chat">("split");

  return (
    <main className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* View toggle */}
      <button
        onClick={() => setView(view === "split" ? "chat" : "split")}
        className="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
      >
        {view === "split" ? "Full Chat" : "Split View"}
      </button>

      {/* Left panel — hidden in full chat mode */}
      {view === "split" && (
        <div className="flex-1 h-screen overflow-y-auto flex flex-col justify-between p-12">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-800 dark:text-slate-100 mb-2">
              Paper Reviewer
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base max-w-md">
              Analyze and compare academic sources on AI in economic
              decision-making.
            </p>
          </div>

          <div className="space-y-8 max-w-lg">
            <section>
              <h2 className="text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                How it works
              </h2>
              <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-medium">
                    1
                  </span>
                  <span>
                    Upload a research paper using the button below. It goes
                    straight to the knowledge base.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-medium">
                    2
                  </span>
                  <span>
                    The agent generates a summary and glossary for each source.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-medium">
                    3
                  </span>
                  <span>
                    With two or more sources, a comparative analysis is produced.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-medium">
                    4
                  </span>
                  <span>Ask follow-up questions grounded in the evidence.</span>
                </li>
              </ol>
            </section>

            <UploadButton />
            <OutputViewer />

            <section>
              <h2 className="text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                What you get
              </h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 bg-white dark:bg-slate-900">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mb-1">
                    Summaries
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    MLA 8 citation, analysis table, evidence labels
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 bg-white dark:bg-slate-900">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mb-1">
                    Glossaries
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Key terms cross-referenced with domain dictionary
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 bg-white dark:bg-slate-900">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mb-1">
                    Comparison
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Structured table and narrative synthesis
                  </p>
                </div>
              </div>
            </section>
          </div>

          <p className="text-xs text-slate-300 dark:text-slate-700">
            Built with Strands Agents, Amazon Bedrock, and CopilotKit.
          </p>
        </div>
      )}

      {/* Chat panel — full width in chat mode, 50% in split mode */}
      <div className={`${view === "split" ? "flex-1" : "w-full"} h-screen overflow-y-auto border-l border-slate-200 dark:border-slate-800`}>
        <CopilotChat className="h-full" />
      </div>
    </main>
  );
}
