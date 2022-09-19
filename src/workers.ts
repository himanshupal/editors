import { languages, editor, Uri } from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

self.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    switch (label) {
      case "json":
        return new jsonWorker();
      case "css":
      case "less":
      case "scss":
        return new cssWorker();
      case "html":
      case "razor":
      case "handlebars":
        return new htmlWorker();
      case "javascript":
      case "typescript":
        return new tsWorker();
      default:
        return new editorWorker();
    }
  },
};

languages.typescript.typescriptDefaults.setEagerModelSync(true);

// Register myCustomLaguage

languages.register({
  id: "myCustomLanguage",
});

languages.setMonarchTokensProvider("myCustomLanguage", {
  tokenizer: {
    root: [
      [/\[error.*/, "custom-error"],
      [/\[notice.*/, "custom-notice"],
      [/\[info.*/, "custom-info"],
      [/\[[a-zA-Z 0-9:]+\]/, "custom-date"],
    ],
  },
});

// Define a new theme that constains only rules that match this language
editor.defineTheme("myCoolTheme", {
  colors: {},
  base: "vs",
  inherit: false,
  rules: [
    { token: "custom-info", foreground: "808080" },
    { token: "custom-error", foreground: "ff0000", fontStyle: "bold" },
    { token: "custom-notice", foreground: "FFA500" },
    { token: "custom-date", foreground: "008800" },
  ],
});

// Register Solidity

export const SolidityId = "solidity";

languages.register({
  id: SolidityId,
  extensions: ["*.sol"],
  aliases: [SolidityId, "Solidity"],
  configuration: Uri.file("./solidity-config.jsonc"),
  firstLine: "// SPDX-License-Identifier: *",
});

languages.setMonarchTokensProvider(SolidityId, {
  defaultToken: "invalid",
  tokenPostfix: ".sol",
  keywords: [
    "let",
    "constant",
    "assembly",
    "require",
    "assert",
    "revert",
    "selfdestruct",
    "suicide",
    "addmod",
    "addmul",
    "keccak256",
    "sha256",
    "sha3",
    "ripemd160",
    "ecrecover",
    "unicode",
    "blockhash",
    "gasleft",
    "type",
    "mapping",
    "using",
    "from",
    "import",
    "pragma",
    "unchecked",
    "new",
    "delete",
    "emit",
    "return",
    "returns",
    "if",
    "else",
    "for",
    "while",
    "do",
    "break",
    "continue",
    "try",
    "catch",
    "finally",
    "throw",
    "return",
    "prag",
    "seconds",
    "minutes",
    "hours",
    "days",
    "weeks",
    "years",
    "ether",
    "wei",
    "finney",
    "szabo",
    "address",
    "string",
    "bytes",
    "int",
    "uint",
    "bool",
    "hash",
    "this",
    "super",
    "abi",
    "msg",
    "sender",
    "block",
    "tx",
    "now",
    "gasprice",
    "sig",
    "value",
    "data",
    "internal",
    "external",
    "private",
    "public",
    "nonpayable",
    "payable",
    "immutable",
    "pure",
    "view",
    "inherited",
    "indexed",
    "storage",
    "memory",
    "virtual",
    "calldata",
    "override",
    "abstract",
    "function",
    "interface",
    "struct",
    "event",
  ],
  operators: [
    "<=",
    ">=",
    "==",
    "!=",
    "===",
    "!==",
    "=>",
    "+",
    "-",
    "**",
    "*",
    "/",
    "%",
    "++",
    "--",
    "<<",
    "</",
    ">>",
    ">>>",
    "&",
    "|",
    "^",
    "!",
    "~",
    "&&",
    "||",
    "??",
    "?",
    ":",
    "=",
    "+=",
    "-=",
    "*=",
    "**=",
    "/=",
    "%=",
    "<<=",
    ">>=",
    ">>>=",
    "&=",
    "|=",
    "^=",
    "@",
  ],

  // we include these common regular expressions
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+(_+\d+)*/,
  octaldigits: /[0-7]+(_+[0-7]+)*/,
  binarydigits: /[0-1]+(_+[0-1]+)*/,
  hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

  regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
  regexpesc: /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,

  // The main tokenizer for our languages
  tokenizer: {
    root: [[/[{}]/, "delimiter.bracket"], { include: "common" }],

    common: [
      // identifiers and keywords
      [
        /[a-z_$][\w$]*/,
        {
          cases: {
            "@keywords": "keyword",
            "@default": "identifier",
          },
        },
      ],
      [/[A-Z][\w\$]*/, "type.identifier"], // to show class names nicely
      // [/[A-Z][\w\$]*/, 'identifier'],

      // whitespace
      { include: "@whitespace" },

      // regular expression: ensure it is terminated before beginning (otherwise it is an opeator)
      [/\/(?=([^\\\/]|\\.)+\/([dgimsuy]*)(\s*)(\.|;|,|\)|\]|\}|$))/, { token: "regexp", bracket: "@open", next: "@regexp" }],

      // delimiters and operators
      [/[()\[\]]/, "@brackets"],
      [/[<>](?!@symbols)/, "@brackets"],
      [/!(?=([^=]|$))/, "delimiter"],
      [
        /@symbols/,
        {
          cases: {
            "@operators": "delimiter",
            "@default": "",
          },
        },
      ],

      // numbers
      [/(@digits)[eE]([\-+]?(@digits))?/, "number.float"],
      [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, "number.float"],
      [/0[xX](@hexdigits)n?/, "number.hex"],
      [/0[oO]?(@octaldigits)n?/, "number.octal"],
      [/0[bB](@binarydigits)n?/, "number.binary"],
      [/(@digits)n?/, "number"],

      // delimiter: after number because of .\d floats
      [/[;,.]/, "delimiter"],

      // strings
      [/"([^"\\]|\\.)*$/, "string.invalid"], // non-teminated string
      [/'([^'\\]|\\.)*$/, "string.invalid"], // non-teminated string
      [/"/, "string", "@string_double"],
      [/'/, "string", "@string_single"],
      [/`/, "string", "@string_backtick"],
    ],

    whitespace: [
      [/[ \t\r\n]+/, ""],
      [/\/\*\*(?!\/)/, "comment.doc", "@jsdoc"],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"],
    ],

    comment: [
      [/[^\/*]+/, "comment"],
      [/\*\//, "comment", "@pop"],
      [/[\/*]/, "comment"],
    ],

    jsdoc: [
      [/[^\/*]+/, "comment.doc"],
      [/\*\//, "comment.doc", "@pop"],
      [/[\/*]/, "comment.doc"],
    ],

    // We match regular expression quite precisely
    regexp: [
      [/(\{)(\d+(?:,\d*)?)(\})/, ["regexp.escape.control", "regexp.escape.control", "regexp.escape.control"]],
      // @ts-ignore
      [/(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/, ["regexp.escape.control", { token: "regexp.escape.control", next: "@regexrange" }]],
      [/(\()(\?:|\?=|\?!)/, ["regexp.escape.control", "regexp.escape.control"]],
      [/[()]/, "regexp.escape.control"],
      [/@regexpctl/, "regexp.escape.control"],
      [/[^\\\/]/, "regexp"],
      [/@regexpesc/, "regexp.escape"],
      [/\\\./, "regexp.invalid"],
      // @ts-ignore
      [/(\/)([dgimsuy]*)/, [{ token: "regexp", bracket: "@close", next: "@pop" }, "keyword.other"]],
    ],

    regexrange: [
      [/-/, "regexp.escape.control"],
      [/\^/, "regexp.invalid"],
      [/@regexpesc/, "regexp.escape"],
      [/[^\]]/, "regexp"],
      [
        /\]/,
        {
          token: "regexp.escape.control",
          next: "@pop",
          bracket: "@close",
        },
      ],
    ],

    string_double: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, "string", "@pop"],
    ],

    string_single: [
      [/[^\\']+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/'/, "string", "@pop"],
    ],

    string_backtick: [
      [/\$\{/, { token: "delimiter.bracket", next: "@bracketCounting" }],
      [/[^\\`$]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/`/, "string", "@pop"],
    ],

    bracketCounting: [[/\{/, "delimiter.bracket", "@bracketCounting"], [/\}/, "delimiter.bracket", "@pop"], { include: "common" }],
  },
});

editor.defineTheme(SolidityId, {
  colors: {},
  base: "vs-dark",
  inherit: true,
  rules: [{ token: "interface", foreground: "#ff00ff", fontStyle: "bold" }],
});
