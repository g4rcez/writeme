export const HttpDefault = {
  language: "http",
  framework: "1.1",
};

export const HttpLanguages = [
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
    frameworks: [
      { value: "fetch", label: "Fetch" },
      { value: "axios", label: "Axios" },
      { value: "unirest", label: "unirest" },
      { value: "xhr", label: "xhr" },
    ],
    value: "node",
    alias: "javascript",
    label: "NodeJS (Server)",
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
    frameworks: [
      { value: "curl", label: "cURL" },
      { value: "httpie", label: "Httpie" },
      { value: "wget", label: "Wget" },
    ],
    value: "shell",
    label: "Shell",
  },
];
