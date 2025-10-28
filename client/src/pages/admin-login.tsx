import { useEffect } from "react";
import { signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Loader2 } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Handle redirect result on page load
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          toast({
            title: "Login successful",
            description: `Welcome, ${result.user.displayName || result.user.email}`,
          });
          setLocation("/admin");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        toast({
          title: "Login failed",
          description: error.message || "Could not sign in. Please try again.",
          variant: "destructive",
        });
      });
  }, [toast, setLocation]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Could not initiate Google sign-in",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <MapPin className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-tight font-heading mb-2">
            Admin Login
          </h1>
          <p className="text-muted-foreground text-sm">
            Sign in to manage launderette listings
          </p>
        </div>

        <Button
          onClick={handleGoogleLogin}
          size="lg"
          className="w-full"
          data-testid="button-google-login"
        >
          <SiGoogle className="w-5 h-5 mr-2" />
          Sign in with Google
        </Button>

        <div className="mt-6 text-center">
          <a 
            href="/" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-testid="link-back-home"
          >
            ← Back to directory
          </a>
        </div>
      </Card>
    </div>
  );
}
