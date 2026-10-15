(function () {
  "use strict";

  const activeGames = new Map();

  function send(eventName, gameId, params) {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", eventName, {
      game_id: gameId,
      game_name: params.game_name || gameId,
      ...params,
    });
  }

  window.eslGameAnalytics = {
    start(gameId, params = {}) {
      const previous = activeGames.get(gameId);
      if (previous?.completed) {
        send("game_replay", gameId, {
          game_name: params.game_name || previous.gameName || gameId,
        });
      }

      const gameName = params.game_name || gameId;
      activeGames.set(gameId, {
        startedAt: Date.now(),
        completed: false,
        gameName,
      });
      send("game_start", gameId, { ...params, game_name: gameName });
    },

    complete(gameId, params = {}) {
      const session = activeGames.get(gameId);
      if (!session || session.completed) return;

      session.completed = true;
      send("game_complete", gameId, {
        game_name: params.game_name || session.gameName || gameId,
        duration_seconds: Math.max(
          0,
          Math.round((Date.now() - session.startedAt) / 1000),
        ),
        ...params,
      });
    },
  };
})();
