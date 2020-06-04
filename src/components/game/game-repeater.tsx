import React from "react";

type GameRepeaterProps = {
  pauseDuration?: number;
  alternatePlayerOrder?: boolean;
};

export const GameRepeater: React.FC<GameRepeaterProps> = ({
  children,
  pauseDuration,
  alternatePlayerOrder,
}) => {
  const [gameCount, setGameCount] = React.useState(0);
  const [currentGameId, setCurrentGameId] = React.useState(0);

  const handleFinish = React.useCallback((id: number) => {
    setGameCount(id + 1);
  }, []);

  React.useEffect(() => {
    if (gameCount === currentGameId) return;

    if (pauseDuration === 0) {
      setCurrentGameId(gameCount);
      return;
    }

    const timeout = setTimeout(
      () => setCurrentGameId(gameCount),
      pauseDuration || 1000
    );

    return () => clearTimeout(timeout);
  }, [currentGameId, gameCount, pauseDuration]);

  return (
    <>
      {React.Children.map(
        children,
        (child, i) =>
          React.isValidElement(child) &&
          React.cloneElement(child, {
            id: currentGameId,
            onFinish: handleFinish,
            swapPlayers: alternatePlayerOrder && currentGameId % 2 === 1,
            key: i,
          })
      )}
    </>
  );
};
