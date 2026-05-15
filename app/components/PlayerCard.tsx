import React from 'react';

interface PlayerCardProps {
  playerId: string;
  name: string;
  role: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper';
  team: string;
  jerseyNumber?: number;
  stats?: {
    matches?: number;
    runs?: number;
    wickets?: number;
  };
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  playerId,
  name,
  role,
  team,
  jerseyNumber,
  stats,
}) => {
  const roleColors: Record<string, string> = {
    'batsman': 'bg-orange-100 text-orange-800',
    'bowler': 'bg-purple-100 text-purple-800',
    'all-rounder': 'bg-blue-100 text-blue-800',
    'wicket-keeper': 'bg-green-100 text-green-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{name}</h3>
          {jerseyNumber && <p className="text-gray-600 text-sm">#{jerseyNumber}</p>}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleColors[role]}`}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4">{team}</p>

      {stats && (
        <div className="grid grid-cols-3 gap-3 mb-4 pt-4 border-t">
          {stats.matches !== undefined && (
            <div className="text-center">
              <p className="text-gray-600 text-xs">Matches</p>
              <p className="text-lg font-bold">{stats.matches}</p>
            </div>
          )}
          {stats.runs !== undefined && (
            <div className="text-center">
              <p className="text-gray-600 text-xs">Runs</p>
              <p className="text-lg font-bold">{stats.runs}</p>
            </div>
          )}
          {stats.wickets !== undefined && (
            <div className="text-center">
              <p className="text-gray-600 text-xs">Wickets</p>
              <p className="text-lg font-bold">{stats.wickets}</p>
            </div>
          )}
        </div>
      )}

      <a href={`/players/${playerId}`} className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
        View Profile →
      </a>
    </div>
  );
};
