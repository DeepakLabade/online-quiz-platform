import { Footer } from "@/components/home/footer";
import { Hero } from "@/components/home/hero";
import { Navbar } from "@/components/home/navbar";
import { StaticPreview } from "@/components/home/static-preview";

function App() {
  return (
    <div className="min-h-screen bg-white selection:bg-slate-900 selection:text-white">
      <Navbar />
      
      <main>
        <Hero />
        
        <StaticPreview />
        
        <section className="py-40 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">Ready to start?</h2>
            <p className="text-slate-500 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Create your account in seconds and start building engaging quizzes for your community. 
            </p>
            <button className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all active:scale-95 shadow-2xl shadow-slate-200">
              Create free account
            </button>
            <p className="mt-8 text-slate-400 text-sm font-medium">No credit card required • Forever free for small groups</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
