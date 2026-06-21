(function () {
  "use strict";
  const MUI = MaterialUI;

  function JsonBox(props) {
    const text = props.data == null ? "" : typeof props.data === "string" ? props.data : JSON.stringify(props.data, null, 2);
    return (
      <MUI.Paper variant="outlined" sx={{ p: 1.5, bgcolor: "action.hover", maxHeight: 360, overflow: "auto" }}>
        <MUI.Typography component="pre" variant="caption" sx={{ m: 0, fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {text || "(vacío)"}
        </MUI.Typography>
      </MUI.Paper>
    );
  }

  function DbChatPanel(props) {
    const { busy, onAsk, messages, onClear } = props;
    const [input, setInput] = React.useState("");
    const listRef = React.useRef(null);
    const canAsk = window.ISAFront.Session.can("sql.query.db");
    const blockReason = window.ISAFront.Session.blockReason("sql.query.db");

    React.useEffect(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    }, [messages]);

    async function send() {
      const q = input.trim();
      if (!q || busy) return;
      setInput("");
      await onAsk(q);
    }

    return (
      <MUI.Stack spacing={2} sx={{ height: "100%" }}>
        {!window.CFAI.Auth.isLoggedIn() ? (
          <MUI.Alert severity="warning">Inicia sesión para consultar la base de datos.</MUI.Alert>
        ) : !canAsk ? (
          <MUI.Alert severity="warning">{blockReason || "Sin permiso sql.query.db"}</MUI.Alert>
        ) : (
          <MUI.Alert severity="info" icon={false}>
            Solo consultas SELECT. Ejemplos: «¿Cuántos tickets hay abiertos?», «¿Cuántas instrucciones activas hay en Paty?», «¿Qué modelos usan las instrucciones?»
          </MUI.Alert>
        )}
        <MUI.Paper variant="outlined" ref={listRef} sx={{ flex: 1, minHeight: 280, maxHeight: 420, overflow: "auto", p: 2, bgcolor: "background.default" }}>
          {messages.length === 0 ? (
            <MUI.Typography variant="body2" color="text.secondary">Escribe una pregunta sobre tickets o instrucciones Paty.</MUI.Typography>
          ) : messages.map((m, i) => (
            <MUI.Box key={i} sx={{ mb: 2, textAlign: m.role === "user" ? "right" : "left" }}>
              <MUI.Chip size="small" label={m.role === "user" ? "Tú" : "Agente BD"} sx={{ mb: 0.5 }} color={m.role === "user" ? "primary" : "default"} />
              <MUI.Paper variant="outlined" sx={{ p: 1.5, display: "inline-block", maxWidth: "95%", textAlign: "left", bgcolor: m.role === "user" ? "primary.50" : "grey.50" }}>
                <MUI.Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{m.text}</MUI.Typography>
                {m.meta ? (
                  <MUI.Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1, fontFamily: "monospace" }}>
                    {m.meta}
                  </MUI.Typography>
                ) : null}
              </MUI.Paper>
            </MUI.Box>
          ))}
        </MUI.Paper>
        <MUI.Stack direction="row" spacing={1} alignItems="flex-start">
          <MUI.TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={4}
            placeholder="Pregunta en lenguaje natural…"
            value={input}
            disabled={busy || !canAsk}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          />
          <MUI.Stack spacing={1}>
            <MUI.Button variant="contained" disabled={busy || !canAsk || !input.trim()} onClick={send}>Enviar</MUI.Button>
            <MUI.Button variant="text" size="small" disabled={!messages.length} onClick={onClear}>Limpiar</MUI.Button>
          </MUI.Stack>
        </MUI.Stack>
      </MUI.Stack>
    );
  }

  function App() {
    const Shell = window.ISAFront.Layout.AppShell;
    const [tab, setTab] = React.useState("db");
    const [busy, setBusy] = React.useState(false);
    const [err, setErr] = React.useState("");
    const [result, setResult] = React.useState(null);
    const [dbMessages, setDbMessages] = React.useState([]);
    const [prompt, setPrompt] = React.useState("Di hola mundo en una sola línea.");
    const [system, setSystem] = React.useState("Eres un asistente breve en español.");
    const [userMsg, setUserMsg] = React.useState("¿Qué es Cloudflare Workers AI?");
    const [embedText, setEmbedText] = React.useState("Prueba de embedding cf-ai");

    async function run(fn) {
      if (!window.CFAI.Auth.isLoggedIn() && tab !== "hello") {
        setErr("Inicia sesión para invocar herramientas protegidas.");
        return;
      }
      setBusy(true);
      setErr("");
      setResult(null);
      try {
        const data = await fn();
        setResult(data);
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
      } finally {
        setBusy(false);
      }
    }

    async function askDb(question) {
      if (!window.CFAI.Auth.isLoggedIn()) {
        setErr("Inicia sesión para consultar la base de datos.");
        return;
      }
      setBusy(true);
      setErr("");
      setDbMessages((prev) => [...prev, { role: "user", text: question }]);
      try {
        const data = await window.CFAI.Api.dbAsk({ question });
        const ans = data.data?.answer || data.answer || "Sin respuesta";
        const sql = data.data?.sql || data.sql || "";
        const src = data.data?.source || data.source || "";
        setDbMessages((prev) => [...prev, {
          role: "assistant",
          text: ans,
          meta: sql ? `[${src}] ${sql}` : src,
        }]);
        setResult(data);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setErr(msg);
        setDbMessages((prev) => [...prev, { role: "assistant", text: msg }]);
      } finally {
        setBusy(false);
      }
    }

    const tabs = [
      { id: "db", label: "Consultas BD", icon: "mdi:database-search-outline" },
      { id: "hello", label: "Hola mundo", icon: "mdi:hand-wave-outline" },
      { id: "prompt", label: "Prompt", icon: "mdi:text-box-outline" },
      { id: "chat", label: "Chat LLM", icon: "mdi:chat-outline" },
      { id: "embed", label: "Embeddings", icon: "mdi:vector-combine" },
      { id: "catalog", label: "Catálogo", icon: "mdi:view-list-outline" },
    ];

    const panel = (
      <MUI.Container maxWidth="md" sx={{ py: 2 }}>
        {err ? <MUI.Alert severity="error" sx={{ mb: 2 }} onClose={() => setErr("")}>{err}</MUI.Alert> : null}

        {tab === "db" ? (
          <DbChatPanel
            busy={busy}
            messages={dbMessages}
            onClear={() => { setDbMessages([]); setResult(null); }}
            onAsk={askDb}
          />
        ) : null}

        {tab === "hello" ? (
          <MUI.Stack spacing={2}>
            <MUI.Alert severity="info">
              GET es público. POST hola mundo y el resto de herramientas requieren sesión (JWT vía orquestador).
            </MUI.Alert>
            <MUI.Stack direction="row" spacing={1} flexWrap="wrap">
              <MUI.Button variant="outlined" disabled={busy} onClick={() => run(() => window.CFAI.Api.helloGet())}>
                GET /hello
              </MUI.Button>
              <MUI.Button variant="contained" disabled={busy || !window.CFAI.Auth.isLoggedIn()} onClick={() => run(() => window.CFAI.Api.helloPost({ prompt: "Responde exactamente: Hola mundo desde cf-ai" }))}>
                POST /hello (AI)
              </MUI.Button>
              <MUI.Button variant="outlined" disabled={busy} onClick={() => run(() => window.CFAI.Api.info())}>
                GET /cf-ai
              </MUI.Button>
            </MUI.Stack>
          </MUI.Stack>
        ) : null}

        {tab === "prompt" ? (
          <MUI.Stack spacing={2}>
            <MUI.TextField label="System" fullWidth multiline minRows={2} value={system} onChange={(e) => setSystem(e.target.value)} />
            <MUI.TextField label="Prompt" fullWidth multiline minRows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
            <MUI.Button variant="contained" disabled={busy} onClick={() => run(() => window.CFAI.Api.promptComplete({ system, prompt }))}>
              POST prompt/complete
            </MUI.Button>
          </MUI.Stack>
        ) : null}

        {tab === "chat" ? (
          <MUI.Stack spacing={2}>
            <MUI.TextField label="Mensaje usuario" fullWidth multiline minRows={2} value={userMsg} onChange={(e) => setUserMsg(e.target.value)} />
            <MUI.Button variant="contained" disabled={busy} onClick={() => run(() => window.CFAI.Api.textResponses({ content: userMsg, system }))}>
              POST text/responses
            </MUI.Button>
          </MUI.Stack>
        ) : null}

        {tab === "embed" ? (
          <MUI.Stack spacing={2}>
            <MUI.TextField label="Texto" fullWidth value={embedText} onChange={(e) => setEmbedText(e.target.value)} />
            <MUI.Button variant="contained" disabled={busy} onClick={() => run(() => window.CFAI.Api.textEmbeddings({ text: embedText }))}>
              POST text/embeddings
            </MUI.Button>
          </MUI.Stack>
        ) : null}

        {tab === "catalog" ? (
          <MUI.Stack spacing={1}>
            <MUI.Button variant="outlined" disabled={busy} onClick={() => run(() => window.CFAI.Api.toolsCatalog())}>GET /tools</MUI.Button>
            <MUI.Button variant="outlined" disabled={busy} onClick={() => run(() => window.CFAI.Api.modelCatalog())}>GET /catalog</MUI.Button>
          </MUI.Stack>
        ) : null}

        {tab !== "db" ? (
          <MUI.Box sx={{ mt: 3 }}>
            <MUI.Typography variant="subtitle2" gutterBottom>Respuesta</MUI.Typography>
            <JsonBox data={result} />
          </MUI.Box>
        ) : null}
      </MUI.Container>
    );

    return (
      <Shell
        ns="CFAI"
        loginGate
        navRows={[{ id: "tool", tier: "primary", value: tab, onChange: setTab, tabs }]}
      >
        {panel}
      </Shell>
    );
  }

  window.CFAI = window.CFAI || {};
  window.CFAI.mount = function () {
    const root = document.getElementById("root");
    if (!root) throw new Error("No se encontró #root");
    ReactDOM.createRoot(root).render(<App />);
  };
  window.CFAI.mount();
})();

