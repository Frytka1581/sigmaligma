export default function Welcome({ onContinue }) {
    let name = "";
  
    return (
      <div style={{ padding: 50, textAlign: "center" }}>
        <h1>Welcome to Blef</h1>
        <p>Enter your name to get started</p>
  
        <input
          placeholder="Your name"
          onChange={(e) => name = e.target.value}
          style={{ padding: 12, width: "300px", borderRadius: 8 }}
        />
  
        <br /><br />
  
        <button
          onClick={() => onContinue(name)}
          style={{ padding: "12px 40px", background: "lightgreen", border: 0, borderRadius: 8 }}
        >
          Continue
        </button>
      </div>
    );
  }
  