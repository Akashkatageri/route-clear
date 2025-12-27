import { Link } from "wouter";
import { Ambulance, ShieldAlert } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-4">
            <ShieldAlert className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground font-display tracking-tight">
            Ambulance<span className="text-primary">PreClear</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced Emergency Response Route Coordination System
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto w-full">
          <Link href="/ambulance" className="group">
            <div className="
              h-64 flex flex-col items-center justify-center gap-6
              bg-white dark:bg-card rounded-3xl border-2 border-border
              shadow-xl hover:shadow-2xl hover:border-primary/50 hover:-translate-y-1
              transition-all duration-300 cursor-pointer p-8 text-center
            ">
              <div className="p-6 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-100 group-hover:scale-110 transition-transform duration-300">
                <Ambulance className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Ambulance Driver</h3>
                <p className="text-muted-foreground">Initiate emergency routes and broadcast location</p>
              </div>
            </div>
          </Link>

          <Link href="/traffic-police" className="group">
            <div className="
              h-64 flex flex-col items-center justify-center gap-6
              bg-white dark:bg-card rounded-3xl border-2 border-border
              shadow-xl hover:shadow-2xl hover:border-primary/50 hover:-translate-y-1
              transition-all duration-300 cursor-pointer p-8 text-center
            ">
              <div className="p-6 rounded-full bg-red-50 text-red-600 group-hover:bg-red-100 group-hover:scale-110 transition-transform duration-300">
                <ShieldAlert className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Traffic Police</h3>
                <p className="text-muted-foreground">Monitor incoming emergency vehicles and clear routes</p>
              </div>
            </div>
          </Link>
        </div>
        
        <div className="text-center text-sm text-muted-foreground pt-12">
          &copy; 2024 Emergency Response System. Prototype Build.
        </div>
      </div>
    </div>
  );
}
