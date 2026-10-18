import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Play,
  Pause,
  SkipForward,
  CheckCircle,
  Clock,
  Mic,
  MicOff,
  MessageSquare,
  Trophy,
  Star,
  Award,
  Zap,
  Volume2,
  Loader2
} from "lucide-react";
import { getInterviewFeedback, type InterviewFeedback } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Minimal typing for the browser Web Speech API (not in the default DOM lib).
interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

const getSpeechRecognition = (): (new () => SpeechRecognitionLike) | undefined => {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as Record<string, unknown>;
  return (w.SpeechRecognition || w.webkitSpeechRecognition) as (new () => SpeechRecognitionLike) | undefined;
};

// Offline scoring used when the backend is unreachable.
const localFeedback = (answer: string, expectedPoints: string[]): InterviewFeedback => {
  const words = new Set(answer.toLowerCase().match(/[a-z0-9]{3,}/g) ?? []);
  const covered = expectedPoints.filter((p) => (p.toLowerCase().match(/[a-z0-9]{3,}/g) ?? []).some((w) => words.has(w)));
  const wordCount = answer.trim().split(/\s+/).length;
  const score = Math.round(100 * (0.55 * (covered.length / Math.max(expectedPoints.length, 1)) + 0.45 * Math.min(wordCount / 120, 1)));
  return {
    score,
    summary: "Offline estimate - start the backend for detailed AI feedback.",
    strengths: wordCount >= 80 ? ["Answer is detailed and well developed."] : [],
    improvements: wordCount < 80 ? ["Expand your answer with a concrete example and measurable results."] : [],
    covered_points: covered,
    source: "fallback",
  };
};

interface Question {
  id: string;
  type: 'technical' | 'behavioral';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  hint: string;
  expectedPoints: string[];
}

const mockQuestions: Question[] = [
  {
    id: '1',
    type: 'behavioral',
    difficulty: 'medium',
    question: "Tell me about a time when you had to learn a new technology quickly to complete a project.",
    hint: "Use the STAR method (Situation, Task, Action, Result) to structure your answer.",
    expectedPoints: [
      "Specific situation and timeline pressure",
      "Learning approach and resources used",
      "How you applied the new knowledge",
      "Measurable results and lessons learned"
    ]
  },
  {
    id: '2',
    type: 'technical',
    difficulty: 'medium',
    question: "Explain the difference between SQL JOINs and when you would use each type.",
    hint: "Cover INNER, LEFT, RIGHT, and FULL OUTER JOINs with examples.",
    expectedPoints: [
      "INNER JOIN - returns matching records",
      "LEFT JOIN - all from left table + matches",
      "RIGHT JOIN - all from right table + matches", 
      "FULL OUTER JOIN - all records from both tables"
    ]
  },
  {
    id: '3',
    type: 'behavioral',
    difficulty: 'hard',
    question: "Describe a situation where you had to make a difficult decision that affected your team.",
    hint: "Focus on your decision-making process and leadership skills.",
    expectedPoints: [
      "Context and stakeholders involved",
      "Decision-making criteria and process",
      "Communication with team members",
      "Outcome and lessons learned"
    ]
  }
];

const MockInterview = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcribedText, setTranscribedText] = useState("");
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const recordingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const { toast } = useToast();
  const speechSupported = Boolean(getSpeechRecognition());

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / mockQuestions.length) * 100;

  // Cleanup intervals on unmount or question change
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      recognitionRef.current?.stop();
    };
  }, []);

  // Reset recording state when moving to next question
  useEffect(() => {
    setIsRecording(false);
    setRecordingTime(0);
    setTranscribedText("");
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
  }, [currentQuestionIndex]);

  const startInterview = () => {
    if (isActive) return;
    setIsActive(true);
    // Start timer simulation
    timerIntervalRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
  };

  const startRecording = () => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      toast({
        title: "Voice input not supported",
        description: "Your browser doesn't support speech recognition. Try Chrome or Edge, or type your answer.",
        variant: "destructive",
      });
      return;
    }

    startInterview();
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    const baseAnswer = answer.trim();
    let spoken = "";

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          spoken = `${spoken} ${event.results[i][0].transcript}`.trim();
        }
      }
      setTranscribedText(spoken);
      setAnswer(baseAnswer ? `${baseAnswer} ${spoken}` : spoken);
    };
    recognition.onerror = (event) => {
      if (event.error !== "no-speech" && event.error !== "aborted") {
        toast({ title: "Voice input error", description: event.error, variant: "destructive" });
      }
    };
    recognition.onend = () => stopRecording();

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    setRecordingTime(0);
    setTranscribedText("");
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswer("");
      setShowFeedback(false);
      setFeedback(null);
    }
  };

  const submitAnswer = async () => {
    if (isRecording) stopRecording();
    setIsEvaluating(true);

    let result: InterviewFeedback;
    try {
      result = await getInterviewFeedback(currentQuestion.question, answer, currentQuestion.expectedPoints);
    } catch {
      result = localFeedback(answer, currentQuestion.expectedPoints);
    }
    setFeedback(result);
    setIsEvaluating(false);
    setShowFeedback(true);

    // Gamification: points scale with the evaluated answer quality (5-25).
    const pointsEarned = 5 + Math.round(result.score / 5);

    setScore(prev => prev + pointsEarned);
    setStreak(prev => prev + 1);

    // Check for achievements
    const newAchievements = [...achievements];

    if (streak + 1 >= 3 && !newAchievements.includes("Interview Streak")) {
      newAchievements.push("Interview Streak");
    }
    if (score + pointsEarned >= 50 && !newAchievements.includes("Interview Pro")) {
      newAchievements.push("Interview Pro");
    }
    if (timeElapsed < 180 && !newAchievements.includes("Speed Demon")) {
      newAchievements.push("Speed Demon");
    }

    setAchievements(newAchievements);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-accent/5 to-primary/5 border-accent/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-card-foreground mb-2">Mock Interview Session</h2>
            <p className="text-muted-foreground">Practice with real interview questions and get AI feedback</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{formatTime(timeElapsed)}</div>
            <div className="text-sm text-muted-foreground">Time Elapsed</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-card-foreground">
              Question {currentQuestionIndex + 1} of {mockQuestions.length}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Gamification Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-lg font-bold text-card-foreground">{score}</span>
            </div>
            <div className="text-xs text-muted-foreground">Points</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="text-lg font-bold text-card-foreground">{streak}</span>
            </div>
            <div className="text-xs text-muted-foreground">Streak</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Trophy className="w-4 h-4 text-purple-500" />
              <span className="text-lg font-bold text-card-foreground">{achievements.length}</span>
            </div>
            <div className="text-xs text-muted-foreground">Achievements</div>
          </div>
        </div>

        {/* Achievements Display */}
        {achievements.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {achievements.map((achievement, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <Award className="w-3 h-3" />
                  <span>{achievement}</span>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Question Card */}
      <Card className="p-6 border-primary/20">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge 
                variant={currentQuestion.type === 'technical' ? 'default' : 'secondary'}
                className="capitalize"
              >
                <MessageSquare className="w-3 h-3 mr-1" />
                {currentQuestion.type}
              </Badge>
              <Badge 
                variant="outline" 
                className={`capitalize ${
                  currentQuestion.difficulty === 'easy' ? 'border-success text-success' :
                  currentQuestion.difficulty === 'medium' ? 'border-primary text-primary' :
                  'border-destructive text-destructive'
                }`}
              >
                {currentQuestion.difficulty}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">2-3 min recommended</span>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Question:</h3>
            <p className="text-card-foreground leading-relaxed">{currentQuestion.question}</p>
          </div>

          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
            <h4 className="font-medium text-primary mb-2">💡 Hint:</h4>
            <p className="text-sm text-muted-foreground">{currentQuestion.hint}</p>
          </div>
        </div>
      </Card>

      {/* Answer Section */}
      <Card className="p-6 border-primary/20">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-card-foreground">Your Answer</h3>
          <div className="flex items-center space-x-2">
              {!isActive && (
                <Button onClick={startInterview} className="flex items-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Start Interview</span>
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={isRecording ? stopRecording : startRecording}
                aria-label={isRecording ? "Stop Recording" : "Start Recording"}
                title={speechSupported ? undefined : "Voice input requires Chrome or Edge"}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here or use voice recording..."
            onFocus={startInterview}
            className="min-h-[120px] resize-none"
          />

          {/* Voice Recording Status */}
          {isRecording && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-red-700">Recording...</span>
                <span className="text-sm text-red-600">{recordingTime}s</span>
              </div>
            </div>
          )}

          {/* Transcribed Text */}
          {transcribedText && !isRecording && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Voice Transcribed:</span>
              </div>
              <p className="text-sm text-blue-800 italic">"{transcribedText}"</p>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={nextQuestion} disabled={currentQuestionIndex === mockQuestions.length - 1}>
              <SkipForward className="w-4 h-4 mr-2" />
              {showFeedback ? "Next Question" : "Skip Question"}
            </Button>
            <Button onClick={submitAnswer} disabled={!answer.trim() || isEvaluating || showFeedback}>
              {isEvaluating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              {isEvaluating ? "Evaluating..." : "Submit Answer"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Feedback */}
      {showFeedback && feedback && (
        <Card className="p-6 border-success/20 bg-success/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-success">AI Feedback</h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{feedback.score}/100</div>
              {feedback.source === "fallback" && (
                <div className="text-xs text-muted-foreground">Offline estimate</div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-card-foreground">{feedback.summary}</p>

            {feedback.strengths.length > 0 && (
              <div>
                <h4 className="font-medium text-card-foreground">Strengths:</h4>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  {feedback.strengths.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              </div>
            )}

            {feedback.improvements.length > 0 && (
              <div>
                <h4 className="font-medium text-card-foreground">To improve:</h4>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  {feedback.improvements.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              </div>
            )}

            <div className="pt-3 border-t border-success/20">
              <h4 className="font-medium text-card-foreground">Key Points to Cover:</h4>
              <ul className="mt-2 space-y-1">
                {currentQuestion.expectedPoints.map((point, index) => {
                  const covered = feedback.covered_points.includes(point);
                  return (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <CheckCircle
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${covered ? "text-success" : "text-muted-foreground/40"}`}
                      />
                      <span className={covered ? "text-card-foreground" : "text-muted-foreground"}>{point}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MockInterview;