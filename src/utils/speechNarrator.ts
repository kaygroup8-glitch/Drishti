// Speech narration utility using native Web Speech API

class SpeechNarrator {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState: boolean = false;
  private isPausedState: boolean = false;
  private currentFindingIdState: number | null = null;
  private listeners: Array<() => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public isSupported(): boolean {
    return this.synth !== null;
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getStatus() {
    return {
      isSpeaking: this.isSpeakingState,
      isPaused: this.isPausedState,
      currentFindingId: this.currentFindingIdState,
    };
  }

  public stop() {
    if (!this.synth) return;
    this.synth.cancel();
    this.isSpeakingState = false;
    this.isPausedState = false;
    this.currentFindingIdState = null;
    this.notify();
  }

  public pause() {
    if (!this.synth || !this.isSpeakingState) return;
    this.synth.pause();
    this.isPausedState = true;
    this.notify();
  }

  public resume() {
    if (!this.synth) return;
    if (this.isPausedState) {
      this.synth.resume();
      this.isPausedState = false;
      this.notify();
    }
  }

  public speakText(text: string, findingId: number | null = null, onEnd?: () => void) {
    if (!this.synth) return;

    this.stop();

    const cleanText = text
      .replace(/—/g, ', ')
      .replace(/[#*`_]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95; // slightly deliberate for accessibility clarity
    utterance.pitch = 1.0;

    // Pick best English voice if available
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(
      (v) => (v.lang.startsWith('en') || v.lang.startsWith('en-US')) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      this.isSpeakingState = true;
      this.isPausedState = false;
      this.currentFindingIdState = findingId;
      this.notify();
    };

    utterance.onend = () => {
      this.isSpeakingState = false;
      this.isPausedState = false;
      this.currentFindingIdState = null;
      this.notify();
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis utterance error:', e);
      this.isSpeakingState = false;
      this.isPausedState = false;
      this.currentFindingIdState = null;
      this.notify();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public speakFullAudit(result: {
    imageName: string;
    accessibilityScore: number;
    scoreLabel: string;
    summary: string;
    highestPriorityImprovement: string;
    strongAreas: string[];
    areasNeedingAttention: string[];
    findings: Array<{
      id: number;
      title: string;
      lens: string;
      severity: string;
      whatDetected: string;
      whyItMatters: string;
      suggestedImprovement: string;
    }>;
  }) {
    const findingsSummary = result.findings
      .map(
        (f) =>
          `Observation number ${f.id}: ${f.title}. Lens: ${f.lens}. Severity: ${f.severity}. ${f.whatDetected}. Recommended improvement: ${f.suggestedImprovement}.`
      )
      .join(' ');

    const fullScript = `
      Drishti Accessibility Audit Report for ${result.imageName}.
      Overall Accessibility Score: ${result.accessibilityScore} out of 100. Category: ${result.scoreLabel}.
      Summary: ${result.summary}.
      Top priority recommendation: ${result.highestPriorityImprovement}.
      ${result.strongAreas.length > 0 ? `Key strengths identified: ${result.strongAreas.join('. ')}.` : ''}
      ${result.areasNeedingAttention.length > 0 ? `Primary areas needing attention: ${result.areasNeedingAttention.join('. ')}.` : ''}
      Detailed findings: ${findingsSummary}
      End of accessibility report.
    `;

    this.speakText(fullScript, null);
  }

  public speakFinding(finding: {
    id: number;
    title: string;
    lens: string;
    severity: string;
    whatDetected: string;
    whyItMatters: string;
    suggestedImprovement: string;
  }) {
    const script = `
      Observation ${finding.id}: ${finding.title}.
      Evaluated under the ${finding.lens} lens with ${finding.severity} severity.
      Observation: ${finding.whatDetected}.
      Why this matters: ${finding.whyItMatters}.
      Recommended improvement: ${finding.suggestedImprovement}.
    `;
    this.speakText(script, finding.id);
  }
}

export const narrator = new SpeechNarrator();
