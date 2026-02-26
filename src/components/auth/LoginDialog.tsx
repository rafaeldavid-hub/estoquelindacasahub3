import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { X, LogIn } from "lucide-react";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Simula delay de login
    setTimeout(() => {
      login();
      setIsLoading(false);
      onOpenChange(false);
    }, 800);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop com blur */}
      <div
        className="fixed inset-0 z-40 backdrop-blur-md bg-white/20 dark:bg-black/20 animate-fade-in"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal glasmorfo */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in-scale">
        <div className="relative w-full max-w-md bg-gray-100/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-8 dark:bg-black/90">
          {/* Botão fechar */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 rounded-full p-2 hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center">
                <LogIn className="h-6 w-6 text-accent-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center font-display">Ambiente de Funcionários</h2>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Aqui o acesso será restrito apenas para funcionários autorizados. Faça login para acessar. </p>
          </div>

          {/* Conteúdo */}
          <div className="space-y-6 mb-8">
            <div className="rounded-lg bg-muted/50 p-4 border border-white/10">
              <p className="text-xs text-muted-foreground mb-3 font-semibold">VOCÊ ESTÁ ACESSANDO COMO:</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-accent-foreground">
                  🦅
                </div>
                <div>
                  <p className="font-semibold text-sm">Rafael David</p>
                  <p className="text-xs text-muted-foreground">Acesso autorizado</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">Funcionalidades:</h3>
              <ul className="space-y-2">
                {[
                  " Dashboard de vendas",
                  " Histórico de transações",
                  " Ranking de vendedores",
                  " Relatórios mensais",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Rodapé com botões */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleLogin}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="inline-block mr-2 animate-spin">⏳</span>
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Acessar
                </>
              )}
            </Button>
          </div>

          {/* Aviso */}
          <p className="text-xs text-muted-foreground text-center mt-4">
            Você será redirecionado para o dashboard de vendas
          </p>
        </div>
      </div>
    </>
  );
}
