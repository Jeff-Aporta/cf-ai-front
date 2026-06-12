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

  function App() {
    const Shell = window.ISAFront.Layout.AppShell;
    const [tab, setTab] = React.useState("hello");
    const [busy, setBusy] = React.useState(false);
    const [err, setErr] = React.useState("");
    const [result, setResult] = React.useState(null);
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

    const tabs = [
      { id: "hello", label: "Hola mundo" },
      { id: "prompt", label: "Prompt" },
      { id: "chat", label: "Chat" },
      { id: "embed", label: "Embeddings" },
      { id: "catalog", label: "Catálogo" },
    ];

    const panel = (
      <MUI.Container maxWidth="md" sx={{ py: 2 }}>
        {err ? <MUI.Alert severity="error" sx={{ mb: 2 }} onClose={() => setErr("")}>{err}</MUI.Alert> : null}
        <MUI.Tabs value={tab} onChange={(_e, v) => setTab(v)} variant="scrollable" sx={{ mb: 2 }}>
          {tabs.map((t) => <MUI.Tab key={t.id} value={t.id} label={t.label} />)}
        </MUI.Tabs>

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

        <MUI.Box sx={{ mt: 3 }}>
          <MUI.Typography variant="subtitle2" gutterBottom>Respuesta</MUI.Typography>
          <JsonBox data={result} />
        </MUI.Box>
      </MUI.Container>
    );

    return (
      <Shell ns="CFAI" title="Workers AI (cf-ai)" icon="mdi:cloud-sync-outline" loginGate>
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
