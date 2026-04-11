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
import { Trash2, ArrowRight, ArrowLeftRight, Settings, Minus, Square, X } from "lucide-react";
import { getCurrentWindow } from '@tauri-apps/api/window';

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen p-6 md:p-12 box-border overflow-hidden relative pt-16">
      {/* Title Bar */}
      <div data-tauri-drag-region className="h-10 fixed top-0 left-0 right-0 z-50 flex items-center justify-between select-none backdrop-blur-sm bg-surface-container-lowest/50 border-b border-outline-variant/20">
        <div data-tauri-drag-region className="flex items-center pl-4 w-full h-full text-on-surface-variant font-bold text-xs uppercase tracking-widest pointer-events-none">
           Translator
        </div>
        <div className="flex items-center h-full">
          <div 
            className="h-full px-4 flex items-center justify-center hover:bg-surface-container-high text-on-surface-variant transition-colors cursor-pointer"
            onClick={() => getCurrentWindow().minimize()}
          >
            <Minus className="w-4 h-4" />
          </div>
          <div 
            className="h-full px-4 flex items-center justify-center hover:bg-surface-container-high text-on-surface-variant transition-colors cursor-pointer"
            onClick={() => getCurrentWindow().toggleMaximize()}
          >
            <Square className="w-3.5 h-3.5" />
          </div>
          <div 
            className="h-full px-4 flex items-center justify-center hover:bg-error hover:text-white text-on-surface-variant transition-colors cursor-pointer"
            onClick={() => getCurrentWindow().close()}
          >
            <X className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Settings Button */}
      <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 z-50">
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-surface-container-high text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-all shadow-sm border-none hover:scale-105 active:scale-95"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
      <main className="w-full max-w-[1200px] flex flex-col gap-8 z-10">
        {/* Language Selectors Control Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none min-w-[180px]">
              <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-2 ml-4">
                源语言
              </label>
              <Select defaultValue="英语">
                <SelectTrigger className="w-full bg-surface-container-high border-none h-14 rounded-full font-bold px-6 text-base text-on-surface focus:ring-2 focus:ring-primary/20 shadow-none">
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
            
            <div className="mt-6">
              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full bg-surface-container-lowest text-primary border-none shadow-[0_4px_12px_rgba(255,109,0,0.1)] hover:scale-110 active:scale-95 transition-all hover:bg-surface-container-lowest hover:text-primary"
              >
                <ArrowLeftRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="relative flex-1 md:flex-none min-w-[180px]">
              <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-2 ml-4">
                目标语言
              </label>
              <Select defaultValue="法语">
                <SelectTrigger className="w-full bg-surface-container-high border-none h-14 rounded-full font-bold px-6 text-base text-on-surface focus:ring-2 focus:ring-primary/20 shadow-none">
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
            className="flex items-center gap-2 text-on-surface-variant font-bold uppercase tracking-[0.1em] h-14 px-8 text-sm bg-surface-container-high rounded-full border-none hover:bg-surface-container-high hover:text-error transition-colors"
          >
            <Trash2 className="w-5 h-5 mr-1" />
            清空
          </Button>
        </div>

        {/* The Canvas: Asymmetric Translation Cells */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-outline-variant/20 rounded-[2rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(45,35,26,0.1)]">
          {/* Input Cell */}
          <div className="bg-surface-container-low p-8 md:p-12 relative flex flex-col min-h-[400px]">
            <Textarea
              placeholder="输入需要翻译的内容..."
              className="min-h-[400px] w-full resize-none border-none bg-transparent p-0 text-base md:text-lg font-medium focus-visible:ring-0 rounded-none shadow-none text-on-surface placeholder:text-on-surface-variant/30 leading-relaxed"
            />
          </div>

          {/* Output Cell */}
          <div className="bg-surface-container-lowest p-8 md:p-12 relative flex flex-col min-h-[400px]">
            <div className="flex-1">
              <p className="text-primary font-extrabold italic tracking-tight leading-tight text-base md:text-lg selection:bg-primary selection:text-white m-0">
                让您的灵感在语言间自由流动。
              </p>
            </div>
            {/* Intentional Asymmetry: The Kinetic Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full pointer-events-none"></div>
          </div>
        </div>

        {/* Action Area */}
        <div className="flex justify-center -mt-12 relative z-10">
          <Button 
            className="group flex items-center gap-4 bg-gradient-to-tr from-primary to-primary-container text-white h-auto py-5 px-16 md:px-20 rounded-full shadow-[0_12px_40px_rgba(255,109,0,0.4)] hover:scale-105 active:scale-95 transition-all min-w-[240px] border-none hover:opacity-90"
          >
            <span className="text-lg font-black uppercase tracking-[0.2em]">翻译</span>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 group-hover:bg-white/40 transition-colors ml-2">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Button>
        </div>
      </main>

      {/* Decorative Kinetic Background Elements */}
      <div className="fixed -top-20 -left-20 w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
      <div className="fixed -bottom-20 -right-20 w-[30vw] h-[30vw] bg-tertiary/5 rounded-full blur-[80px] -z-10"></div>
    </div>
  );
}

export default App;
