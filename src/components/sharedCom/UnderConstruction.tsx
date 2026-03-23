import { Construction } from "lucide-react";

const UnderConstruction = ({ pageName }: { pageName?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-card rounded-xl shadow-sm border border-border animate-in fade-in zoom-in duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
        <div className="relative bg-primary/10 p-6 rounded-2xl border border-primary/20">
          <Construction className="h-20 w-20 text-primary animate-bounce" />
        </div>
      </div>
      
      <h2 className="text-3xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        {pageName ? `${pageName} is Under Construction` : "Page Under Construction"}
      </h2>
      
      <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
        We're working hard to bring you this feature. Please check back soon!
      </p>
      
      <div className="mt-10 flex gap-2">
        <div className="h-1.5 w-12 rounded-full bg-primary/30 overflow-hidden">
          <div className="h-full w-1/2 bg-primary rounded-full animate-infinite-scroll" />
        </div>
        <div className="h-1.5 w-12 rounded-full bg-primary/30 overflow-hidden">
          <div className="h-full w-1/2 bg-primary rounded-full animate-infinite-scroll [animation-delay:0.2s]" />
        </div>
        <div className="h-1.5 w-12 rounded-full bg-primary/30 overflow-hidden">
          <div className="h-full w-1/2 bg-primary rounded-full animate-infinite-scroll [animation-delay:0.4s]" />
        </div>
      </div>

      <style>{`
        @keyframes infinite-scroll {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default UnderConstruction;
