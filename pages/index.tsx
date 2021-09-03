import { Http } from "components/http-request/http";
import { useState } from "react";
export default function Home() {
  const [curl, setCurl] = useState("");
  return (
    <div>
      <input
        name="curl"
        value={curl}
        className="w-full border border-gray-500 rounded-lg p-2 text-lg"
        placeholder="curl command..."
        onChange={(e) => setCurl(e.target.value)}
      />
      <Http curl={curl} />
    </div>
  );
}
