import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Clock, 
  Eye, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Award,
  Phone,
  Mail,
  Building
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function About() {
  const pillars = [
    {
      icon: <Zap className="w-8 h-8 text-[#f59e0b]" />,
      title: "Dynamic Escalation",
      desc: "No grievance goes ignored. Our 4-tier hierarchy ensures that unresolved issues automatically move up to the highest authority."
    },
    {
      icon: <Clock className="w-8 h-8 text-[#f59e0b]" />,
      title: "SLA Enforcement",
      desc: "We use Time-Locks. Once an authority commits to a date, the system locks the grievance to ensure quality resolution time, preventing premature escalation."
    },
    {
      icon: <Eye className="w-8 h-8 text-[#f59e0b]" />,
      title: "Public Accountability",
      desc: "Every ticket has a unique Token ID and is tracked in a public feed, ensuring 100% transparency for the entire JEC community."
    }
  ];

  const roadmap = [
    {
      phase: "Phase 1",
      title: "Grassroot Level",
      action: "Direct resolution by Assigned Staff/Warden.",
      icon: <Users className="w-5 h-5" />
    },
    {
      phase: "Phase 2",
      title: "Administrative Oversight",
      action: "Department Head intervention for persistent issues.",
      icon: <Building className="w-5 h-5" />
    },
    {
      phase: "Phase 3",
      title: "Strategic Escalation",
      action: "Involvement of Branch HOD and Senior Administrative Officers.",
      icon: <ShieldCheck className="w-5 h-5" />
    },
    {
      phase: "Phase 4",
      title: "Apex Authority",
      action: "Final Committee Review presided over by the Principal, JEC.",
      icon: <Award className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#1e3a8a]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <motion.div {...fadeInUp}>
            <h1 className="text-4xl md:text-6xl font-black text-[#1e3a8a] mb-4 tracking-tight">
              The JEC-RESOLVE Ecosystem
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-bold uppercase tracking-[0.3em] max-w-2xl mx-auto">
              Empowering Students through Transparent Governance
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Pillars Grid */}
      <section className="py-12 px-4 bg-white/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {pillars.map((pillar, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-slate-100 hover:border-[#f59e0b]/30 transition-all duration-300 group hover:-translate-y-2"
              >
                <div className="bg-[#1e3a8a]/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-extrabold text-[#1e3a8a] mb-4 uppercase tracking-wide">{pillar.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Vertical Roadmap */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-black text-[#1e3a8a] uppercase tracking-widest mb-2">Advanced Escalation Roadmap</h2>
            <div className="w-24 h-1.5 bg-[#f59e0b] mx-auto rounded-full" />
          </motion.div>

          <div className="relative">
            {/* Roadmap Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-[#1e3a8a]/10 -translate-x-1/2 hidden md:block" />
            
            <div className="space-y-12 relative overflow-hidden">
              {roadmap.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Content Card */}
                  <div className="flex-1 w-full">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-[#1e3a8a] relative group hover:shadow-2xl transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-black text-[#f59e0b] uppercase tracking-[0.2em]">{item.phase}</span>
                      </div>
                      <h4 className="text-xl font-bold text-[#1e3a8a] mb-2">{item.title}</h4>
                      <p className="text-slate-600 text-sm font-medium"><span className="text-[#f59e0b] font-black mr-2">ACTION:</span> {item.action}</p>
                    </div>
                  </div>

                  {/* Icon Marker */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#1e3a8a] text-[#f59e0b] flex items-center justify-center shadow-lg border-4 border-white transform group-hover:scale-125 transition-transform duration-300">
                      {item.icon}
                    </div>
                  </div>

                  {/* Spacer for 2nd column */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Footer Info */}
      <section className="py-12 bg-[#1e3a8a] text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeInUp}>
              <h3 className="text-2xl font-black mb-6 uppercase tracking-widest text-[#f59e0b]">Get In Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-[#f59e0b] group-hover:text-[#1e3a8a] transition-all">
                    <Phone className="w-5 h-5" />
                  </div>
                  <p className="font-bold">+91 7612331953</p>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-[#f59e0b] group-hover:text-[#1e3a8a] transition-all">
                    <Mail className="w-5 h-5" />
                  </div>
                  <p className="font-bold">prinjec.jbp@mp.gov.in</p>
                </div>
                <div className="flex items-center gap-4 group text-white/70">
                  <MapPin className="w-8 h-8 flex-shrink-0" />
                  <p className="text-sm font-medium uppercase tracking-widest leading-relaxed">
                    Jabalpur Engineering College, Jabalpur (M.P.) — Est. 1947
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20"
            >
              <h4 className="text-[#f59e0b] font-black uppercase tracking-widest text-sm mb-4">Official Notice</h4>
              <p className="text-sm font-medium leading-loose text-white/80 italic">
                "Technical education is the foundation for national progress. JEC-RESOLVE is our commitment to ensuring that every student has an environment that fosters growth, uninterrupted by administrative hurdles."
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
