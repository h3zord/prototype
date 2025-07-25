export function TruncatedText({ text = "", maxLength = 10 }) {
  const shouldTruncate = text.length > maxLength;
  const displayText = shouldTruncate ? text.slice(0, maxLength) + "..." : text;

  return <span title={shouldTruncate ? text : ""}>{displayText}</span>;
}
