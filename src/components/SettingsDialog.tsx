import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSettings, DEFAULT_SYSTEM_PROMPT, type TranslationService } from "@/hooks/useSettings";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { settings, updateSetting } = useSettings();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-surface-container-lowest/90 backdrop-blur-xl border-outline-variant/30 text-on-surface p-0 overflow-hidden shadow-2xl rounded-[2rem]">
        <div className="p-6 pb-4 bg-surface-container-lowest/50 border-b border-outline-variant/10">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-widest text-primary">偏好设置</DialogTitle>
            <DialogDescription className="text-on-surface-variant text-sm font-medium">
              自定义您的多语言流体验。
            </DialogDescription>
          </DialogHeader>
        </div>

        <Tabs defaultValue="translation" className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-3 bg-surface-container-high/50 p-1 rounded-full">
              <TabsTrigger value="translation" className="rounded-full font-bold data-[state=active]:bg-primary data-[state=active]:text-white">翻译</TabsTrigger>
              <TabsTrigger value="prompt" className="rounded-full font-bold data-[state=active]:bg-primary data-[state=active]:text-white">提示词</TabsTrigger>
              <TabsTrigger value="advanced" className="rounded-full font-bold data-[state=active]:bg-primary data-[state=active]:text-white">高级</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[420px] w-full">
            <div className="p-6">
              {/* 翻译设置 */}
            <TabsContent value="translation" className="space-y-6 m-0 animate-in fade-in-50 zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold">默认源语言</Label>
                  <p className="text-xs text-on-surface-variant">启动时的起始语言。</p>
                </div>
                <Select
                  value={settings.defaultSourceLang}
                  onValueChange={(value) => updateSetting("defaultSourceLang", value as string)}
                >
                  <SelectTrigger className="w-[140px] rounded-full border-none bg-surface-container-high focus:ring-2 focus:ring-primary/20 shadow-none font-bold">
                    <SelectValue placeholder="选择语言" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="中文">中文</SelectItem>
                    <SelectItem value="英文">英文</SelectItem>
                    <SelectItem value="日文">日文</SelectItem>
                    <SelectItem value="韩文">韩文</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold">默认目标语言</Label>
                  <p className="text-xs text-on-surface-variant">启动时的目标语言。</p>
                </div>
                <Select
                  value={settings.defaultTargetLang}
                  onValueChange={(value) => updateSetting("defaultTargetLang", value as string)}
                >
                  <SelectTrigger className="w-[140px] rounded-full border-none bg-surface-container-high focus:ring-2 focus:ring-primary/20 shadow-none font-bold">
                    <SelectValue placeholder="选择语言" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="中文">中文</SelectItem>
                    <SelectItem value="英文">英文</SelectItem>
                    <SelectItem value="日文">日文</SelectItem>
                    <SelectItem value="韩文">韩文</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* 系统提示词设置 */}
            <TabsContent value="prompt" className="space-y-5 m-0 animate-in fade-in-50 zoom-in-95 duration-200">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold">系统提示词模板</Label>
                    <p className="text-xs text-on-surface-variant">自定义发送给 AI 的系统级指令。</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateSetting("systemPrompt", DEFAULT_SYSTEM_PROMPT)}
                    className="rounded-full text-xs font-bold h-8 text-on-surface-variant hover:text-primary"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    恢复默认
                  </Button>
                </div>
                <Textarea
                  value={settings.systemPrompt}
                  onChange={(e) => updateSetting("systemPrompt", e.target.value)}
                  placeholder="输入系统提示词..."
                  rows={6}
                  className="resize-none border-none bg-surface-container-high rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-primary shadow-none leading-relaxed"
                />
              </div>

              <div className="bg-surface-container-high/50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-on-surface-variant">可用变量</p>
                <div className="flex flex-wrap gap-2">
                  <code className="text-xs bg-primary/10 text-primary font-bold px-2.5 py-1 rounded-full">{'{{sourceLang}}'}</code>
                  <span className="text-xs text-on-surface-variant self-center">— 源语言英文名 (如 Chinese)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <code className="text-xs bg-primary/10 text-primary font-bold px-2.5 py-1 rounded-full">{'{{targetLang}}'}</code>
                  <span className="text-xs text-on-surface-variant self-center">— 目标语言英文名 (如 English)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <code className="text-xs bg-primary/10 text-primary font-bold px-2.5 py-1 rounded-full">{'{{sourceLangCode}}'}</code>
                  <span className="text-xs text-on-surface-variant self-center">— 源语言代码 (如 zh-CN)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <code className="text-xs bg-primary/10 text-primary font-bold px-2.5 py-1 rounded-full">{'{{targetLangCode}}'}</code>
                  <span className="text-xs text-on-surface-variant self-center">— 目标语言代码 (如 en)</span>
                </div>
              </div>
            </TabsContent>

            {/* 翻译服务设置 */}
            <TabsContent value="advanced" className="space-y-4 m-0 animate-in fade-in-50 zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold">翻译服务</Label>
                  <p className="text-xs text-on-surface-variant">管理符合 OpenAI 会话规范的服务配置。</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    const newId = "service-" + Date.now();
                    updateSetting("services", [
                      ...settings.services,
                      { id: newId, name: "新服务", apiUrl: "https://api.openai.com/v1/chat/completions", apiKey: "", model: "gpt-3.5-turbo" }
                    ]);
                    updateSetting("activeServiceId", newId);
                  }}
                  className="rounded-full shadow-sm text-xs font-bold h-8"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  新建配置
                </Button>
              </div>

              <div className="flex flex-col space-y-3">
                <Select
                  value={settings.activeServiceId || ""}
                  onValueChange={(value) => updateSetting("activeServiceId", value)}
                >
                  <SelectTrigger className="w-full rounded-xl border-none bg-surface-container-high focus:ring-2 focus:ring-primary/20 shadow-none font-bold">
                    <SelectValue 
                      key={settings.services.find(s => s.id === settings.activeServiceId)?.name}
                      placeholder="选择一个翻译服务..."
                    >
                      {settings.services.find(s => s.id === settings.activeServiceId)?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {settings.services.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {settings.activeServiceId && settings.services.find(s => s.id === settings.activeServiceId) && (() => {
                  const activeService = settings.services.find(s => s.id === settings.activeServiceId)!;
                  const updateActive = (update: Partial<TranslationService>) => {
                    updateSetting(
                      "services",
                      settings.services.map((s) => (s.id === activeService.id ? { ...s, ...update } : s))
                    );
                  };

                  return (
                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 space-y-3 relative mt-2">
                       <div className="absolute top-2 right-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-8 h-8 rounded-full text-error hover:bg-error/10 hover:text-error transition-colors"
                          onClick={() => {
                            const newServices = settings.services.filter(s => s.id !== activeService.id);
                            updateSetting("services", newServices);
                            updateSetting("activeServiceId", newServices.length > 0 ? newServices[0].id : null);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-1 pr-10">
                        <Label className="text-xs text-on-surface-variant font-bold leading-none">配置名称</Label>
                        <Input 
                          value={activeService.name} 
                          onChange={(e) => updateActive({ name: e.target.value })} 
                          className="h-8 text-sm focus-visible:ring-1 focus-visible:ring-primary border-none shadow-none bg-surface-container-high rounded-lg mt-1"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-on-surface-variant font-bold leading-none">API Base URL</Label>
                        <Input 
                          value={activeService.apiUrl} 
                          onChange={(e) => updateActive({ apiUrl: e.target.value })} 
                          placeholder="https://api.openai.com/v1"
                          className="h-8 text-sm focus-visible:ring-1 focus-visible:ring-primary border-none shadow-none bg-surface-container-high rounded-lg mt-1"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-on-surface-variant font-bold leading-none">API Key</Label>
                        <Input 
                          type="password"
                          value={activeService.apiKey} 
                          onChange={(e) => updateActive({ apiKey: e.target.value })} 
                          placeholder="sk-..."
                          className="h-8 text-sm focus-visible:ring-1 focus-visible:ring-primary border-none shadow-none bg-surface-container-high rounded-lg mt-1"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-on-surface-variant font-bold leading-none">模型名称 (Model)</Label>
                        <Input 
                          value={activeService.model} 
                          onChange={(e) => updateActive({ model: e.target.value })} 
                          placeholder="gpt-3.5-turbo"
                          className="h-8 text-sm focus-visible:ring-1 focus-visible:ring-primary border-none shadow-none bg-surface-container-high rounded-lg mt-1"
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>
            </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
