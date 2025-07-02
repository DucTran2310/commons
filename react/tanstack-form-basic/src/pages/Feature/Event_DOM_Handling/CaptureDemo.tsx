
export default function CaptureDemo() {
  const handleCapture = (who: string) => () => {
    console.log(`[CAPTURE] ${who}`);
  };

  const handleBubble = (who: string) => () => {
    console.log(`[BUBBLE] ${who}`);
  };

  return (
    <div
      onClickCapture={handleCapture("GrandParent")}
      onClick={handleBubble("GrandParent")}
      style={{ padding: 20, backgroundColor: "#ffe4e1" }}
    >
      <div
        onClickCapture={handleCapture("Parent")}
        onClick={handleBubble("Parent")}
        style={{ padding: 20, backgroundColor: "#add8e6" }}
      >
        <div
          onClickCapture={handleCapture("Child")}
          onClick={handleBubble("Child")}
          style={{ padding: 20, backgroundColor: "#90ee90", cursor: "pointer" }}
        >
          Click Me (Child)
        </div>
      </div>
    </div>
  );
}