import "./index.css";

function App() {
  return (
    <div className="app-container">
      <main className="main-content">
        {/* Language Selectors Control Bar */}
        <div className="control-bar">
          <div className="language-selectors">
            <div className="selector-group">
              <label>源语言</label>
              <select defaultValue="英语">
                <option>英语</option>
                <option>法语</option>
                <option>德语</option>
                <option>西班牙语</option>
                <option>日语</option>
              </select>
            </div>
            <div className="swap-button-container">
              <button className="swap-button">
                <span className="material-symbols-outlined">swap_horiz</span>
              </button>
            </div>
            <div className="selector-group">
              <label>目标语言</label>
              <select defaultValue="法语">
                <option>法语</option>
                <option>英语</option>
                <option>德语</option>
                <option>西班牙语</option>
                <option>日语</option>
              </select>
            </div>
          </div>
          
          {/* Clear Action */}
          <button className="clear-button">
            <span className="material-symbols-outlined">delete_sweep</span>
            清空
          </button>
        </div>

        {/* The Canvas: Asymmetric Translation Cells */}
        <div className="translation-cells">
          {/* Input Cell */}
          <div className="input-cell">
            <textarea placeholder="输入需要翻译的内容..."></textarea>
            <div className="cell-bottom-controls"></div>
          </div>
          
          {/* Output Cell */}
          <div className="output-cell">
            <div className="output-content">
              <p className="translated-text">
                让您的灵感在语言间自由流动。
              </p>
            </div>
            <div className="cell-bottom-controls"></div>
            {/* Intentional Asymmetry: The Kinetic Accent */}
            <div className="kinetic-accent"></div>
          </div>
        </div>

        {/* Action Area */}
        <div className="action-area">
          <button className="translate-button">
            <span className="translate-text">翻译</span>
            <div className="translate-icon">
              <span className="material-symbols-outlined">arrow_forward_ios</span>
            </div>
          </button>
        </div>
      </main>
      
      {/* Decorative Kinetic Background Elements */}
      <div className="bg-blob primary-blob"></div>
      <div className="bg-blob tertiary-blob"></div>
    </div>
  );
}

export default App;
