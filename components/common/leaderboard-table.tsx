import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  username: string;
  avatarUrl?: string;
  points: number;
  level: number;
  streak: number;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export function LeaderboardTable({
  entries,
  currentUserId,
}: LeaderboardTableProps) {
  const getRankBadge = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-20">Rank</TableHead>
          <TableHead>User</TableHead>
          <TableHead className="text-right">Level</TableHead>
          <TableHead className="text-right">XP</TableHead>
          <TableHead className="text-right">Streak</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((entry) => (
          <TableRow
            key={entry.userId}
            className={cn(
              entry.userId === currentUserId &&
                "bg-yellow-50 dark:bg-yellow-900/20",
            )}
          >
            <TableCell className="font-medium">
              <span className="text-xl">{getRankBadge(entry.rank)}</span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={entry.avatarUrl} />
                  <AvatarFallback>
                    {entry.name?.charAt(0) || entry.username?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{entry.name || entry.username}</p>
                  <p className="text-sm text-gray-500">@{entry.username}</p>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Badge variant="outline">Level {entry.level}</Badge>
            </TableCell>
            <TableCell className="text-right font-semibold">
              {entry.points.toLocaleString()} XP
            </TableCell>
            <TableCell className="text-right">
              <span className="flex items-center justify-end gap-1">
                <span className="text-orange-500">🔥</span>
                {entry.streak}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
