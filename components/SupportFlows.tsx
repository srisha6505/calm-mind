import React, { useState } from 'react';
import { SupportMode, CBTStep } from '../types';
import { CBT_STEPS, GROUNDING_EXERCISES } from '../constants';
import { Button } from './Button';
import { Brain, Leaf, ArrowRight, RotateCcw, MessageCircle } from 'lucide-react';

interface SupportFlowsProps {
  onSendToChat: (text: string) => void;
}

export const SupportFlows: React.FC<SupportFlowsProps> = ({ onSendToChat }) => {
  const [mode, setMode] = useState<SupportMode>('CBT');
  const [stepIndex, setStepIndex] = useState(0);
  const [groundingIndex, setGroundingIndex] = useState(0);

  const handleNextCBT = () => {
    if (stepIndex < CBT_STEPS.length - 1) setStepIndex(prev => prev + 1);
  };

  const handlePrevCBT = () => {
    if (stepIndex > 0) setStepIndex(prev => prev - 1);
  };

  const currentStep: CBTStep = CBT_STEPS[stepIndex];

  const handleStartInChat = () => {
    const prompt = `I want to work on ${currentStep.title}. ${currentStep.question}`;
    onSendToChat(prompt);
  };

  const handleNewGrounding = () => {
      setGroundingIndex((prev) => (prev + 1) % GROUNDING_EXERCISES.length);
  };

  return (
    <div className="bg-white dark:bg-dark-800 border border-stone-200 dark:border-dark-700 rounded-3xl p-6 flex flex-col gap-5 shadow-soft dark:shadow-xl flex-1 transition-colors duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-stone-800 dark:text-slate-200 font-bold text-sm tracking-wide uppercase">Support Flows</h3>
        <span className="text-xs bg-accent-cyan/10 text-accent-cyan px-2.5 py-1 rounded-lg border border-accent-cyan/20 font-medium">Guided steps</span>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 p-1.5 bg-stone-100 dark:bg-dark-900 rounded-xl">
        <button
          onClick={() => setMode('CBT')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
            mode === 'CBT' 
              ? 'bg-white dark:bg-dark-800 text-primary-600 dark:text-primary-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
              : 'text-stone-500 dark:text-slate-500 hover:text-stone-700 dark:hover:text-slate-300'
          }`}
        >
          <Brain className="w-3.5 h-3.5" /> CBT Mode
        </button>
        <button
          onClick={() => setMode('GROUNDING')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
            mode === 'GROUNDING' 
              ? 'bg-white dark:bg-dark-800 text-green-600 dark:text-green-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
              : 'text-stone-500 dark:text-slate-500 hover:text-stone-700 dark:hover:text-slate-300'
          }`}
        >
          <Leaf className="w-3.5 h-3.5" /> Grounding
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-stone-50 dark:bg-dark-900/50 rounded-2xl p-5 border border-stone-100 dark:border-dark-700 flex flex-col justify-between h-full min-h-[220px] transition-colors duration-300 relative overflow-hidden">
        
        {mode === 'CBT' && (
            <>
                <div className="z-10">
                    <p className="text-xs text-primary-600 dark:text-primary-400 font-bold mb-2 uppercase tracking-wider">CBT Session</p>
                    <h4 className="text-stone-800 dark:text-white font-semibold mb-2 text-lg">{currentStep.description}</h4>
                    <p className="text-stone-600 dark:text-slate-300 text-sm leading-relaxed">
                        {currentStep.question}
                    </p>
                </div>

                <div className="mt-6 z-10">
                     {/* Progress Dots */}
                     <div className="flex items-center gap-1.5 mb-5">
                        {CBT_STEPS.map((_, i) => (
                            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === stepIndex ? 'w-6 bg-primary-500' : 'w-1.5 bg-stone-300 dark:bg-dark-600'}`} />
                        ))}
                        <span className="text-xs text-stone-400 dark:text-slate-600 ml-2 font-mono">{stepIndex + 1}/{CBT_STEPS.length}</span>
                    </div>

                    <div className="flex items-center gap-2 justify-end">
                        <Button size="sm" variant="ghost" onClick={handleStartInChat}>
                             Chat
                        </Button>
                        {stepIndex > 0 && (
                            <Button size="sm" variant="secondary" onClick={handlePrevCBT}>Back</Button>
                        )}
                        {stepIndex < CBT_STEPS.length - 1 ? (
                             <Button size="sm" variant="primary" onClick={handleNextCBT}>Next</Button>
                        ) : (
                            <Button size="sm" variant="primary" onClick={() => setStepIndex(0)}>Restart</Button>
                        )}
                    </div>
                </div>
            </>
        )}

        {mode === 'GROUNDING' && (
             <>
             <div className="z-10">
                 <p className="text-xs text-green-600 dark:text-green-400 font-bold mb-2 uppercase tracking-wider">Immediate Relief</p>
                 <h4 className="text-stone-800 dark:text-white font-semibold mb-3 text-lg">Try this exercise</h4>
                 <div className="bg-white dark:bg-dark-800 p-4 rounded-xl border border-stone-200 dark:border-dark-600 shadow-sm">
                     <p className="text-stone-700 dark:text-slate-300 text-sm leading-relaxed">
                         {GROUNDING_EXERCISES[groundingIndex]}
                     </p>
                 </div>
             </div>
             <div className="mt-6 flex justify-end z-10">
                 <Button size="sm" variant="secondary" icon={<RotateCcw className="w-3 h-3"/>} onClick={handleNewGrounding}>
                     Try another
                 </Button>
             </div>
         </>
        )}
        
        {/* Decorative background element */}
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-gradient-to-br from-primary-100/20 to-purple-100/20 dark:from-primary-500/5 dark:to-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>

      </div>

      <div className="text-[10px] text-stone-400 dark:text-slate-500 leading-tight mt-1 px-1 text-center">
        For immediate danger, contact local emergency services.
      </div>
    </div>
  );
};