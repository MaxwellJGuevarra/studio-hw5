import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BrainCircuit } from "lucide-react";

interface AISummaryProps {
  summary?: string;
  actionableInsights?: string;
  isLoading: boolean;
}

export function AISummary({ summary, actionableInsights, isLoading }: AISummaryProps) {
  return (
    <Card className="bg-primary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <BrainCircuit className="w-6 h-6" />
          AI Generated Attack Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-1" />
              <Skeleton className="h-4 w-4/5 mt-1" />
            </div>
            <div>
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-1" />
              <Skeleton className="h-4 w-2/3 mt-1" />
            </div>
          </div>
        ) : (
          <>
            <div>
              <h3 className="font-semibold text-lg text-foreground">Summary</h3>
              <p className="text-muted-foreground">{summary || "No summary generated."}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">Actionable Insights</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{actionableInsights || "No insights generated."}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
