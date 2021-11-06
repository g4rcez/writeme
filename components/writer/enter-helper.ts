const CHECKBOX = "- [ ] ";
const CHECKBOXES = ["- [x] ", "- [X] ", "- [ ] ", "- [] "];

export const EnterHelper = (textarea: HTMLTextAreaElement, event: any) => {
  let begin: string = "";
  let caret: number;
  let check: boolean;
  let first: string;
  let input: string;
  let label: string = "";
  let lines: string[];
  let prior: string;
  let range: any;
  let start: number;
  let state: number;
  let value: string;
  let width: number;
  if (event.key === "Enter") {
    check = false;
    input = textarea.value.replace(/\r\n/g, "\n");
    if (textarea.selectionStart) {
      start = textarea.selectionStart;
    } else {
      textarea.focus();
      range = (group as any).selection.createRange();
      range.moveStart("character", -input.length);
      start = range.text.replace(/\r\n/g, "\n").length;
    }
    lines = input.split("\n");
    state = input.substr(0, start).split("\n").length;
    value = lines[state - 1].replace(/^\s+/, "");
    first = value.substr(0, 2);
    const checkboxIndex = CHECKBOXES.findIndex((x) => value.startsWith(x));
    if (["* ", "+ ", "- ", "> "].indexOf(first) >= 0) {
      begin = label = first;
      check = true;
    }
    if (checkboxIndex > -1) {
      begin = CHECKBOX; //CHECKBOXES[checkboxIndex];
      label = CHECKBOX; //CHECKBOXES[checkboxIndex];
      first = CHECKBOX; //CHECKBOXES[checkboxIndex];
      check = true;
    }
    if (new RegExp("^[0-9]+[.] (.*)$").test(value)) {
      prior = value.substr(0, value.indexOf(". "));
      begin = prior + ". ";
      label = parseInt(prior, 10) + 1 + ". ";
      check = true;
    }
    if (value && !check && lines[state - 1].substr(0, 4) === "    ") {
      begin = label = "    ";
      check = true;
    }
    if (check) {
      width = lines[state - 1].indexOf(begin);
      if (value.replace(/^\s+/, "") === begin) {
        textarea.value =
          input.substr(0, start - 1 - width - label.length) +
          "\n\n" +
          input.substr(start, input.length);
        caret = start + 1 - label.length - width;
      } else {
        textarea.value =
          input.substr(0, start) +
          "\n" +
          new Array(width + 1).join(" ") +
          label.replace("\n", "") +
          input.substr(start, input.length).trim();
        caret = start + 1 + label.length + width;
      }
      if (textarea.selectionStart) {
        textarea.setSelectionRange(caret, caret);
        textarea.rows += 1;
        textarea.style.height = `${textarea.scrollHeight}px`;
      } else {
        range = (textarea as any).createTextRange();
        range.move("character", caret);
        range.select();
      }
      event.preventDefault();
      return false;
    }
  }
};
