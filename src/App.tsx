import { Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Transaction from "@/pages/Transaction";
import Report from "@/pages/Report";
import TransactionRecords from "@/pages/TransactionRecords";
import { createContext, useState, useEffect } from "react";
import { toast } from "sonner";
import InstallPrompt from "@/components/InstallPrompt";

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => {},
  logout: () => {},
});

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // 检查是否已安装且用户未拒绝过提示
      const dismissedTime = localStorage.getItem('installPromptDismissed');
      const isDismissed = dismissedTime && (Date.now() - parseInt(dismissedTime) < 24 * 60 * 60 * 1000);
      
      if (!window.matchMedia('(display-mode: standalone)').matches && !isDismissed) {
        // 延迟显示提示，避免干扰用户体验
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 5000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // 检查是否已安装
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setShowInstallPrompt(false);
      }
    };
    
    window.addEventListener('appinstalled', () => {
      toast.success('应用已成功安装到主屏幕');
      setShowInstallPrompt(false);
      // 清除拒绝状态
      localStorage.removeItem('installPromptDismissed');
    });

    // 检查PWA安装状态
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if (!registration.active) {
          navigator.serviceWorker.register('/service-worker.js');
        }
      });
    }

    checkInstalled();
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          toast.success('应用已添加到主屏幕');
        }
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
      });
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/records" element={<TransactionRecords />} />
        <Route path="/report" element={<Report />} />
      </Routes>
      {showInstallPrompt && (
        <InstallPrompt 
          onInstall={handleInstallClick} 
          onDismiss={() => {
            setShowInstallPrompt(false);
            // 用户拒绝后，24小时内不再显示
            localStorage.setItem('installPromptDismissed', Date.now().toString());
          }} 
        />
      )}
    </AuthContext.Provider>
  );
}
