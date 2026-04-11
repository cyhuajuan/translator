import "./index.css";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function App() {
  return (
    <div className="app-container">
      <main className="main-content">
        {/* Language Selectors Control Bar */}
        <div className="control-bar">
          <div className="language-selectors">
            <div className="selector-group">
              <label>源语言</label>
              <Select defaultValue="英语">
                <SelectTrigger className="w-full bg-surface-container-high border-none h-14 rounded-full font-bold px-6">
                  <SelectValue placeholder="选择语言" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="英语">英语</SelectItem>
                  <SelectItem value="法语">法语</SelectItem>
                  <SelectItem value="德语">德语</SelectItem>
                  <SelectItem value="西班牙语">西班牙语</SelectItem>
                  <SelectItem value="日语">日语</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="swap-button-container">
              <Button
                variant="outline"
                size="icon"
                className="swap-button border-none"
              >
                <span className="material-symbols-outlined">swap_horiz</span>
              </Button>
            </div>
            <div className="selector-group">
              <label>目标语言</label>
              <Select defaultValue="法语">
                <SelectTrigger className="w-full bg-surface-container-high border-none h-14 rounded-full font-bold px-6">
                  <SelectValue placeholder="选择语言" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="法语">法语</SelectItem>
                  <SelectItem value="英语">英语</SelectItem>
                  <SelectItem value="德语">德语</SelectItem>
                  <SelectItem value="西班牙语">西班牙语</SelectItem>
                  <SelectItem value="日语">日语</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Action */}
          <Button
            variant="ghost"
            className="clear-button hover:bg-surface-container-high hover:text-error"
          >
            <span className="material-symbols-outlined mr-2 text-xl">
              delete_sweep
            </span>
            清空
          </Button>
        </div>

        {/* The Canvas: Asymmetric Translation Cells */}
        <div className="translation-cells">
          {/* Input Cell */}
          <div className="input-cell p-0">
            <Textarea
              placeholder="输入需要翻译的内容..."
              className="min-h-[400px] w-full resize-none border-none bg-transparent p-8 md:p-12 text-2xl md:text-3xl font-medium focus-visible:ring-0 rounded-none shadow-none"
            />
          </div>

          {/* Output Cell */}
          <div className="output-cell p-8 md:p-12">
            <div className="output-content">
              <p className="translated-text">让您的灵感在语言间自由流动。</p>
            </div>
            <div className="kinetic-accent"></div>
          </div>
        </div>

        {/* Action Area */}
        <div className="action-area">
          <Button className="translate-button h-auto hover:bg-transparent">
            <span className="translate-text">翻译</span>
            <div className="translate-icon ml-4">
              <span className="material-symbols-outlined text-sm">
                arrow_forward_ios
              </span>
            </div>
          </Button>
        </div>
      </main>

      {/* Decorative Kinetic Background Elements */}
      <div className="bg-blob primary-blob"></div>
      <div className="bg-blob tertiary-blob"></div>
    </div>
  );
}

export default App;
