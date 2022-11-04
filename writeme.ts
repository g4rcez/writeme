import { config } from "src/writemerc";

export default config({
  title: "writeme",
  strategy: "fs",
  defaultRepository: "https://github.com/g4rcez/writeme",
  requestVariables: {
    host: "https://writeme.vercel.app",
  },
});
