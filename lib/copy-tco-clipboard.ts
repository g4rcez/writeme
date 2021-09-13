export const copyToClipboard = async (str: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(str);
  } catch (error) {
    const selected = document.getSelection()!.rangeCount > 0 ? document.getSelection()!.getRangeAt(0) : false;
    const el = document.createElement("textarea");
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.value = str;
    el.focus();
    el.select();
    document.execCommand("copy");
    if (selected) {
      document.getSelection()!.removeAllRanges();
      document.getSelection()!.addRange(selected);
    }
    document.body.removeChild(el);
  }
};
