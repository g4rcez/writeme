export const HttpLanguages = [
  {
    frameworks: [{ value: "libcurl", label: "Libcurl" }],
    alias: "text/x-csrc",
    value: "c",
    label: "C",
  },
  {
    frameworks: [{ value: "clj_http", label: "Clj Http" }],
    value: "clojure",
    label: "Clojure",
  },
  {
    frameworks: [
      { value: "restsharp", label: "Rest Sharp" },
      { value: "httpclient", label: "Http Client" },
    ],
    value: "csharp",
    alias: "text/x-csharp",
    label: "C#",
  },
  {
    frameworks: [{ value: "native", label: "Native" }],
    value: "go",
    label: "Go",
  },
  {
    frameworks: [{ value: "1.1", label: "Http 1.1" }],
    value: "http",
    label: "Http",
  },
  {
    frameworks: [
      { value: "okhttp", label: "OK Http" },
      { value: "unirest", label: "UniRest" },
      { value: "asynchttp", label: "Async Http" },
      { value: "nethttp", label: "Net Http" },
    ],
    alias: "text/x-java",
    value: "java",
    label: "Java",
  },
  {
    frameworks: [
      { value: "fetch", label: "Fetch" },
      { value: "axios", label: "Axios" },
      { value: "jquery", label: "jQuery" },
      { value: "xhr", label: "xhr" },
    ],
    value: "javascript",
    label: "Javascript (Browser)",
  },
  {
    frameworks: [{ value: "okhttp", label: "okhttp" }],
    alias: "text/x-java",
    value: "kotlin",
    label: "Kotlin",
  },
  {
    frameworks: [
      { value: "fetch", label: "Fetch" },
      { value: "axios", label: "Axios" },
      { value: "jquery", label: "jQuery" },
      { value: "unirest", label: "unirest" },
      { value: "xhr", label: "xhr" },
    ],
    value: "node",
    alias: "javascript",
    label: "NodeJS (Server)",
  },
  {
    frameworks: [{ value: "nsurlsession", label: "NSUrlSession" }],
    value: "objc",
    alias: "text/x-objectivec",
    label: "Objective C",
  },
  {
    frameworks: [{ value: "cohttp", label: "coHTTP" }],
    value: "ocaml",
    label: "Ocaml",
  },
  {
    frameworks: [
      { value: "curl", label: "cURL" },
      { value: "http1", label: "Http 1" },
      { value: "http2", label: "Http 2" },
    ],
    value: "php",
    label: "PHP",
  },
  {
    frameworks: [
      { value: "webrequest", label: "Web Request" },
      { value: "restmethod", label: "Rest Method" },
    ],
    value: "powershell",
    label: "Powershell",
  },
  {
    frameworks: [
      { value: "python3", label: "python3" },
      { value: "requests", label: "requests" },
    ],
    value: "python",
    label: "Python",
  },
  {
    frameworks: [{ value: "httr", label: "HTTR" }],
    value: "r",
    label: "R",
  },
  {
    frameworks: [{ value: "native", label: "Native" }],
    value: "ruby",
    label: "Ruby",
  },
  {
    frameworks: [
      { value: "curl", label: "cURL" },
      { value: "httpie", label: "Httpie" },
      { value: "wget", label: "Wget" },
    ],
    value: "shell",
    label: "Shell",
  },
  {
    frameworks: [{ value: "nsurlsession", label: "NSUrlSession" }],
    value: "swift",
    label: "Swift",
  },
];
