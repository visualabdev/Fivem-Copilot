"use client"

import { useRef } from "react"
import { Editor, type OnMount } from "@monaco-editor/react"
import type * as Monaco from "monaco-editor"

interface MonacoEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  theme?: string
  readOnly?: boolean
  onMount?: (editor: Monaco.editor.IStandaloneCodeEditor, monaco: typeof Monaco) => void
}

export function MonacoEditor({
  value,
  onChange,
  language,
  theme = "vs-dark",
  readOnly = false,
  onMount,
}: MonacoEditorProps) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<typeof Monaco | null>(null)

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    // Configure Lua language support
    if (language === "lua") {
      configureLuaLanguage(monaco)
    }

    // Configure FiveM-specific features
    configureFiveMFeatures(editor, monaco)

    // Call custom onMount if provided
    if (onMount) {
      onMount(editor, monaco)
    }
  }

  const configureLuaLanguage = (monaco: typeof Monaco) => {
    // Enhanced Lua language configuration
    monaco.languages.setLanguageConfiguration("lua", {
      comments: {
        lineComment: "--",
        blockComment: ["--[[", "]]"],
      },
      brackets: [
        ["{", "}"],
        ["[", "]"],
        ["(", ")"],
      ],
      autoClosingPairs: [
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],
      surroundingPairs: [
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],
    })

    // Enhanced Lua syntax highlighting
    monaco.languages.setMonarchTokensProvider("lua", {
      keywords: [
        "and",
        "break",
        "do",
        "else",
        "elseif",
        "end",
        "false",
        "for",
        "function",
        "if",
        "in",
        "local",
        "nil",
        "not",
        "or",
        "repeat",
        "return",
        "then",
        "true",
        "until",
        "while",
        "goto",
      ],
      fivemKeywords: [
        "CreateThread",
        "Wait",
        "RegisterNetEvent",
        "TriggerEvent",
        "TriggerServerEvent",
        "TriggerClientEvent",
        "AddEventHandler",
        "RegisterCommand",
        "exports",
      ],
      qbcoreKeywords: ["QBCore", "PlayerData", "Functions", "Commands", "Shared"],
      esxKeywords: ["ESX", "xPlayer", "GetPlayerFromId", "RegisterServerEvent"],
      operators: [
        "=",
        ">",
        "<",
        "!",
        "~",
        "?",
        ":",
        "==",
        "<=",
        ">=",
        "!=",
        "&&",
        "||",
        "++",
        "--",
        "+",
        "-",
        "*",
        "/",
        "&",
        "|",
        "^",
        "%",
        "<<",
        ">>",
        ">>>",
        "+=",
        "-=",
        "*=",
        "/=",
        "&=",
        "|=",
        "^=",
        "%=",
        "<<=",
        ">>=",
        ">>>=",
      ],
      symbols: /[=><!~?:&|+\-*/^%]+/,
      tokenizer: {
        root: [
          [
            /[a-zA-Z_]\w*/,
            {
              cases: {
                "@keywords": "keyword",
                "@fivemKeywords": "keyword.fivem",
                "@qbcoreKeywords": "keyword.qbcore",
                "@esxKeywords": "keyword.esx",
                "@default": "identifier",
              },
            },
          ],
          [/[{}()[\]]/, "@brackets"],
          [/[;,.]/, "delimiter"],
          [/"([^"\\]|\\.)*$/, "string.invalid"],
          [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
          [/'([^'\\]|\\.)*$/, "string.invalid"],
          [/'/, { token: "string.quote", bracket: "@open", next: "@stringsingle" }],
          [/0[xX][0-9a-fA-F]+/, "number.hex"],
          [/\d+\.?\d*/, "number"],
          [/--\[\[/, { token: "comment", next: "@comment" }],
          [/--.*$/, "comment"],
          [
            /@symbols/,
            {
              cases: {
                "@operators": "operator",
                "@default": "",
              },
            },
          ],
        ],
        comment: [
          [/[^\]]+/, "comment"],
          [/\]\]/, { token: "comment", next: "@pop" }],
          [/[\]]/, "comment"],
        ],
        string: [
          [/[^\\"]+/, "string"],
          [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
        ],
        stringsingle: [
          [/[^\\']+/, "string"],
          [/'/, { token: "string.quote", bracket: "@close", next: "@pop" }],
        ],
      },
    })

    // Define custom theme for FiveM development
    monaco.editor.defineTheme("fivem-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword.fivem", foreground: "#4FC3F7", fontStyle: "bold" },
        { token: "keyword.qbcore", foreground: "#81C784", fontStyle: "bold" },
        { token: "keyword.esx", foreground: "#BA68C8", fontStyle: "bold" },
        { token: "comment", foreground: "#6A9955", fontStyle: "italic" },
        { token: "string", foreground: "#CE9178" },
        { token: "number", foreground: "#B5CEA8" },
      ],
      colors: {
        "editor.background": "#1e1e1e",
        "editor.foreground": "#d4d4d4",
        "editorLineNumber.foreground": "#858585",
        "editorLineNumber.activeForeground": "#c6c6c6",
      },
    })
  }

  const configureFiveMFeatures = (editor: Monaco.editor.IStandaloneCodeEditor, monaco: typeof Monaco) => {
    // FiveM natives autocomplete
    const fivemNatives = [
      {
        label: "GetPlayerPed",
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: "GetPlayerPed(${1:playerId})",
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: "Returns the ped handle for the specified player",
        detail: "GetPlayerPed(playerId) -> Ped",
      },
      {
        label: "GetEntityCoords",
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: "GetEntityCoords(${1:entity})",
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: "Gets the coordinates of an entity",
        detail: "GetEntityCoords(entity) -> vector3",
      },
      {
        label: "CreateThread",
        kind: monaco.languages.CompletionItemKind.Function,
        insertText:
          "CreateThread(function()\n\twhile true do\n\t\tWait(${1:1000})\n\t\t${2:-- Your code here}\n\tend\nend)",
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: "Creates a new thread for continuous execution",
        detail: "CreateThread(function)",
      },
      {
        label: "RegisterNetEvent",
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: "RegisterNetEvent('${1:eventName}', function(${2:data})\n\t${3:-- Event handler code}\nend)",
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: "Registers a network event handler",
        detail: "RegisterNetEvent(eventName, handler)",
      },
      {
        label: "TriggerServerEvent",
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: "TriggerServerEvent('${1:eventName}', ${2:data})",
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: "Triggers an event on the server",
        detail: "TriggerServerEvent(eventName, ...args)",
      },
    ]

    // QBCore autocomplete
    const qbcoreCompletions = [
      {
        label: "QBCore.Functions.GetPlayer",
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: "QBCore.Functions.GetPlayer(${1:source})",
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: "Gets player data from server ID",
        detail: "QBCore.Functions.GetPlayer(source) -> Player",
      },
      {
        label: "QBCore.Commands.Add",
        kind: monaco.languages.CompletionItemKind.Function,
        insertText:
          "QBCore.Commands.Add('${1:commandName}', '${2:help}', {}, false, function(source, args)\n\t${3:-- Command logic}\nend, '${4:permission}')",
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: "Adds a new QBCore command",
        detail: "QBCore.Commands.Add(name, help, args, argsRequired, callback, permission)",
      },
    ]

    // ESX autocomplete
    const esxCompletions = [
      {
        label: "ESX.GetPlayerFromId",
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: "ESX.GetPlayerFromId(${1:source})",
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: "Gets ESX player object from server ID",
        detail: "ESX.GetPlayerFromId(source) -> xPlayer",
      },
    ]

    // Register completion providers
    monaco.languages.registerCompletionItemProvider("lua", {
      provideCompletionItems: (model, position) => {
        const suggestions = [...fivemNatives, ...qbcoreCompletions, ...esxCompletions]
        return { suggestions }
      },
    })

    // Add hover provider for documentation
    monaco.languages.registerHoverProvider("lua", {
      provideHover: (model, position) => {
        const word = model.getWordAtPosition(position)
        if (!word) return null

        const documentation = getFunctionDocumentation(word.word)
        if (!documentation) return null

        return {
          range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
          contents: [{ value: `**${word.word}**` }, { value: documentation }],
        }
      },
    })

    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: "JetBrains Mono, Consolas, Monaco, monospace",
      lineNumbers: "on",
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      wordWrap: "on",
      automaticLayout: true,
      tabSize: 4,
      insertSpaces: false,
      detectIndentation: false,
    })
  }

  const getFunctionDocumentation = (functionName: string): string | null => {
    const docs: Record<string, string> = {
      GetPlayerPed:
        "Returns the ped handle for the specified player.\n\nParameters:\n- playerId: The player ID\n\nReturns:\n- Ped: The ped handle",
      GetEntityCoords:
        "Gets the coordinates of an entity.\n\nParameters:\n- entity: The entity handle\n\nReturns:\n- vector3: The coordinates",
      CreateThread:
        "Creates a new thread for continuous execution.\n\nParameters:\n- func: The function to execute in the thread",
      RegisterNetEvent:
        "Registers a network event handler.\n\nParameters:\n- eventName: The name of the event\n- handler: The function to call when event is triggered",
      Wait: "Pauses script execution for the specified time.\n\nParameters:\n- ms: Milliseconds to wait\n\nNote: Always include Wait() in loops to prevent server freezing",
    }

    return docs[functionName] || null
  }

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        language={language}
        theme="fivem-dark"
        value={value}
        onChange={(value) => onChange(value || "")}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          fontSize: 14,
          fontFamily: "JetBrains Mono, Consolas, Monaco, monospace",
          lineNumbers: "on",
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
          tabSize: 4,
          insertSpaces: false,
          detectIndentation: false,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          parameterHints: { enabled: true },
          hover: { enabled: true },
        }}
      />
    </div>
  )
}
