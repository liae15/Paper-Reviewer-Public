import { CopilotSidebar } from "@copilotkit/react-core/v2";

export default function Page() {
  return (
    <main className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Left panel — context & instructions */}
      <div className="flex-1 flex flex-col justify-between p-12">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-800 dark:text-slate-100 mb-2">
            Paper Reviewer
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-md">
            Analyze and compare academic sources on AI in economic decision-making.
          </p>
        </div>

        <div className="space-y-8 max-w-lg">
          <section>
            <h2 className="text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
              How it works
            </h2>
            <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-medium">1</span>
                <span>Upload or paste a research paper into the chat.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-medium">2</span>
                <span>The agent generates a summary and glossary for each source.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-medium">3</span>
                <span>With two or more sources, a comparative analysis is produced.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-medium">4</span>
                <span>Ask follow-up questions grounded in the evidence.</span>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
              What you get
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 bg-white dark:bg-slate-900">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mb-1">Summaries</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">MLA 8 citation, analysis table, evidence labels</p>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 bg-white dark:bg-slate-900">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mb-1">Glossaries</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Key terms cross-referenced with domain dictionary</p>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 bg-white dark:bg-slate-900">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mb-1">Comparison</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Structured table and narrative synthesis</p>
              </div>
            </div>
          </section>
        </div>

        <p className="text-xs text-slate-300 dark:text-slate-700">
          Built with Strands Agents, Amazon Bedrock, and CopilotKit.
        </p>
      </div>

      {/* Right side — chat sidebar */}
      <CopilotSidebar
        attachments={{
          enabled: true,
          accept: "application/pdf,text/plain,text/markdown,text/csv",
        }}
      />
    </main>
  );
}
