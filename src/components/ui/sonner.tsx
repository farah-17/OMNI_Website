import { Toaster as SonnerToaster } from "sonner";

const Toaster = () => {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group glass border border-white/10 backdrop-blur-3xl rounded-2xl shadow-2xl text-foreground font-body text-sm",
          title: "font-heading font-semibold text-foreground",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground rounded-xl font-heading text-xs px-3 py-1.5",
          cancelButton: "bg-white/5 text-muted-foreground rounded-xl font-heading text-xs px-3 py-1.5",
          success: "border-green-500/20 bg-green-500/10",
          error: "border-destructive/20 bg-destructive/10",
        },
      }}
    />
  );
};

export { Toaster };
