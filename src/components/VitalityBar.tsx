interface VitalityBarProps {
  score: number;
  showLabel?: boolean;
}

export const VitalityBar = ({ score, showLabel = true }: VitalityBarProps) => {
  const getColor = () => {
    if (score >= 70) return 'bg-primary';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-destructive';
  };

  const getGlow = () => {
    if (score >= 70) return '0 0 10px hsl(142 71% 45% / 0.8)';
    if (score >= 40) return '0 0 10px hsl(45 93% 47% / 0.8)';
    return '0 0 10px hsl(0 84% 60% / 0.8)';
  };

  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Vitality Score</span>
          <span className="font-bold text-foreground">{score}%</span>
        </div>
      )}
      <div className="vitality-bar">
        <div
          className={`vitality-bar-fill ${getColor()}`}
          style={{
            width: `${score}%`,
            boxShadow: getGlow(),
          }}
        />
      </div>
    </div>
  );
};
