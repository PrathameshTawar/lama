import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Crown, Star } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  interviewsCompleted: number;
  skillsMastered: number;
  streak: number;
  rank: number;
}

const Leaderboard = () => {
  const leaderboardData: LeaderboardEntry[] = [
    {
      id: '1',
      name: 'Alex Chen',
      score: 1250,
      interviewsCompleted: 15,
      skillsMastered: 8,
      streak: 7,
      rank: 1
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      score: 1180,
      interviewsCompleted: 12,
      skillsMastered: 9,
      streak: 5,
      rank: 2
    },
    {
      id: '3',
      name: 'Mike Rodriguez',
      score: 1105,
      interviewsCompleted: 14,
      skillsMastered: 7,
      streak: 3,
      rank: 3
    },
    {
      id: '4',
      name: 'Emma Davis',
      score: 985,
      interviewsCompleted: 11,
      skillsMastered: 6,
      streak: 4,
      rank: 4
    },
    {
      id: '5',
      name: 'You',
      score: 750,
      interviewsCompleted: 8,
      skillsMastered: 5,
      streak: 2,
      rank: 5
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case 2: return "bg-gradient-to-r from-gray-300 to-gray-500";
      case 3: return "bg-gradient-to-r from-amber-400 to-amber-600";
      default: return "bg-muted";
    }
  };

  return (
    <Card className="p-6 border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-card-foreground flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span>Career Champions Leaderboard</span>
        </h2>
        <Badge variant="secondary" className="flex items-center space-x-1">
          <Star className="w-3 h-3" />
          <span>Weekly</span>
        </Badge>
      </div>

      <div className="space-y-4">
        {leaderboardData.map((entry, index) => (
          <div
            key={entry.id}
            className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 ${
              entry.name === 'You'
                ? 'bg-primary/10 border border-primary/20 shadow-md'
                : 'bg-card hover:bg-muted/50'
            }`}
          >
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${getRankBadgeColor(entry.rank)}`}>
              {getRankIcon(entry.rank)}
            </div>

            <Avatar className="w-10 h-10">
              <AvatarImage src={entry.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {entry.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className={`font-semibold ${entry.name === 'You' ? 'text-primary' : 'text-card-foreground'}`}>
                  {entry.name}
                  {entry.name === 'You' && <span className="ml-2 text-xs">(You)</span>}
                </h3>
                {entry.rank <= 3 && (
                  <Badge variant="secondary" className="text-xs">
                    Top {entry.rank}
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                <span>{entry.interviewsCompleted} interviews</span>
                <span>{entry.skillsMastered} skills</span>
                <span>{entry.streak} day streak</span>
              </div>
            </div>

            <div className="text-right">
              <div className={`text-lg font-bold ${entry.name === 'You' ? 'text-primary' : 'text-card-foreground'}`}>
                {entry.score.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">points</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-medium">Your Rank: #5</span>
          </div>
          <div className="text-muted-foreground">
            250 points to next rank
          </div>
        </div>
        <div className="mt-2 w-full bg-muted rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Complete interviews, master skills, and maintain streaks to climb the leaderboard!
        </p>
      </div>
    </Card>
  );
};

export default Leaderboard;
