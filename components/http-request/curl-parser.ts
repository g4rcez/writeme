// extract from https://github.com/Kong/insomnia
import { ControlOperator, parse, ParseEntry } from "shell-quote";

export type Comment = {
  comment?: string;
};

export type Variable = `{{ ${string} }}`;

export type Authentication = Comment & {
  authorizationUrl?: string;
  accessTokenUrl?: string;
  clientId?: string;
  clientSecret?: Variable;
  scope?: string;
  type?: "basic" | "oauth2";
  grantType?: "authorization_code" | "password" | "client_credentials";
  disabled?: boolean;
  username?: string;
  password?: string;
};

export type Parameter = Comment & {
  name: string;
  value?: string;
  filename?: string;
  fileName?: string;
  type?: "file" | string;
};

export type Body =
  | string
  | {
      mimeType?: string;
      text?: string;
      params?: Parameter[];
    };

export type Cookie = {
  name: string;
  value: string;
};

export type Header = Comment & {
  name: "Cookie" | "Content-Type" | string;
  disabled?: boolean;
  value: string;
};

export type PostData = {
  params?: Parameter[];
  mimeType?: string;
  text?: string;
};

export type QueryString = Comment & {
  name: string;
};

export type ImportRequestType =
  | "environment"
  | "request"
  | "request_group"
  | "workspace";

export type ImportRequest<T extends {} = {}> = Comment & {
  _id?: string;
  _type?: ImportRequestType;
  authentication?: Authentication;
  body?: Body;
  cookies?: Cookie[];
  environment?: Record<string, string>;
  headers?: Header[];
  httpVersion?: string;
  method?: string;
  name?: string;
  data?: T;
  description?: string;
  parentId?: string | null;
  postData?: PostData;
  variable?: any;
  queryString?: Parameter[];
  url?: string;
};

export type Converter<T extends {} = {}> = (
  rawData: string
) => ImportRequest<T> | ImportRequest<T> | null;

export type Importer = {
  id: string;
  name: string;
  description: string;
  convert: Converter;
};

const SUPPORTED_ARGS = [
  "url",
  "u",
  "user",
  "header",
  "H",
  "cookie",
  "b",
  "get",
  "G",
  "d",
  "data",
  "data-raw",
  "data-urlencode",
  "data-binary",
  "data-ascii",
  "form",
  "F",
  "request",
  "X",
];

type Pair = string | boolean;

interface PairsByName {
  [name: string]: Pair[];
}

const importCommand = (parseEntries: ParseEntry[]): ImportRequest => {
  // ~~~~~~~~~~~~~~~~~~~~~ //
  // Collect all the flags //
  // ~~~~~~~~~~~~~~~~~~~~~ //
  const pairsByName: PairsByName = {};
  const singletons: ParseEntry[] = [];

  // Start at 1 so we can skip the ^curl part
  parseEntries.forEach((parseEntry, i) => {
    if (typeof parseEntry === "string" && parseEntry.match(/^-{1,2}[\w-]+/)) {
      const isSingleDash = parseEntry[0] === "-" && parseEntry[1] !== "-";
      let name = parseEntry.replace(/^-{1,2}/, "");

      if (!SUPPORTED_ARGS.includes(name)) {
        return;
      }

      let value;
      const nextEntry = parseEntries[i + 1];
      if (isSingleDash && name.length > 1) {
        // Handle squished arguments like -XPOST
        value = name.slice(1);
        name = name.slice(0, 1);
      } else if (typeof nextEntry === "string" && !nextEntry.startsWith("-")) {
        // Next arg is not a flag, so assign it as the value
        value = nextEntry;
        i++; // Skip next one
      } else {
        value = true;
      }

      if (!pairsByName[name]) {
        pairsByName[name] = [value];
      } else {
        pairsByName[name].push(value);
      }
    } else if (parseEntry) {
      singletons.push(parseEntry);
    }
  });

  // ~~~~~~~~~~~~~~~~~ //
  // Build the request //
  // ~~~~~~~~~~~~~~~~~ //

  /// /////// Url & parameters //////////
  let parameters: Parameter[] = [];
  let url =
    (singletons.find((x) => `${x}`.match(/^https?:\/\//)) as string) ?? "";

  try {
    const { searchParams, href, search } = new URL(url);
    parameters = Array.from(searchParams.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  } catch (error) {}

  /// /////// Authentication //////////
  const [username, password] = getPairValue(pairsByName, "", [
    "u",
    "user",
  ]).split(/:(.*)$/);

  const authentication = username
    ? {
        username: username.trim(),
        password: password.trim(),
      }
    : {};

  /// /////// Headers //////////
  const headers = [
    ...((pairsByName.header as string[] | undefined) || []),
    ...((pairsByName.H as string[] | undefined) || []),
  ].map((header) => {
    const [name, value] = header.split(/:(.*)$/);
    return {
      name: name.trim(),
      value: value.trim(),
    };
  });

  /// /////// Cookies //////////
  const cookieHeaderValue = [
    ...((pairsByName.cookie as string[] | undefined) || []),
    ...((pairsByName.b as string[] | undefined) || []),
  ]
    .map((str) => {
      const name = str.split("=", 1)[0];
      const value = str.replace(`${name}=`, "");
      return `${name}=${value}`;
    })
    .join("; ");

  // Convert cookie value to header
  const existingCookieHeader = headers.find(
    (header) => header.name.toLowerCase() === "cookie"
  );

  if (cookieHeaderValue && existingCookieHeader) {
    // Has existing cookie header, so let's update it
    existingCookieHeader.value += `; ${cookieHeaderValue}`;
  } else if (cookieHeaderValue) {
    // No existing cookie header, so let's make a new one
    headers.push({
      name: "Cookie",
      value: cookieHeaderValue,
    });
  }

  /// /////// Body (Text or Blob) //////////
  let textBodyParams: Pair[] = [];
  const paramNames = [
    "d",
    "data",
    "data-raw",
    "data-urlencode",
    "data-binary",
    "data-ascii",
  ];

  for (const paramName of paramNames) {
    const pair = pairsByName[paramName];

    if (pair && pair.length) {
      textBodyParams = textBodyParams.concat(pair);
    }
  }

  // join params to make body
  const textBody = textBodyParams.join("&");
  const contentTypeHeader = headers.find(
    (header) => header.name.toLowerCase() === "content-type"
  );
  const mimeType = contentTypeHeader
    ? contentTypeHeader.value.split(";")[0]
    : null;

  /// /////// Body (Multipart Form Data) //////////
  const formDataParams = [
    ...((pairsByName.form as string[] | undefined) || []),
    ...((pairsByName.F as string[] | undefined) || []),
  ].map((str) => {
    const [name, value] = str.split("=");
    const item: Parameter = {
      name,
    };

    if (value.indexOf("@") === 0) {
      item.fileName = value.slice(1);
      item.type = "file";
    } else {
      item.value = value;
      item.type = "text";
    }

    return item;
  });

  /// /////// Body //////////
  const body: PostData = mimeType ? { mimeType } : {};
  const bodyAsGET = getPairValue(pairsByName, false, ["G", "get"]);

  if (textBody && bodyAsGET) {
    const bodyParams = textBody.split("&").map((v) => {
      const [name, value] = v.split("=");
      return {
        name: name || "",
        value: value || "",
      };
    });
    parameters.push(...bodyParams);
  } else if (textBody && mimeType === "application/x-www-form-urlencoded") {
    body.params = textBody.split("&").map((v) => {
      const [name, value] = v.split("=");
      return {
        name: name || "",
        value: value || "",
      };
    });
  } else if (textBody) {
    body.text = textBody;
    body.mimeType = mimeType || "";
  } else if (formDataParams.length) {
    body.params = formDataParams;
    body.mimeType = mimeType || "multipart/form-data";
  }

  /// /////// Method //////////
  let method = getPairValue(pairsByName, "__UNSET__", [
    "X",
    "request",
  ]).toUpperCase();

  if (method === "__UNSET__") {
    method = body.text || body.params ? "POST" : "GET";
  }

  const urlSearchParams = new URLSearchParams(url);
  const qs = Array.from(urlSearchParams.keys()).reduce(
    (acc, el) => ({ ...acc, [el]: urlSearchParams.get(el) }),
    {}
  );

  return {
    _type: "request",
    name: url,
    queryString: parameters,
    url: url,
    method: method.toUpperCase(),
    headers,
    authentication,
    body,
  };
};

const getPairValue = <T extends string | boolean>(
  parisByName: PairsByName,
  defaultValue: T,
  names: string[]
) => {
  for (const name of names) {
    if (parisByName[name] && parisByName[name].length) {
      return parisByName[name][0] as T;
    }
  }

  return defaultValue;
};

export const convert: Converter = (rawData) => {
  if (!rawData.match(/^\s*curl /)) {
    return null;
  }

  // Parse the whole thing into one big tokenized list
  const parseEntries = parse(rawData);

  // ~~~~~~~~~~~~~~~~~~~~~~ //
  // Aggregate the commands //
  // ~~~~~~~~~~~~~~~~~~~~~~ //
  const commands: ParseEntry[][] = [];

  let currentCommand: ParseEntry[] = [];

  parseEntries.forEach((parseEntry) => {
    if (typeof parseEntry === "string") {
      if (parseEntry.startsWith("$")) {
        currentCommand.push(parseEntry.slice(1, Infinity));
      } else {
        currentCommand.push(parseEntry);
      }
      return;
    }

    if ((parseEntry as { comment: string }).comment) {
      return;
    }

    const { op } = parseEntry as
      | { op: "glob"; pattern: string }
      | { op: ControlOperator };

    // `;` separates commands
    if (op === ";") {
      commands.push(currentCommand);
      currentCommand = [];
      return;
    }

    if (op?.startsWith("$")) {
      // Handle the case where literal like -H $'Header: \'Some Quoted Thing\''
      const str = op.slice(2, op.length - 1).replace(/\\'/g, "'");

      currentCommand.push(str);
      return;
    }

    if (op === "glob") {
      currentCommand.push(
        (parseEntry as { op: "glob"; pattern: string }).pattern
      );
      return;
    }
  });

  // Push the last unfinished command

  return [...commands, currentCommand]
    .filter((command) => command[0] === "curl")
    .map(importCommand)[0]!;
};
