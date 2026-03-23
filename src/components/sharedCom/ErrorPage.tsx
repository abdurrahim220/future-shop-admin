import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = "An unexpected error occurred.";
  let errorStatus = "Error";

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data?.message || errorMessage;
    errorStatus = error.status.toString();
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-destructive/10 blur-3xl rounded-full scale-150" />
        <div className="relative bg-destructive/10 p-6 rounded-2xl border border-destructive/20">
          <AlertTriangle className="h-16 w-16 text-destructive" />
        </div>
      </div>

      <h1 className="text-6xl font-bold mb-2 text-destructive">{errorStatus}</h1>
      <h2 className="text-2xl font-semibold mb-6 tracking-tight">Oops! Something went wrong.</h2>
      
      <p className="text-muted-foreground max-w-md mb-8 text-lg bg-muted/50 p-4 rounded-lg border border-border italic">
        "{errorMessage}"
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          variant="default" 
          size="lg" 
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          onClick={() => window.location.reload()}
          className="gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
