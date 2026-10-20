export function renderBoldText(text: string) {
  return text.split(/\*\*(.*?)\*\*/g).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="font-bold">
        {part}
      </span>
    ) : (
      part
    )
  );
}
