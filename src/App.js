import { useRef, useState } from "react";
import "./App.css";
import Editor from "@monaco-editor/react";

const files = {
  "script.py": {
    name: "script.py",
    language: "python",
    value: "print('hi')",
  },
  "index.html": {
    name: "index.html",
    language: "html",
    value: "<div></div>",
  },
};

function App() {
  const [fileName, setFileName] = useState("script.py");
  const [output, setOutput] = useState("output");
  const [input, setInput] = useState("");
  const editorRef = useRef(null);
  const file = files[fileName];

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    monaco.editor.defineTheme("myTheme", {
      base: "vs",
      inherit: false,
      rules: [],
      colors: {
        "editor.foreground": "#ffffff",
        "editor.background": "#073642",
        "editorCursor.foreground": "#8B0000",
        "editor.lineHighlightBackground": "#073642",
        "editorLineNumber.foreground": "#008800",
        "editorLineNumber.activeForeground": "#ffffff",
        "editor.selectionBackground": "#88000030",
        "editor.inactiveSelectionBackground": "#88000015",
      },
    });
    monaco.editor.setTheme("myTheme");
  }
  // console.log("input", input);
  async function SendCode() {
    const inputobj = input.split(" ");
    // console.log(inputobj, "inputobj");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: editorRef.current.getValue(),
        inputparams: inputobj,
      }),
    };
    const res = await fetch("http://localhost:4000/", requestOptions);
    const data = await res.json();
    console.log(data.message);
    // console.log(data.output);
    setOutput(data.output);
  }

  return (
    <div className="App container">
      <div className="nav">
        <h1>Python Compiler</h1>
        <div>
          <button className="run-btn" onClick={() => setFileName("script.py")}>
            python
          </button>
          <button className="run-btn" onClick={() => setFileName("index.html")}>
            html
          </button>
          <button className="run-btn" onClick={SendCode}>
            Run
          </button>
        </div>
      </div>
      <div className="body-editor">
        <div className="editor-container">
          <Editor
            height="85vh"
            width="64vw"
            theme="vs-dark"
            onMount={handleEditorDidMount}
            path={file.name}
            defaultLanguage={file.language}
            defaultValue={file.value}
            options={{
              scrollBeyondLastLine: false,
              fontSize: "30px",
            }}
          />
        </div>
        <div className="user-values-container">
          <textarea
            className="input-box"
            placeholder="Input"
            onChange={(e) => {
              setInput(e.target.value);
            }}></textarea>
          <div className="output-box" placeholder="Output" value={output}>
            {output}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
